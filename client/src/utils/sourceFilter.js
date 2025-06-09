import axios from "axios";

let SOURCE_FILTER = null;

export async function loadSourceFilter() {
  if (SOURCE_FILTER !== null) return SOURCE_FILTER;

  try {
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    const response = await axios.get(serverUrl + '/file/sources');
    SOURCE_FILTER = response.data;
    return SOURCE_FILTER;
  } catch (err) {
    console.error('Failed to load source filter:', err);
    return null;
  }
}

export function getSourceFilter() {
  return SOURCE_FILTER;
}

export function isSourceFilterLoaded() {
  return SOURCE_FILTER !== null;
}