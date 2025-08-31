import { createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Rider } from '../interface';

interface RidersState {
  selectedRider: Rider | null;
  searchQuery: string;
  statusFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
  isModalOpen: boolean;
  modalType: 'view' | 'edit' | 'create' | null;
}

const initialState: RidersState = {
  selectedRider: null,
  searchQuery: '',
  statusFilter: 'all',
  sortBy: 'name',
  sortOrder: 'asc',
  currentPage: 1,
  itemsPerPage: 10,
  isModalOpen: false,
  modalType: null,
};

const ridersSlice = createSlice({
  name: 'riders',
  initialState,
  reducers: {
    setSelectedRider: (state, action: PayloadAction<Rider | null>) => {
      state.selectedRider = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1; // Reset to first page when filtering
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    },
    openModal: (state, action: PayloadAction<{ type: 'view' | 'edit' | 'create'; rider?: Rider }>) => {
      state.isModalOpen = true;
      state.modalType = action.payload.type;
      state.selectedRider = action.payload.rider || null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalType = null;
      state.selectedRider = null;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.statusFilter = 'all';
      state.sortBy = 'name';
      state.sortOrder = 'asc';
      state.currentPage = 1;
    },
  },
});

export const {
  setSelectedRider,
  setSearchQuery,
  setStatusFilter,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  setItemsPerPage,
  openModal,
  closeModal,
  resetFilters,
} = ridersSlice.actions;

export default ridersSlice.reducer;
