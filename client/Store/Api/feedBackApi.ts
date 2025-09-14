// karnue-Admin/client/Store/Api/feedBackApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GetFeedbacksResponse, Feedback } from "../interface";

const baseUrl = import.meta.env.VITE_API_URL;

export const feedBackApi = createApi({
  reducerPath: "feedBackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Feedback"], 
  endpoints: (builder) => ({
    getAllFeedbacks: builder.query<GetFeedbacksResponse, void>({
      query: () => "/feedback/get_feedbacks",
      providesTags: ["Feedback"],
    }),
    addFeedback: builder.mutation<any, Partial<Feedback>>({
      query: (feedback) => ({
        url: "/feedback",
        method: "POST",
        body: feedback,
      }),
      invalidatesTags: ["Feedback"],
    }),
    replyToFeedback: builder.mutation<{ success: boolean }, { 
      id: string; 
      message: string;
      adminName: string;
      adminEmail: string;
    }>({
      query: ({ id, ...body }) => ({
        url: `/feedback/${id}/reply`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Feedback"],
    }),
  }),
});

export const { 
  useGetAllFeedbacksQuery, 
  useAddFeedbackMutation, 
  useReplyToFeedbackMutation 
} = feedBackApi;
