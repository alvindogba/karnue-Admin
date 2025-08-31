import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Reservation, 
  GetReservationsRequest, 
  GetReservationsResponse, 
  CreateReservationRequest, 
  UpdateReservationRequest,
  ReservationsStats,
  AssignDriverRequest,
  Driver
} from '../interface';

// Use environment variable for base URL
const baseUrl = import.meta.env.VITE_API_URL;

// Define the reservations API
export const reservationsApi = createApi({
  reducerPath: 'reservationsApi',
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
  tagTypes: ['Reservation', 'ReservationsStats', 'Driver'],
  endpoints: (builder) => ({
    // Get all reservations with pagination and filtering
    getReservations: builder.query<GetReservationsResponse, GetReservationsRequest>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.status) searchParams.append('status', params.status);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        if (params.dateFrom) searchParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) searchParams.append('dateTo', params.dateTo);

        return `/reservations?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.reservations.map(({ id }) => ({ type: 'Reservation' as const, id })),
              { type: 'Reservation', id: 'LIST' },
              'ReservationsStats'
            ]
          : [{ type: 'Reservation', id: 'LIST' }, 'ReservationsStats'],
    }),

    // Get single reservation by ID
    getReservationById: builder.query<Reservation, string>({
      query: (id) => `/reservations/${id}`,
      providesTags: (_, __, id) => [{ type: 'Reservation', id }],
    }),

    // Get reservations statistics
    getReservationsStats: builder.query<ReservationsStats, void>({
      query: () => '/reservations/stats',
      providesTags: ['ReservationsStats'],
    }),

    // Create new reservation
    createReservation: builder.mutation<Reservation, CreateReservationRequest>({
      query: (newReservation) => ({
        url: '/reservations',
        method: 'POST',
        body: newReservation,
      }),
      invalidatesTags: [{ type: 'Reservation', id: 'LIST' }, 'ReservationsStats'],
    }),

    // Update existing reservation
    updateReservation: builder.mutation<Reservation, UpdateReservationRequest>({
      query: ({ id, ...patch }) => ({
        url: `/reservations/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Reservation', id },
        { type: 'Reservation', id: 'LIST' },
        'ReservationsStats'
      ],
    }),

    // Delete reservation
    deleteReservation: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/reservations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Reservation', id },
        { type: 'Reservation', id: 'LIST' },
        'ReservationsStats'
      ],
    }),

    // Cancel reservation
    cancelReservation: builder.mutation<Reservation, string>({
      query: (id) => ({
        url: `/reservations/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Reservation', id },
        { type: 'Reservation', id: 'LIST' },
        'ReservationsStats'
      ],
    }),

    // Confirm reservation
    confirmReservation: builder.mutation<Reservation, string>({
      query: (id) => ({
        url: `/reservations/${id}/confirm`,
        method: 'PATCH',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Reservation', id },
        { type: 'Reservation', id: 'LIST' },
        'ReservationsStats'
      ],
    }),

    // Assign driver to reservation
    assignDriver: builder.mutation<Reservation, AssignDriverRequest>({
      query: ({ reservationId, driverId }) => ({
        url: `/reservations/${reservationId}/assign-driver`,
        method: 'PATCH',
        body: { driverId },
      }),
      invalidatesTags: (_, __, { reservationId }) => [
        { type: 'Reservation', id: reservationId },
        { type: 'Reservation', id: 'LIST' },
        'ReservationsStats'
      ],
    }),

    // Get nearby drivers for a reservation
    getNearbyDrivers: builder.query<Driver[], { pickupLocation: string; reservationId: string }>({
      query: ({ pickupLocation, reservationId }) => ({
        url: '/drivers/nearby',
        method: 'POST',
        body: { pickupLocation, reservationId },
      }),
      providesTags: ['Driver'],
    }),

    // Get available drivers
    getAvailableDrivers: builder.query<Driver[], void>({
      query: () => '/drivers/available',
      providesTags: ['Driver'],
    }),
  }),
});

export const {
  useGetReservationsQuery,
  useGetReservationByIdQuery,
  useGetReservationsStatsQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useDeleteReservationMutation,
  useCancelReservationMutation,
  useConfirmReservationMutation,
  useAssignDriverMutation,
  useGetNearbyDriversQuery,
  useGetAvailableDriversQuery,
} = reservationsApi;
