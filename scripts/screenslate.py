"""Fetch the next two weeks of NYC screenings from Screen Slate into data/screenslate.json.

Run by .github/workflows/screenslate.yml twice a day. Each listings page carries its data
as JSON in <script class="listings-preload">, so no HTML scraping is needed beyond that.
Python standard library only. Usage: python scripts/screenslate.py [output-path] [days]
"""
import datetime as dt
import html
import json
import re
import sys
import time
import urllib.error
import urllib.request
from zoneinfo import ZoneInfo

BASE = "https://www.screenslate.com"
UA = "WatchDiary/1.0 (personal film diary; twice-daily fetch; github.com/bluefalcon55/watch-diary)"
PRELOAD = re.compile(r'<script[^>]*class="listings-preload"[^>]*>(.*?)</script>', re.S)
SPAN = re.compile(r"<span[^>]*>(.*?)</span>", re.S)
TAGS = re.compile(r"<[^>]+>")


def text(s):
    return re.sub(r"\s+", " ", html.unescape(TAGS.sub(" ", s or ""))).strip()


def spans(s):
    return [t for t in (text(x) for x in SPAN.findall(s or "")) if t]


HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


def fetch(day):
    req = urllib.request.Request(f"{BASE}/listings/{day}", headers=HEADERS)
    err = None
    for attempt in range(2):
        t0 = time.time()
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                page = r.read().decode("utf-8", "replace")
            m = PRELOAD.search(page)
            if not m:
                raise ValueError(f"listings data not found on the page ({len(page)} bytes: {page[:120]!r})")
            print(f"{day}: ok in {time.time() - t0:.1f}s", flush=True)
            return json.loads(m.group(1))
        except urllib.error.HTTPError as e:
            err = f"HTTP {e.code} {e.headers.get('server', '')} {e.read(200)!r}"
            if e.code in (403, 429, 503):
                break  # blocked; retrying won't help
        except Exception as e:  # noqa: BLE001
            err = f"{type(e).__name__}: {e}"
        print(f"{day}: attempt {attempt + 1} failed after {time.time() - t0:.1f}s: {err}", flush=True)
        time.sleep(3)
    raise RuntimeError(f"{day}: {err}")


def parse_films(info, labels):
    """media_title_info is a flat run of spans: director, year, runtime, format, then the next film."""
    titles = spans(labels)
    films, cur = [], None

    def new():
        nonlocal cur
        cur = {"director": "", "year": None, "runtime": None, "format": ""}
        films.append(cur)

    for t in spans(info):
        if re.fullmatch(r"(18|19|20)\d\d", t):
            if cur is None or cur["year"] or cur["runtime"]:
                new()
            cur["year"] = int(t)
        elif re.fullmatch(r"\d+\s*M", t, re.I):
            if cur is None or cur["runtime"]:
                new()
            cur["runtime"] = int(re.match(r"\d+", t).group())
        elif re.fullmatch(r"(35|16|70|8|super ?8)\s*mm|dcp|digital( video)?|video|vhs|4k|2k|imax", t, re.I):
            if cur is None:
                new()
            cur["format"] = t.upper().replace(" ", "") if "mm" in t.lower() else t.upper()
        else:  # a director name starts a new film once the current one has details
            if cur is None or cur["director"] or cur["year"] or cur["runtime"] or cur["format"]:
                new()
            cur["director"] = t
    for i, t in enumerate(titles):
        if i < len(films):
            films[i]["title"] = t
        else:
            films.append({"title": t, "director": "", "year": None, "runtime": None, "format": ""})
    return [f for f in films if f.get("title")]


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "data/screenslate.json"
    ndays = int(sys.argv[2]) if len(sys.argv) > 2 else 14
    today = dt.datetime.now(ZoneInfo("America/New_York")).date()
    shows, days, failed = {}, [], []
    for n in range(ndays):
        day = (today + dt.timedelta(days=n)).isoformat()
        try:
            data = fetch(day)
        except Exception as e:  # noqa: BLE001
            print("skip", e, flush=True)
            failed.append(day)
            if not days and len(failed) >= 2:
                break  # blocked from the start; don't spend minutes retrying every day
            continue
        days.append(day)
        by_nid = {}
        for t in data.get("screeningsByDate") or []:
            by_nid.setdefault(str(t.get("nid")), []).append(t)
        for s in data.get("screenings") or []:
            nid = str(s.get("nid"))
            venue = text(s.get("venue_title"))
            slug = (re.search(r'href="/venues/([^"]+)"', s.get("venue_title") or "") or [None, ""])[1]
            films = parse_films(s.get("media_title_info"), s.get("media_title_labels"))
            title = text(s.get("field_display_title")) or (films[0]["title"] if len(films) == 1 else "")
            if not title:
                title = re.sub(r"\s+at\s+[^@]+$", "", text(s.get("title"))) or text(s.get("title"))
            rec = shows.setdefault(nid, {
                "id": nid,
                "title": title,
                "series": text(s.get("field_series")),
                "venue": venue,
                "venueSlug": slug,
                "url": (s.get("field_url") or "").strip(),
                "note": text(s.get("body"))[:300],
                "films": films,
                "times": [],
            })
            seen = {x["dt"] for x in rec["times"]}
            for t in by_nid.get(nid, []):
                ts = (t.get("field_timestamp") or "")[:16]
                if ts and ts not in seen:
                    rec["times"].append({"dt": ts, "note": text(t.get("field_note"))[:160]})
                    seen.add(ts)
        time.sleep(1.5)
    if not days:
        sys.exit("Screen Slate couldn't be reached for any day; keeping the previous file.")
    items = [r for r in shows.values() if r["times"]]
    for r in items:
        r["times"].sort(key=lambda x: x["dt"])
    items.sort(key=lambda r: (r["times"][0]["dt"], r["venue"]))
    doc = {"source": "Screen Slate", "sourceUrl": BASE + "/listings", "city": "New York",
           "updated": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
           "days": days, "screenings": items}
    with open(out, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(items)} screenings over {len(days)} days" + (f"; missed {failed}" if failed else ""))


if __name__ == "__main__":
    main()
