import axios from "axios";

interface JikanListResponse<T> {
  data: T[];
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

interface Anime {
  mal_id: number;
  url: string;
  images: {
    jpg: { image_url: string };
    webp: { image_url: string };
  };
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  episodes: number | null;
  score: number | null;
  synopsis: string | null;
}

interface Manga {
  mal_id: number;
  url: string;
  images: {
    jpg: { image_url: string };
    webp: { image_url: string };
  };
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  chapters: number | null;
  volumes: number | null;
  status: string | null;
  synopsis: string | null;
}


const BaseUrl = "https://api.jikan.moe/v4"

export const fetchJikanApi = async <T>(
  endpoint: string
): Promise<T> => {
  try {
    const response = await axios.get<T>(`${BaseUrl}${endpoint}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`JIKAN API request failed: ${error?.message ?? error}`);
  }
};

/**
 * Return the provided image URL or empty string.
 * Prefer using `fetchJikanImageById` to resolve an anime/manga's image by id.
 */
export const fetchJikanImage = (jpg?: string | null,webp?: string | null ):string => {
  return jpg || webp || '/placeholder.jpg';
}

export const getTopAnimes = async () => {
  const topAnimes = await fetchJikanApi<JikanListResponse<Anime>>('/top/anime');
  return topAnimes.data ?? topAnimes;
}

export const getTopMangas = async () => {
  const topMangas = await fetchJikanApi<JikanListResponse<Manga>>('/top/manga');
  return topMangas.data ?? topMangas;
}