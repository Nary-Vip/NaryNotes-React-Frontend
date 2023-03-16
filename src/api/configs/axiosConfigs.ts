import axios from "axios"

const BASE_URL = "localhost:5000";
export const api = axios.create({
  withCredentials: true,
  baseURL: `http://${BASE_URL}/`,
})