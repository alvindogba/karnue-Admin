// karnue-Admin/client/Store/Api/feedBackApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL;


export const feedBackApi = createApi({
  reducerPath: "feedBackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/admin`,
  }),
  tagTypes: ["Feedback"], // useful for cache invalidation
  endpoints: (builder) => ({
    getAllFeedbacks: builder.query({
      query: () => "/feedback",
      providesTags: ["Feedback"],
    }),
    addFeedback: builder.mutation({
      query: (feedback) => ({
        url: "/feedback",
        method: "POST",
        body: feedback,
      }),
      invalidatesTags: ["Feedback"], // refresh list after new feedback
    }),
  }),
});

export const { useGetAllFeedbacksQuery, useAddFeedbackMutation } = feedBackApi;
