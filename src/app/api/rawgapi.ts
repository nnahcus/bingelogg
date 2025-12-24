import axios from "axios";

const apikey = process.env.RAWG_API_KEY
const BaseUrl= "https://api.rawg.io/api"

export const fetchRAWGApi = async ( endpoint: string) => {
  try {
    const response = await axios.get(`${BaseUrl}${endpoint}?key=${apikey}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`RAWG API request failed: ${error?.message ?? error}`);
  }
};

export const fetchRAWGimage = (background_image: string | null) => {
    return background_image || '/placeholder.jpg';
}

export const getPopularGames = async () => {
  const popularGames = await fetchRAWGApi('/games');
  return popularGames.results;
}