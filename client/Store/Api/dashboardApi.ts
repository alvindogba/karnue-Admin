// In Store/Api/dashboardApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define tag types for the API
export const TAG_TYPES = {
  DASHBOARD_STATS: 'DashboardStats',
} as const;

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  tagTypes: Object.values(TAG_TYPES),
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_API_URL}/api/admin`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => 'dashboard/stats',
      providesTags: [{ type: TAG_TYPES.DASHBOARD_STATS, id: 'LIST' }],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;