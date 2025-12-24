export interface JikanListResponse<T> {
  data: T[];
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export interface Movies {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

export interface TV {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  overview: string;
}


export interface Anime {
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

export interface Manga {
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

export interface Game {
  id: number;
  name: string;
  background_image: string | null;
  rating: number;
}

export interface IGDBgame{
  id: number;
  name: string;
  rating: number;
  cover: IGDBcover;
  genres: { id: number; name: string }[];
  released: string; // บาง API มีวันที่วางจำหน่าย
  summary: string;
}
export interface IGDBcover{
  id: number
  image_id: string
  url?: string
}