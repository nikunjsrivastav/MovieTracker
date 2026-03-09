// TMDB API Layer
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

export const IMG_SIZES = {
  poster_sm: `${IMG_BASE}/w185`,
  poster_md: `${IMG_BASE}/w342`,
  poster_lg: `${IMG_BASE}/w500`,
  backdrop_sm: `${IMG_BASE}/w780`,
  backdrop_lg: `${IMG_BASE}/w1280`,
  backdrop_original: `${IMG_BASE}/original`,
  profile_sm: `${IMG_BASE}/w185`,
  profile_md: `${IMG_BASE}/h632`,
};

function getApiKey() {
  return localStorage.getItem('tmdb_api_key') || import.meta.env.VITE_TMDB_API_KEY || '';
}

export function hasApiKey() {
  return !!getApiKey();
}

async function fetchTMDB(endpoint, params = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('TMDB API key not configured. Go to Settings to add your key.');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid TMDB API key. Check your key in Settings.');
    throw new Error(`TMDB API error: ${res.status}`);
  }
  return res.json();
}

export async function searchMovies(query, page = 1) {
  return fetchTMDB('/search/movie', { query, page });
}

export async function getTrending(timeWindow = 'week') {
  return fetchTMDB(`/trending/movie/${timeWindow}`);
}

export async function getPopular(page = 1) {
  return fetchTMDB('/movie/popular', { page });
}

export async function getTopRated(page = 1) {
  return fetchTMDB('/movie/top_rated', { page });
}

export async function getNowPlaying(page = 1) {
  return fetchTMDB('/movie/now_playing', { page });
}

export async function getMovieDetails(id) {
  return fetchTMDB(`/movie/${id}`, { append_to_response: 'credits,videos' });
}

export async function getGenres() {
  return fetchTMDB('/genre/movie/list');
}

export async function getMoviesByGenre(genreId, page = 1) {
  return fetchTMDB('/discover/movie', { with_genres: genreId, page });
}
