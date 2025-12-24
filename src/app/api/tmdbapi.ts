import axios from "axios";

const ApiKey = process.env.TMDB_API_KEY;
const BaseUrl = "https://api.themoviedb.org/3";

interface Movies {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

export const fetchTmdbApi = async (endpoint: string) => {
  if (!ApiKey) throw new Error("TMDB_API_KEY is not set");

  const separator = endpoint.includes("?") ? "&" : "?";
  try {
    const response = await axios.get(
      `${BaseUrl}${endpoint}${separator}api_key=${ApiKey}&language=en-US`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`TMDB API request failed: ${error?.message ?? error}`);
  }
};


export const fetchTmdbImage = (path: string, size: string = "original") => {
    return `https://image.tmdb.org/t/p/${size}${path}`
}
// Movies
export const getPopularMovies = async () => {
  const popularMovies = await fetchTmdbApi('/movie/popular');
  return popularMovies.results;
}
export const searchMovies = async (query: string) => {
    const results = await fetchTmdbApi(`/search/movie?query=${encodeURIComponent(query)}`)
    return results.results
}
export const getMovieDetails = async (movieId: number) => {
    const movieDetails = await fetchTmdbApi(`/movie/${movieId}`)
    return movieDetails
}
export const getMovieCredits = async (movieId: number) => {
    const movieCredits = await fetchTmdbApi(`/movie/${movieId}/credits`)
    return movieCredits
}
// TV Shows
export const getPopularTvShows = async () => {
    const popularTvShows = await fetchTmdbApi('/tv/popular')
    return popularTvShows.results
}
export const searchTvShows = async (query: string) => {
    const results = await fetchTmdbApi(`/search/tv?query=${encodeURIComponent(query)}`)
    return results.results
}
export const getTvShowDetails = async (tvShowId: number) => {
    const tvShowDetails = await fetchTmdbApi(`/tv/${tvShowId}`)
    return tvShowDetails
}
export const getTvShowCredits = async (tvShowId: number) => {
    const tvShowCredits = await fetchTmdbApi(`/tv/${tvShowId}/credits`)
    return tvShowCredits
}
// Trending
export const getTrendingMedia = async (mediaType: 'movie' | 'tv' | 'all', timeWindow: 'day' | 'week') => {
    const trendingMedia = await fetchTmdbApi(`/trending/${mediaType}/${timeWindow}`)
    return trendingMedia.results
}