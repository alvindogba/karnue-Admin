import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Search, Filter, Plus, Eye, Edit, Trash2, Clock, MapPin, User, UserCheck, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { RootState, AppDispatch } from '../../Store/interface';
import {
  useGetReservationsQuery,
  useGetReservationsStatsQuery,
  useGetAvailableDriversQuery,
  useAssignDriverMutation,
  useCancelReservationMutation,
  useConfirmReservationMutation,
} from '../../Store/Api/reservationsApi';
import {
  setSearchQuery,
  setStatusFilter,
  setCurrentPage,
  openReassignModal,
  closeReassignModal,
  setSelectedDriver,
  setNearbyDrivers,
  setIsSearchingNearby,
} from '../../Store/Slice/reservationsSlice';

/** Accent color - Karnue brand */
const ACCENT = "#0505CE";

/** Utility */
function classNames(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export const Reservations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    searchQuery, 
    statusFilter, 
    currentPage, 
    itemsPerPage,
    reassignModal
  } = useSelector((state: RootState) => state.reservations);
  
  // Extract nested properties from reassignModal
  const { isSearchingNearby, nearbyDrivers } = reassignModal;

  // API queries
  const { 
    data: reservationsData, 
    isLoading: reservationsLoading,
    error: reservationsError 
  } = useGetReservationsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    sortBy: 'scheduledDate',
    sortOrder: 'desc'
  });

  const { 
    data: statsData, 
    isLoading: statsLoading 
  } = useGetReservationsStatsQuery();

  const { 
    data: availableDriversData, 
    isLoading: driversLoading 
  } = useGetAvailableDriversQuery();

  // Mutations
  const [assignDriver] = useAssignDriverMutation();
  const [cancelReservation] = useCancelReservationMutation();
  const [confirmReservation] = useConfirmReservationMutation();

  // Local state for search input
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(searchInput));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  // Handle actions
  const handleStatusFilterChange = (status: string) => {
    dispatch(setStatusFilter(status));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleReassignClick = (reservation: any) => {
    dispatch(openReassignModal(reservation));
  };

  const handleReassignDriver = async () => {
    if (reassignModal.selectedDriver && reassignModal.reservation) {
      try {
        await assignDriver({
          reservationId: reassignModal.reservation.id,
          driverId: reassignModal.selectedDriver,
        }).unwrap();
        dispatch(closeReassignModal());
      } catch (error) {
        console.error('Error assigning driver:', error);
      }
    }
  };

  const handleSearchNearbyDrivers = async () => {
    if (!reassignModal.reservation) return;
    
    dispatch(setIsSearchingNearby(true));
    dispatch(setNearbyDrivers([]));
    
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock nearby drivers response
      const mockNearbyDrivers = [
        { id: 101, name: "Emma Wilson", rating: 4.9, status: "Available", vehicle: "Tesla Model 3 2023", distance: "0.3 km", eta: "1 min" },
        { id: 102, name: "Lucas Brown", rating: 4.7, status: "Available", vehicle: "BMW 3 Series 2022", distance: "0.6 km", eta: "2 min" },
        { id: 103, name: "Sophia Davis", rating: 4.8, status: "Available", vehicle: "Audi A4 2021", distance: "0.9 km", eta: "4 min" },
      ];
      
      dispatch(setNearbyDrivers(mockNearbyDrivers));
    } catch (error) {
      console.error('Error searching for nearby drivers:', error);
    } finally {
      dispatch(setIsSearchingNearby(false));
    }
  };

  const handleCancelReservation = async (id: string) => {
    try {
      await cancelReservation(id).unwrap();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const handleConfirmReservation = async (id: string) => {
    try {
      await confirmReservation(id).unwrap();
    } catch (error) {
      console.error('Error confirming reservation:', error);
    }
  };

  // Loading state
  if (reservationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Loading reservations...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (reservationsError) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Error loading reservations</h3>
          <p className="mt-1 text-sm text-gray-500">
            There was a problem loading the reservations data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const reservations = reservationsData?.reservations || [];
  const stats = statsData || {
    totalReservations: 0,
    activeReservations: 0,
    pendingApproval: 0,
    completedToday: 0,
    cancelled: 0,
    completionRate: 0
  };
  const availableDrivers = Array.isArray(availableDriversData) ? availableDriversData : [];
  const pagination = reservationsData?.pagination;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Reservations Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor and manage ride reservations, bookings, and scheduling.
            </p>
          </div>
          
          <button 
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <Plus className="h-4 w-4" />
            New Reservation
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reservations by customer, date, or ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1"
              style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
              onFocus={(e) => {
                e.target.style.borderColor = ACCENT;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
              }}
            />
          </div>
          
          <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          
          <select 
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1"
            style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
            onFocus={(e) => {
              e.target.style.borderColor = ACCENT;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            <option value="all">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reservation Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">
              {statsLoading ? '...' : (stats.activeReservations || 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-600">Active Reservations</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">
              {statsLoading ? '...' : (stats.pendingApproval || 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-600">Pending Approval</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">
              {statsLoading ? '...' : (stats.completedToday || 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-600">Completed Today</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">
              {statsLoading ? '...' : (stats.cancelled || 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-600">Cancelled</p>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-[#EFF5FF]">
          <h3 className="text-lg font-semibold text-gray-800">Recent Reservations</h3>
        </div>
        
        <div className="p-8">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No reservations yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Reservation management functionality will be implemented here.
            </p>
            <div className="mt-6">
              <button 
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                style={{ backgroundColor: ACCENT }}
              >
                <Plus className="h-4 w-4" />
                Create First Reservation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Reservations</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rider Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fare
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
                    <div className="text-sm text-gray-500">{reservation.vehicleType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {reservation.rider?.fullName 
                            ? reservation.rider.fullName.split(' ').map(n => n[0]).join('')
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.rider?.fullName || 'Unknown Rider'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm text-gray-900 truncate">{reservation.pickup}</div>
                        <div className="text-xs text-gray-400">↓</div>
                        <div className="text-sm text-gray-900 truncate">{reservation.destination}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.scheduledDate}</div>
                    <div className="text-sm text-gray-500">{reservation.scheduledTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.driver ? (
                      <div className="text-sm text-gray-900">{reservation.driver.fullName}</div>
                    ) : (
                      <span className="text-sm text-yellow-600 font-medium">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={classNames(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      reservation.status === "Confirmed" 
                        ? "bg-green-100 text-green-800"
                        : reservation.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : reservation.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    )}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.estimatedFare}</div>
                    <div className="text-sm text-gray-500">{reservation.passengers} passenger{reservation.passengers > 1 ? 's' : ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Edit Reservation">
                        <Edit className="h-4 w-4" />
                      </button>
                      {reservation.status === "Pending" && (
                        <button 
                          onClick={() => handleConfirmReservation(reservation.id)}
                          className="text-green-600 hover:text-green-900" 
                          title="Confirm Reservation"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleReassignClick(reservation)}
                        className="text-purple-600 hover:text-purple-900" 
                        title="Reassign Driver"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="text-red-600 hover:text-red-900" 
                        title="Cancel Reservation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={classNames(
                      "px-3 py-1 text-sm rounded",
                      pagination.currentPage === pageNum
                        ? "text-white"
                        : "border border-gray-200 hover:bg-gray-50"
                    )}
                    style={pagination.currentPage === pageNum ? { backgroundColor: ACCENT } : {}}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Panel */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Assign Drivers</p>
                <p className="text-sm text-gray-500">Auto-assign available drivers to pending reservations</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Schedule Optimization</p>
                <p className="text-sm text-gray-500">Optimize driver schedules for maximum efficiency</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Send Reminders</p>
                <p className="text-sm text-gray-500">Send SMS/email reminders to riders and drivers</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Driver Reassignment Modal */}
      {reassignModal.isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reassign Driver</h3>
              <button
                onClick={() => dispatch(closeReassignModal())}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reassignModal.reservation && (
              <div className="mb-4">
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-900">Reservation: {reassignModal.reservation.id}</p>
                  <p className="text-sm text-gray-600">Rider: {reassignModal.reservation.rider?.fullName}</p>
                  <p className="text-sm text-gray-600">Route: {reassignModal.reservation.pickup} → {reassignModal.reservation.destination}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Driver
                    </label>
                    <button
                      onClick={handleSearchNearbyDrivers}
                      disabled={isSearchingNearby}
                      className={classNames(
                        "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                        isSearchingNearby
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      )}
                    >
                      {isSearchingNearby ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-3 w-3" />
                          Search Nearby
                        </>
                      )}
                    </button>
                  </div>

                  {/* Available Drivers List */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Available Drivers:</p>
                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md">
                      {driversLoading ? (
                        <div className="p-4 text-center">
                          <Loader2 className="mx-auto h-4 w-4 animate-spin text-gray-400" />
                          <p className="mt-1 text-xs text-gray-500">Loading drivers...</p>
                        </div>
                      ) : availableDrivers.map((driver: any) => (
                        <div
                          key={driver.id}
                          onClick={() => dispatch(setSelectedDriver(driver.id))}
                          className={classNames(
                            "p-2 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50",
                            reassignModal.selectedDriver === driver.id ? "bg-blue-50 border-blue-200" : ""
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">{driver.name}</span>
                                <span className="text-yellow-500 text-xs">★{driver.rating}</span>
                              </div>
                              <p className="text-xs text-gray-600">{driver.vehicle || 'Vehicle info not available'}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-green-600">
                                <MapPin className="h-3 w-3" />
                                <span className="text-xs font-medium">{driver.distance || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                  </div>

                  {/* Nearby Drivers Results */}
                  {nearbyDrivers && nearbyDrivers.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-green-600 font-medium">Nearby Drivers Found:</p>
                      <div className="max-h-32 overflow-y-auto border border-green-200 rounded-md bg-green-50">
                        {nearbyDrivers.map((driver: any) => (
                          <div
                            key={driver.id}
                            onClick={() => dispatch(setSelectedDriver(driver.id))}
                            className={classNames(
                              "p-2 cursor-pointer border-b border-green-100 last:border-b-0 hover:bg-green-100",
                              reassignModal.selectedDriver === driver.id ? "bg-green-200 border-green-300" : ""
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">{driver.name}</span>
                                  <span className="text-yellow-500 text-xs">★{driver.rating}</span>
                                </div>
                                <p className="text-xs text-gray-600">{driver.vehicle || 'Vehicle info not available'}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-green-600">
                                  <MapPin className="h-3 w-3" />
                                  <span className="text-xs font-medium">{driver.distance || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => dispatch(closeReassignModal())}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (reassignModal.selectedDriver && reassignModal.reservation) {
                        handleReassignDriver();
                      }
                    }}
                    disabled={!reassignModal.selectedDriver}
                    className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Reassign Driver
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
