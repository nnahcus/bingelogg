import axios from 'axios';

const BaseUrl = 'https://openlibrary.org';

export interface OpenLibraryDoc {
  key: string; // e.g. "/works/OL123W"
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  edition_key?: string[];
  subject?: string[];
}

export const searchOpenLibrary = async (query: string, limit = 10) => {
  try {
    const res = await axios.get(`${BaseUrl}/search.json`, {
      params: { q: query, limit },
    });
    return res.data?.docs ?? [];
  } catch (error: any) {
    throw new Error(`OpenLibrary request failed: ${error?.message ?? error}`);
  }
};

export const openLibraryCover = (coverId?: number, size: 'S' | 'M' | 'L' = 'L') => {
  if (!coverId) return '/placeholder.jpg';
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};
