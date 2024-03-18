import axios from "axios";

const baseUrl = "http://localhost:3001/";

export const http = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});