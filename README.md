# TMDB Movie Search CLI

A lightweight Node.js command‑line tool that lets you search movies via **The Movie Database (TMDB) API**, pick a result, and instantly view key details.  
Perfect for quick look‑ups without opening a browser.

---

## Features
- Search TMDB in English (`en‑US` locale)
- Shows the top 5 matches and lets you pick by number
- Displays title, original title, release date, TMDB rating and overview
- Saves full search + selected movie response to `output.json` for later reference
- Zero external deps if you’re on Node 18 + (built‑in `fetch`)

---

## Prerequisites
| Tool | Version |
|------|---------|
| **Node.js** | 18 + (or older Node + `node-fetch`) |
| **TMDB API Key** | Free — get yours at <https://www.themoviedb.org/settings/api> |

---
### 📦 Setup & Run

#### 1 — Clone the repo
~~~bash
git clone https://github.com/<your‑username>/tmdb-movie-search-cli.git
cd tmdb-movie-search-cli
~~~

#### 2 — (only for Node < 18) install **node‑fetch**
~~~bash
npm i node-fetch
~~~

#### 3 — Add your TMDB API key  
Create **`config.json`** in the project root:
~~~json
{
  "api_key": "<YOUR_TMDB_KEY>"
}
~~~
> **Tip:** this file is already in `.gitignore`, so your key stays private.

#### 4 — Run the app
~~~bash
node index.js
~~~
