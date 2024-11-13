import { apiSlice } from "./apiSlice";
import { CHATS_URL } from "../constants";

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getChats: builder.query({
            query: () => ({
                url: `${CHATS_URL}`,
                method: "GET",
            }),
        }),

        getChatById: builder.query({
            query: (chatId) => ({
                url: `${CHATS_URL}/${chatId}`,
                method: "GET",
            }),
        }),

        getChatMessages: builder.query({
            query: (chatId) => ({
                url: `${CHATS_URL}/${chatId}/messages`,
                method: "GET",
            }),
        }),

        createChat: builder.mutation({
            query: (body) => ({
                url: `${CHATS_URL}/create`,
                method: "POST",
                body,
            }),
        }),

        continueChat: builder.mutation({
            query: ({ chatId, body }: { chatId: string; body: any }) => ({
                url: `${CHATS_URL}/${chatId}`,
                method: "PATCH",
                body,
            }),
        }),
    }),
});

export const {
    useGetChatsQuery,
    useGetChatByIdQuery,
    useGetChatMessagesQuery,
    useCreateChatMutation,
    useContinueChatMutation,
} = chatApiSlice;