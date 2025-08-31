import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Rider, 
  GetRidersRequest, 
  GetRidersResponse, 
  CreateRiderRequest, 
  UpdateRiderRequest,
  RidersStats 
} from '../interface';

// Use environment variable for base URL
const baseUrl = import.meta.env.VITE_API_URL;

// Define the riders API
export const ridersApi = createApi({
  reducerPath: 'ridersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/admin`,
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Rider', 'RidersStats'],
  endpoints: (builder) => ({
    // Get all riders with pagination and filtering
    getRiders: builder.query<GetRidersResponse, GetRidersRequest>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.status) searchParams.append('status', params.status);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        return `/riders?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.riders.map(({ id }) => ({ type: 'Rider' as const, id })),
              { type: 'Rider', id: 'LIST' },
              'RidersStats'
            ]
          : [{ type: 'Rider', id: 'LIST' }, 'RidersStats'],
    }),

    // Get single rider by ID
    getRiderById: builder.query<Rider, number>({
      query: (id) => `/riders/${id}`,
      providesTags: (_, __, id) => [{ type: 'Rider', id }],
    }),

    // Get riders statistics
    getRidersStats: builder.query<RidersStats, void>({
      query: () => '/riders/stats',
      providesTags: ['RidersStats'],
    }),

    // Create new rider
    createRider: builder.mutation<Rider, CreateRiderRequest>({
      query: (newRider) => ({
        url: '/riders',
        method: 'POST',
        body: newRider,
      }),
      invalidatesTags: [{ type: 'Rider', id: 'LIST' }, 'RidersStats'],
    }),

    // Update existing rider
    updateRider: builder.mutation<Rider, UpdateRiderRequest>({
      query: ({ id, ...patch }) => ({
        url: `/riders/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Rider', id },
        { type: 'Rider', id: 'LIST' },
        'RidersStats'
      ],
    }),

    // Delete rider
    deleteRider: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/riders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Rider', id },
        { type: 'Rider', id: 'LIST' },
        'RidersStats'
      ],
    }),

    // Suspend rider
    suspendRider: builder.mutation<Rider, number>({
      query: (id) => ({
        url: `/riders/${id}/suspend`,
        method: 'PATCH',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Rider', id },
        { type: 'Rider', id: 'LIST' },
        'RidersStats'
      ],
    }),

    // Activate rider
    activateRider: builder.mutation<Rider, number>({
      query: (id) => ({
        url: `/riders/${id}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Rider', id },
        { type: 'Rider', id: 'LIST' },
        'RidersStats'
      ],
    }),
  }),
});

export const {
  useGetRidersQuery,
  useGetRiderByIdQuery,
  useGetRidersStatsQuery,
  useCreateRiderMutation,
  useUpdateRiderMutation,
  useDeleteRiderMutation,
  useSuspendRiderMutation,
  useActivateRiderMutation,
} = ridersApi;
