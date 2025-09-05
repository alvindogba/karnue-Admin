import { store } from './store';

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


//######################### Define types for auth #########################
export interface LoginRequest {
    email: string;
    secretKey: string;
  }
  
  export interface LoginResponse {
    user: {
      id: string;
      email: string;
      fullName: string;

    };
    token?: string;
    refreshToken?: string;
  }
  
  export interface User {
    id: string;
    email: string;
    fullName: string;
  }

//######################### Define types for riders #########################
export interface Rider {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalRides: number;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
  rating: number;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RidersStats {
  totalRiders: number;
  activeRiders: number;
  newThisMonth: number;
  averageRating: number;
}

export interface GetRidersRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetRidersResponse {
  riders: Rider[];
  stats: RidersStats;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface CreateRiderRequest {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateRiderRequest {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  status?: 'Active' | 'Inactive' | 'Suspended';
}

//######################### Define types for reservations #########################
export interface ReservationRider {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  city: string;
}

export interface ReservationDriver {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  isOnline: boolean;
}

export interface Reservation {
  id: string;
  rider: ReservationRider;
  riderPhone: string;
  pickup: string;
  destination: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedFare: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  driver?: ReservationDriver | null;
  vehicleType: string;
  passengers: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReservationsStats {
  totalReservations: number;
  activeReservations: number;
  pendingApproval: number;
  completedToday: number;
  cancelled: number;
  completionRate: number;
}

export interface GetReservationsRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

export interface GetReservationsResponse {
  success: boolean;
  reservations: Reservation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateReservationRequest {
  rider: string;
  riderPhone: string;
  pickup: string;
  destination: string;
  scheduledDate: string;
  scheduledTime: string;
  vehicleType: string;
  passengers: number;
  notes?: string;
}

export interface UpdateReservationRequest {
  id: string;
  rider?: string;
  riderPhone?: string;
  pickup?: string;
  destination?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  status?: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  driver?: string | null;
  vehicleType?: string;
  passengers?: number;
  notes?: string;
}

export interface AssignDriverRequest {
  reservationId: string;
  driverId: string;
}

export interface Driver {
  id: number;
  name: string;
  rating: number;
  status: string;
  vehicle: string;
  distance: string;
  eta: string;
}

// Admin Driver object from server
export interface AdminDriver {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  licensePlate?: string;
  payoutMethod?: string;
  accountStatus: 'draft' | 'awaiting_verification' | 'active' | 'rejected';
  backgroundCheckStatus: 'not_started' | 'in_progress' | 'clear' | 'flagged' | 'failed';
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt?: string;
}

export interface GetAdminDriversRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;        // maps to accountStatus
  bgStatus?: string;      // maps to backgroundCheckStatus
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface GetAdminDriversResponse {
  success: boolean;
  data: AdminDriver[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
