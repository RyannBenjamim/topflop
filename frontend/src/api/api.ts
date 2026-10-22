import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});
