import axios from "axios";


export async function SearchMedia(query: string, signal?: AbortSignal) {
    try{
    const res = await axios.get('/api/search', { params: { q: query }, signal });
    const data = await res.data;
    
    return data;

    } catch (error: any) {
        if (axios.isCancel(error)) {
            return null;
        } else {
            throw new Error(`Search request failed: ${error?.message ?? error}`);
        }
    }
}