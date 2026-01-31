import { MediaItem, MediaStats, MediaType } from '@/app/service/type'


export function calculateStats(items: MediaItem[]):MediaStats {
  const stats = {
    total: items.length,
    completed: 0,
    inProgress: 0,
    byType: {} as Record<MediaType, number>,
    ratings: [] as number[],
  };   
  
  for (const item of items) {
    if (item.rating !== undefined) stats.ratings.push(item.rating);
    stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
    
    if (item.status === 'completed') stats.completed++
    else if (item.status === 'watching' || item.status === 'on_hold') stats.inProgress++
  }
  const ratedItem = items.filter(i => i.rating !== undefined && i.rating !== null);
  return{
    ...stats,
    average: ratedItem.length > 0 ? ratedItem.reduce((s, r) => s + r.rating!,0)/ratedItem.length : 0
    }
    };