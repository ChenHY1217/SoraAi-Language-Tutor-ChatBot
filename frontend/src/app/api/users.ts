import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (body) => ({
                url: `${USERS_URL}/register`,
                method: "POST",
                body,
            }),
        }),

        login: builder.mutation({
            query: (body) => ({
                url: `${USERS_URL}/login`,
                method: "POST",
                body,
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),

        profileData: builder.query({
            query: () => ({
                url: `${USERS_URL}/profile`,
                method: "GET",
            }),
        }),

        profileUpdate: builder.mutation({
            query: (body) => ({
                url: `${USERS_URL}/profile`,
                method: "PUT",
                body,
            }),
        }),

        sendPasswordResetEmail: builder.mutation({
            query: (email: string) => ({
                url: `${USERS_URL}/forgot-password`,
                method: 'POST',
                body: { email },
            }),
        }),

        resetPassword: builder.mutation({
            query: ({ token, password }: { token: string, password: string }) => ({
                url: `${USERS_URL}/reset-password/${token}`,
                method: 'POST',
                body: { password }
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileDataQuery,
    useProfileUpdateMutation,
    useSendPasswordResetEmailMutation,
    useResetPasswordMutation,
} = userApiSlice;