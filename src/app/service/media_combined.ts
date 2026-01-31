import { fetchJikanApi, fetchJikanImage } from "@/app/api/jikanapi";
import { fetchTmdbApi, fetchTmdbImage } from "@/app/api/tmdbapi";

export default interface ImageAPI{
    id: string
    title: string
    image: string
    source: "tmdb" | "jikan" | "openlibrary" | "igdb"
}

export function CombinedImageAPI({
  tmdb,
  jikan,
  books,
  games,
}: any): ImageAPI[] {
  return [
    ...tmdb.results.map((m: any) => ({
      id: `tmdb-${m.id}`,
      image: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      source: "tmdb",
    })),

    ...jikan.data.map((a: any) => ({
      id: `jikan-${a.mal_id}`,
      image: a.images.jpg.image_url,
      source: "jikan",
    })),

    ...books.map((b: any) => ({
      id: `book-${b.key}`,
      image: `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`,
      source: "openlibrary",
    })),
    ...games.map((g: any) => ({
    id: `igdb-${g.id}`,
    image: g.cover.url.replace("t_thumb", "t_cover_big"),
    source: "igdb",
    }))    
  ]
}