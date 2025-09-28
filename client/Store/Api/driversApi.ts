import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { GetAdminDriversRequest, GetAdminDriversResponse, DriverStats } from '../interface';

const baseUrl = import.meta.env.VITE_API_URL;

export const driversApi = createApi({
  reducerPath: 'driversApi',
  tagTypes: ['Drivers', 'DriverStats'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/admin`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token as string | undefined;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDrivers: builder.query<GetAdminDriversResponse, GetAdminDriversRequest | void>({
      query: (params) => ({
        url: '/drivers',
        params: params || undefined,
      }),
      providesTags: ['Drivers'],
    }),
    startBackgroundCheck: builder.mutation<{ success: boolean; reference: string; status: string }, number>({
      query: (id) => ({ url: `/drivers/${id}/background-check/start`, method: 'POST' }),
      invalidatesTags: ['Drivers'],
    }),
    approveDriver: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/drivers/${id}/approve`, method: 'PATCH' }),
      invalidatesTags: ['Drivers'],
    }),
    rejectDriver: builder.mutation<{ success: boolean }, { id: number; reason?: string }>({
      query: ({ id, reason }) => ({ url: `/drivers/${id}/reject`, method: 'PATCH', body: { reason } }),
      invalidatesTags: ['Drivers'],
    }),
    getDriverStats: builder.query<DriverStats, void>({
      query: () => ({
        url: '/driver_stats',
        method: 'GET',
      }),
      providesTags: ['DriverStats'],
      // Add error logging
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log('Driver stats fetched successfully:', result);
        } catch (error) {
          console.error('Error fetching driver stats:', error);
        }
      },
    }),
  }),
});

export const {
  useGetDriversQuery,
  useStartBackgroundCheckMutation,
  useApproveDriverMutation,
  useRejectDriverMutation,
  useGetDriverStatsQuery,
} = driversApi;

