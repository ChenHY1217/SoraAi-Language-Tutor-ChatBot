import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        
        login: builder.mutation({
            query: (body) => ({
                url: `${USERS_URL}/login`,
                method: "POST",
                body,
            }),
        }),

        register: builder.mutation({
            query: (body) => ({
                url: `${USERS_URL}/register`,
                method: "POST",
                body,
            }),
        }),

    }),

});

export const { useLoginMutation, useRegisterMutation } = userApiSlice;