import { fetchJikanApi, fetchJikanImage } from "@/app/api/jikanapi";
import { fetchTmdbApi, fetchTmdbImage } from "@/app/api/tmdbapi";
import { Inter } from "next/font/google";
import { Movies,Manga,Anime,JikanListResponse, TV, Game, IGDBgame } from "@/app/service/interface";
import { fetchRAWGApi, fetchRAWGimage } from "@/app/api/rawgapi";
import { fetchIGDBApi, fetchIGDBImage } from "@/app/api/igdbapi";
import Link from "next/link";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default async function Hero() {
  // สร้างตัวแปร popularmovies+topanimes เพื่อเก็บตัวแปร Movies Anime ที่ได้มาจาก TMDB API + Jikan API
  let popularMovies: Movies[] = [];
  let popularTVShows: TV[] =[];
  let topAnimes: Anime[] = [];
  let topMangas: Manga[] = [];
  try {
    // ดึงมาจาก fetchtmdbapi/jikanapi + endpoint
    const [tmdbmovieData,tmdbtvData, jikananimeData, jikanmangadata,] = await Promise.all([
    fetchTmdbApi('/movie/popular'),
    fetchTmdbApi('/tv/popular'),
    fetchJikanApi<JikanListResponse<Anime>>("/top/anime"), 
    fetchJikanApi<JikanListResponse<Manga>>("/top/manga"),
  ])
    popularMovies = tmdbmovieData.results ?? [];
    popularTVShows = tmdbtvData.results ?? [];
    topAnimes = jikananimeData.data ?? [];
    topMangas = jikanmangadata.data ?? [];
  } catch (error) {
    // จับ error
    console.error("Error fetching popular movies:", error);
  }
  return (
    <section className= {`w-full text-xl md:text-2xl px-6 sm:px-8 md:px-12 lg:px-24 xl:px-36 pt-36  pb-6 md:pb-8 flex min-h-[70vh] items-center justify-center bg-linear-to-b from-[#ffffff] via-[#faf7f2] to-[#f3ece0] ${interFont.className}`}>
      <div className="items-center">
        <div className="items-center text-center">
          <h1 className="text-4xl lg:text-5xl font-semibold leading-10 tracking-tight text-[#3b2f2f] dark:text-zinc-50 mb-8">
            Minimal tracking. Meaningful memories.
          </h1>
          <p className="text-lg md:text-2xl font-light leading-8 text-zinc-900  mb-8">
            A calm, minimal space to track what you've watched and read to.
          </p>
        </div>
        <button className="flex flex-col gap-4 text-base font-medium sm:flex-row items-center justify-center mx-auto pb-10">
          <Link href="/login" className="uppercase flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d99a7e]   px-5 text-white transition-colors hover:bg-[#c77557] md:w-[158px]"
            rel="noopener noreferrer">
            get started
          </Link>
        </button>
        <div className="">
          {/* รูปภาพ */}
          <div className="flex gap-4 overflow-x-auto justify-center">
            {/* TMDB API MOVIE */}
            {popularMovies.length > 0 ? (popularMovies.slice(0, 1).map((movie) => (
                <img key={movie.id} src={fetchTmdbImage(movie.poster_path, 'original')}
                  alt={movie.title} className="h-48 w-auto rounded-lg object-cover"/>))
            ) : (<p className="text-zinc-500">No popular movies available</p>)}
            {/* TMDB API TV SHOW*/}
            {popularTVShows.length > 0 ? (popularTVShows.slice(0, 2).map((TV) => (
                <img key={TV.id} src={fetchTmdbImage(TV.poster_path, 'original')}
                  alt={TV.name} className="h-48 w-auto rounded-lg object-cover"/>))
            ) : (<p className="text-zinc-500">No popular tv shows available</p>)}
            {/* JikanAPI Anime */}
            {topAnimes.length > 0 ? (topAnimes.slice(0, 1).map((anime) => (
                <img key={anime.mal_id} src={fetchJikanImage(anime.images.jpg.image_url || anime.images.webp.image_url )}
                  alt={anime.title} className="h-48 w-auto rounded-lg object-cover"/>))
            ) : (<p className="text-zinc-500">No popular animes available</p>)}
            {/* JikanAPI Manga */}
            {topMangas.length > 0 ? (
              topMangas.slice(0, 2).map((manga) => (
                <img key={manga.mal_id} src={fetchJikanImage(manga.images.jpg.image_url || manga.images.webp.image_url )}
                  alt={manga.title} className="h-48 w-auto rounded-lg object-cover"/>))
            ) : (<p className="text-zinc-500">No popular mangas available</p>)}
          </div>
        </div>       
      </div>
    </section>
  );
}