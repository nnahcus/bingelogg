import axios from "axios";

const BaseUrl = "https://api.igdb.com/v4";
const client_id = process.env.IGDB_CLIENT_ID;
const secret_client = process.env.IGDB_SECRET_CLIENT;
const authorization = process.env.IGDB_ACCESS_TOKEN;


export const fetchIGDBApi = async (endpoint: string) => {
  
  try {
    const response = await axios.post(
      `${BaseUrl}${endpoint}`, `fields id,name,cover.image_id,rating; limit 5;`,{
        headers:{
            'Client-ID': process.env.IGDB_CLIENT_ID,
            'Authorization': `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`IGDB API request failed: ${error?.message ?? error}`);
  }
};

export const fetchIGDBImage = (image_id: string, size: "t_cover_small" | "t_cover_big"
    | "t_thumb" |"t_720p" | "t_1080p" = "t_1080p"):string => {
    return `https://images.igdb.com/igdb/image/upload/${size}/${image_id}.jpg`
    }