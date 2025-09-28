import { Car, Search, Filter, Plus, Eye, CheckCircle, XCircle, ShieldAlert, Play } from "lucide-react";
import { useState } from 'react';
import { 
  useGetDriversQuery, 
  useStartBackgroundCheckMutation, 
  useApproveDriverMutation, 
  useRejectDriverMutation,
  useGetDriverStatsQuery // Add this import
} from '../../Store/Api/driversApi';

//import { useGetReservationsQuery } from '../../Store/Api/reservationsApi';
import type { AdminDriver } from '../../Store/interface';

/** Utility */
function classNames(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** Accent color - Karnue brand */
const ACCENT = "#0505CE";

function statusBadge(status: AdminDriver['accountStatus']) {
  switch (status) {
    case 'awaiting_verification':
      return 'bg-yellow-100 text-yellow-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'draft':
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function Drivers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminDriver['accountStatus']>('all');
  // Build query params based on selected status
  const queryParams = {
    search,
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'DESC' as const,
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
  };
  const { data, isLoading, refetch } = useGetDriversQuery(queryParams);
  const drivers = (data?.data || []) as AdminDriver[];
  const [startBgCheck, { isLoading: starting }] = useStartBackgroundCheckMutation();
  const [approveDriver, { isLoading: approving }] = useApproveDriverMutation();
  const [rejectDriver, { isLoading: rejecting }] = useRejectDriverMutation();
  const { data: stats, isLoading: isLoadingStats } = useGetDriverStatsQuery();

  const handleStartCheck = async (id: number) => {
    await startBgCheck(id).unwrap();
    await refetch();
  };
  const handleApprove = async (id: number) => {
    await approveDriver(id).unwrap();
    await refetch();
  };
  const handleReject = async (id: number) => {
    const reason = window.prompt('Reason for rejection (optional)') || undefined;
    await rejectDriver({ id, reason }).unwrap();
    await refetch();
  };

  function StatCard({ 
    icon, 
    value, 
    label, 
    isRating = false 
  }: { 
    icon: React.ReactNode; 
    value: string | number;  // Allow both string and number
    label: string;
    isRating?: boolean;
  }) {
    // Convert value to string for display
    const displayValue = value.toString();
    
    return (
      <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
        <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
          <div className="rounded-md bg-white/10 p-1.5">
            {icon}
          </div>
        </div>
        <div className="px-4 py-4">
          <p className={`text-2xl font-bold ${isRating ? 'flex items-center gap-1' : ''}`}>
            {isRating && <span>★</span>}
            {displayValue}
          </p>
          <p className="mt-1 text-sm text-gray-600">{label}</p>
        </div>
      </div>
    );
  }
  
    

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6" />
              Drivers Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage driver registrations, verify documents, and monitor driver performance.
            </p>
          </div>
          
          <button 
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <Plus className="h-4 w-4" />
            Add New Driver
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search drivers by name, license, or vehicle..."
              className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1"
              style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') refetch(); }}
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
            className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1"
            style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            onFocus={(e) => {
              e.target.style.borderColor = ACCENT;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            <option value="all">All status</option>
            <option value="awaiting_verification">Awaiting verification</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={<Car className="h-5 w-5" />}
          value={isLoadingStats ? "..." : stats?.totalDrivers || "0"}
          label="Total Drivers"
        />
        <StatCard 
          icon={<CheckCircle className="h-5 w-5" />}
          value={isLoadingStats ? "..." : stats?.activeDrivers || "0"}
          label="Active Drivers"
        />
        <StatCard 
          icon={<ShieldAlert className="h-5 w-5" />}
          value={isLoadingStats ? "..." : stats?.pendingApproval || "0"}
          label="Pending Approval"
        />
        <StatCard 
          icon={<span className="text-yellow-400">★</span>}
          value={isLoadingStats ? "..." : stats?.avgRating || "0.0"}
          label="Avg Rating"
          isRating
        />
      </div>

      {/* Drivers Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-[#EFF5FF]">
          <h3 className="text-lg font-semibold text-gray-800">Driver Registrations</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Background Check
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td className="px-6 py-4" colSpan={6}>Loading…</td></tr>
              ) : drivers.length === 0 ? (
                <tr><td className="px-6 py-4" colSpan={6}>No registrations found</td></tr>
              ) : drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {(driver.fullName || 'N A').split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{driver.fullName}</div>
                        <div className="text-xs text-gray-500">Submitted: {driver.submittedAt ? new Date(driver.submittedAt).toLocaleString() : '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.email}</div>
                    <div className="text-sm text-gray-500">{driver.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.vehicleYear || '-'} {driver.vehicleMake || ''} {driver.vehicleModel || ''}</div>
                    <div className="text-sm text-gray-500">Plate: {driver.licensePlate || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <ShieldAlert className="h-4 w-4" />
                      {driver.backgroundCheckStatus.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={classNames("inline-flex px-2 py-1 text-xs font-semibold rounded-full", statusBadge(driver.accountStatus))}>
                      {driver.accountStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1" onClick={() => handleStartCheck(driver.id)} title="Start Background Check">
                        <Play className="h-4 w-4" />
                        {starting ? '...' : 'Check'}
                      </button>
                      <button className="text-green-600 hover:text-green-900 inline-flex items-center gap-1" onClick={() => handleApprove(driver.id)} title="Approve">
                        <CheckCircle className="h-4 w-4" />
                        {approving ? '...' : 'Approve'}
                      </button>
                      <button className="text-red-600 hover:text-red-900 inline-flex items-center gap-1" onClick={() => handleReject(driver.id)} title="Reject">
                        <XCircle className="h-4 w-4" />
                        {rejecting ? '...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 1 to 4 of 856 results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">
              Previous
            </button>
            <button 
              className="px-3 py-1 text-sm text-white rounded"
              style={{ backgroundColor: ACCENT }}
            >
              1
            </button>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

