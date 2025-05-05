import fs from 'fs/promises';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const CONFIG_FILE = 'config.json';
const OUTPUT_FILE = 'output.json';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function loadConfig(filename = CONFIG_FILE) {
  try {
    const raw = await fs.readFile(filename, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Cannot read ${filename}: ${err.message}`);
  }
}

function buildUrl(endpoint, params) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  return url.toString();
}

async function searchMovies(query, apiKey) {
  const url = buildUrl('/search/movie', {
    query,
    api_key: apiKey,
    language: 'en-US',
    include_adult: 'false',
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB search error: ${res.status} ${res.statusText}`);
  return res.json();
}

async function getMovieDetails(id, apiKey) {
  const url = buildUrl(`/movie/${id}`, {
    api_key: apiKey,
    language: 'en-US',
    append_to_response: 'videos,images',
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB details error: ${res.status} ${res.statusText}`);
  return res.json();
}

async function saveOutput(obj, filename = OUTPUT_FILE) {
  await fs.writeFile(filename, JSON.stringify(obj, null, 2), 'utf8');
}

async function main() {
  try {
    const { api_key } = await loadConfig();
    if (!api_key) throw new Error('The field "api_key" is missing in config.json');

    const rl = readline.createInterface({ input, output });
    const searchQuery = await rl.question('Enter a movie title to search: ');
    console.log(`Searching for "${searchQuery}"...`);

    const searchData = await searchMovies(searchQuery, api_key);
    const topResults = searchData.results.slice(0, 5);

    if (topResults.length === 0) {
      console.log('No results found.');
      rl.close();
      return;
    }

    console.log('\nResults:');
    topResults.forEach((m, i) => {
      console.log(`${i + 1}. ${m.title} (${m.release_date?.slice(0, 4) || 'N/A'})`);
    });

    let choice;
    while (true) {
      const answer = await rl.question(`\nSelect a movie number (1‑${topResults.length}): `);
      const num = Number(answer);
      if (num >= 1 && num <= topResults.length) {
        choice = num - 1;
        break;
      }
      console.log('Invalid input, try again.');
    }

    const selected = topResults[choice];
    const details = await getMovieDetails(selected.id, api_key);

    console.log('\n=== Movie Details ===');
    console.log(`Title: ${details.title}`);
    console.log(`Original Title: ${details.original_title}`);
    console.log(`Release Date: ${details.release_date}`);
    console.log(`TMDB Rating: ${details.vote_average} (${details.vote_count} votes)`);
    console.log(`Overview: ${details.overview}`);

    await saveOutput({ search: searchData, chosen: details });
    console.log(`\nFull data saved to ${OUTPUT_FILE}`);

    rl.close();
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

main();