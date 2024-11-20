import { apiSlice } from "./apiSlice";
import { QUIZZES_URL } from "../constants";

export const quizApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuizzes: builder.query({
            query: (lang) => ({
                url: `${QUIZZES_URL}/${lang}`,
                method: "GET",
            }),
        }),

        createQuiz: builder.mutation({
            query: (body) => ({
                url: `${QUIZZES_URL}/create`,
                method: "POST",
                body,
            }),
        }),

        answerQuiz: builder.mutation({
            query: ({ quizId, answers }) => ({
                url: `${QUIZZES_URL}/${quizId}/answer`,
                method: "PATCH",
                body: { answers },
            }),
        }),

    }),
});

export const { useGetQuizzesQuery, useCreateQuizMutation, useAnswerQuizMutation } = quizApiSlice;   