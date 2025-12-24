import { fetchJikanApi, fetchJikanImage } from "@/app/api/jikanapi";
import { fetchTmdbApi, fetchTmdbImage } from "@/app/api/tmdbapi";

interface mediaArrays{
    id: string
    title: string
    image: string
}