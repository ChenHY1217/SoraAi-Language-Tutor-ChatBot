import { apiSlice } from "./apiSlice";
import { PROGRESS_URL } from "../constants";

export const progressApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProgress: builder.query({
            query: (lang) => ({
                url: `${PROGRESS_URL}/${lang}`,
                method: "GET",
            }),
        }),

        updateProgress: builder.mutation({
            query: ({ lang, body }: { lang: string; body: any }) => ({
                url: `${PROGRESS_URL}/${lang}`,
                method: "PATCH",
                body,
            }),
        }),
    }),
});

export const { useGetProgressQuery, useUpdateProgressMutation } = progressApiSlice;