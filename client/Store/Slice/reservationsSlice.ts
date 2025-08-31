import { createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Reservation } from '../interface';

interface ReservationsState {
  searchQuery: string;
  statusFilter: string;
  dateFilter: string;
  currentPage: number;
  itemsPerPage: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  modal: {
    isOpen: boolean;
    type: 'view' | 'edit' | 'create' | 'assign' | null;
    reservation: Reservation | null;
  };
  reassignModal: {
    isOpen: boolean;
    reservation: Reservation | null;
    selectedDriver: string;
    nearbyDrivers: any[];
    isSearchingNearby: boolean;
  };
}

const initialState: ReservationsState = {
  searchQuery: '',
  statusFilter: 'all',
  dateFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
  sortBy: 'scheduledDate',
  sortOrder: 'desc',
  modal: {
    isOpen: false,
    type: null,
    reservation: null,
  },
  reassignModal: {
    isOpen: false,
    reservation: null,
    selectedDriver: '',
    nearbyDrivers: [],
    isSearchingNearby: false,
  },
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1; // Reset to first page when filtering
    },
    setDateFilter: (state, action: PayloadAction<string>) => {
      state.dateFilter = action.payload;
      state.currentPage = 1; // Reset to first page when filtering
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing page size
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    openModal: (state, action: PayloadAction<{ type: 'view' | 'edit' | 'create' | 'assign'; reservation?: Reservation }>) => {
      state.modal.isOpen = true;
      state.modal.type = action.payload.type;
      state.modal.reservation = action.payload.reservation || null;
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.reservation = null;
    },
    openReassignModal: (state, action: PayloadAction<Reservation>) => {
      state.reassignModal.isOpen = true;
      state.reassignModal.reservation = action.payload;
      state.reassignModal.selectedDriver = '';
      state.reassignModal.nearbyDrivers = [];
    },
    closeReassignModal: (state) => {
      state.reassignModal.isOpen = false;
      state.reassignModal.reservation = null;
      state.reassignModal.selectedDriver = '';
      state.reassignModal.nearbyDrivers = [];
      state.reassignModal.isSearchingNearby = false;
    },
    setSelectedDriver: (state, action: PayloadAction<string>) => {
      state.reassignModal.selectedDriver = action.payload;
    },
    setNearbyDrivers: (state, action: PayloadAction<any[]>) => {
      state.reassignModal.nearbyDrivers = action.payload;
    },
    setIsSearchingNearby: (state, action: PayloadAction<boolean>) => {
      state.reassignModal.isSearchingNearby = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setDateFilter,
  setCurrentPage,
  setItemsPerPage,
  setSortBy,
  setSortOrder,
  openModal,
  closeModal,
  openReassignModal,
  closeReassignModal,
  setSelectedDriver,
  setNearbyDrivers,
  setIsSearchingNearby,
} = reservationsSlice.actions;

export default reservationsSlice.reducer;
