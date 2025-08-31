import { Users, Search, Filter, Plus, Eye, Edit, Trash2, BadgeCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../Store/interface";
import { 
  useGetRidersQuery, 
  useGetRidersStatsQuery,
  useDeleteRiderMutation,
  useSuspendRiderMutation,
  useActivateRiderMutation 
} from "../../Store/Api/ridersApi";
import {
  setSearchQuery,
  setStatusFilter,
  setCurrentPage,
  openModal,
  // closeModal - unused
} from "../../Store/Slice/ridersSlice";

/** Utility */
function classNames(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** Accent color - Karnue brand */
const ACCENT = "#0505CE";


export default function Riders() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    searchQuery, 
    statusFilter, 
    currentPage, 
    itemsPerPage 
  } = useSelector((state: RootState) => state.riders);

  // API queries
  const { 
    data: ridersData, 
    error: ridersError, 
    isLoading: ridersLoading,
    refetch: _
  } = useGetRidersQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    sortBy: 'fullName',
    sortOrder: 'asc'
  });

  const { 
    data: statsData, 
    isLoading: statsLoading 
  } = useGetRidersStatsQuery();

  // Mutations
  const [deleteRider] = useDeleteRiderMutation();
  const [suspendRider] = useSuspendRiderMutation();
  const [activateRider] = useActivateRiderMutation();

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

  const handleViewRider = (rider: any) => {
    dispatch(openModal({ type: 'view', rider }));
  };

  const handleEditRider = (rider: any) => {
    dispatch(openModal({ type: 'edit', rider }));
  };

  const handleDeleteRider = async (riderId: number) => {
    if (window.confirm('Are you sure you want to delete this rider?')) {
      try {
        await deleteRider(riderId).unwrap();
      } catch (error) {
        console.error('Failed to delete rider:', error);
      }
    }
  };

  const handleSuspendRider = async (riderId: number) => {
    try {
      await suspendRider(riderId).unwrap();
    } catch (error) {
      console.error('Failed to suspend rider:', error);
    }
  };

  const handleActivateRider = async (riderId: number) => {
    try {
      await activateRider(riderId).unwrap();
    } catch (error) {
      console.error('Failed to activate rider:', error);
    }
  };

  // Loading state
  if (ridersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading riders...</div>
      </div>
    );
  }

  // Error state
  if (ridersError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading riders. Please try again.</div>
      </div>
    );
  }

  const riders = ridersData?.riders || [];
  const stats = statsData || {
    totalRiders: 0,
    activeRiders: 0,
    newThisMonth: 0,
    averageRating: 0
  };
  const pagination = ridersData?.pagination;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Riders Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor all registered riders, their activities, and account status.
            </p>
          </div>
          
          <button 
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <Plus className="h-4 w-4" />
            Add New Rider
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search riders by name, email, or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1"
              style={{ 
                '--tw-ring-color': ACCENT,
                borderColor: 'var(--focus-border, #d1d5db)'
              } as React.CSSProperties}
              onFocus={(e) => {
                e.target.style.setProperty('--focus-border', ACCENT);
                e.target.style.borderColor = ACCENT;
              }}
              onBlur={(e) => {
                e.target.style.removeProperty('--focus-border');
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
            style={{ 
              '--tw-ring-color': ACCENT
            } as React.CSSProperties}
            onFocus={(e) => {
              e.target.style.borderColor = ACCENT;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Riders Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          {/* Black header with icon */}
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">
              {statsLoading ? '...' : (stats.totalRiders || 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-600">Total Riders</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          {/* Black header with icon */}
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <BadgeCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">
              {statsLoading ? '...' : (stats.activeRiders || 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-600">Active Riders</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          {/* Black header with icon */}
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Plus className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">
              {statsLoading ? '...' : (stats.newThisMonth || 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-600">New This Month</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          {/* Black header with icon */}
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <span className="text-white text-lg">★</span>
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">
              {statsLoading ? '...' : (stats.averageRating || 0).toFixed(1)}
            </p>
            <p className="mt-1 text-sm text-gray-600">Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Riders Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-[#EFF5FF]">
          <h3 className="text-lg font-semibold text-gray-800">All Riders</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Rides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {riders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {ridersLoading ? 'Loading riders...' : 'No riders found'}
                  </td>
                </tr>
              ) : (
                riders.map((rider) => (
                  <tr key={rider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {rider.avatar ? (
                            <img 
                              src={rider.avatar} 
                              alt={rider.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {(rider.name || '').split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                          <div className="text-sm text-gray-500">ID: {rider.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{rider.email}</div>
                      <div className="text-sm text-gray-500">{rider.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rider.totalRides}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm text-gray-900">{rider.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={classNames(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        rider.status === "Active" 
                          ? "bg-green-100 text-green-800"
                          : rider.status === "Suspended"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      )}>
                        {rider.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(rider.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewRider(rider)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View rider details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditRider(rider)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit rider"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {rider.status === 'Active' ? (
                          <button 
                            onClick={() => handleSuspendRider(rider.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Suspend rider"
                          >
                            <Filter className="h-4 w-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleActivateRider(rider.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Activate rider"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteRider(rider.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete rider"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} results
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                if (pageNum > pagination.totalPages) return null;
                
                return (
                  <button 
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={classNames(
                      "px-3 py-1 text-sm rounded",
                      pageNum === pagination.currentPage
                        ? "text-white"
                        : "border border-gray-200 hover:bg-gray-50"
                    )}
                    style={pageNum === pagination.currentPage ? { backgroundColor: ACCENT } : undefined}
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
    </div>
  );
}
