export type MediaType = 'movie' | 'tvshow' | 'anime' | 'manga' | 'book' ;
export type MediaTabType = 'all' | MediaType;
export type MediaStatus = 'watching' | 'completed' | 'planning' | 'dropped' | 'on_hold';
export type MediaTabStatus = 'all' | MediaStatus;

export interface MediaItem {
  id: number;
  title: string;
  type: MediaType;
  status: MediaStatus;
  rating?: number;
  notes?: string;
  imageUrl?: string;
  addedDate: Date;
  updatedAt: Date;
}

export const mediaTypeLabels: Record<MediaType, {label: string, color: string}> = {
  movie: {label: 'Movie', color: 'bg-rose-300/20 text-rose-500 inset-ring inset-ring-rose-600/20 '},
  tvshow: {label: 'TV Show', color: 'bg-sky-300/20 text-sky-500 inset-ring inset-ring-sky-600/20 '},
  anime: {label: 'Anime', color: 'bg-purple-300/20 text-purple-500 inset-ring inset-ring-purple-600/20 '},
  manga: {label: 'Manga', color: 'bg-fuchsia-300/20 text-fuchsia-500 inset-ring inset-ring-fuchsia-600/20 '},
  book: {label: 'Book', color: 'bg-orange-300/20 text-orange-500 inset-ring inset-ring-orange-600/20 '},
};

export const mediaTabLabels: Record<MediaTabType, string> = {
  all: 'All',
  movie: 'Movie',
  tvshow: 'TV Show',
  anime: 'Anime',
  manga: 'Manga',
  book: 'Book',
};

export const mediaStatusLabels: Record<MediaStatus, {label: string, color: string}> = {
  watching:{label: "Watching", color: 'bg-sky-300/20 text-sky-600 inset-ring inset-ring-sky-600/20 '},
  completed: {label: "Completed", color: 'bg-emerald-300/20 text-emerald-600 inset-ring inset-ring-emerald-600/20 '},
  planning: {label: "Plan to Watch", color: 'bg-yellow-300/20 text-yellow-500 inset-ring inset-ring-yellow-600/20 '},
  dropped: {label: "Dropped", color: 'bg-red-300/20 text-red-500 inset-ring inset-ring-red-600/20 '},
  on_hold: {label: "On Hold", color: 'bg-stone-300/20 text-stone-500 inset-ring inset-ring-stone-600/20 '},
};

export const mediaStatusTabLabels: Record<MediaTabStatus, string> = {
  all: 'All',
  watching: 'Watching',
  completed: 'Completed',
  planning: 'Plan to Watch',
  dropped: 'Dropped',
  on_hold: 'On Hold',
};

export interface MediaStats {
  total: number;
  completed: number;
  inProgress: number;
  average: number;
}


