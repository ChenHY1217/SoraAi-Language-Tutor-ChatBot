import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

// BASE_URL will be updated to be the server url when deployed, remember to change vite config
// ✅ Base URL is now set to the server URL
// https://soraai-api.onrender.com
// ✅ The Vite config file is now commented out
const baseQuery = fetchBaseQuery({ 
    baseUrl: BASE_URL,
    credentials: "include",
}); 

export const apiSlice = createApi({
    baseQuery,
    endpoints: () => ({}),
});