import { NextResponse } from 'next/server';
import { searchMovies, searchTvShows } from '../tmdbapi';
import { searchAnimes, searchMangas } from '../jikanapi';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') || '').trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const [movies, tv, animes, mangas] = await Promise.all([
      searchMovies(q).catch(() => []),
      searchTvShows(q).catch(() => []),
      searchAnimes(q).catch(() => []),
      searchMangas(q).catch(() => []),
    ]);

    return NextResponse.json(
      {
        query: q,
        tmdb: { movies, tv },
        jikan: { animes, mangas },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
