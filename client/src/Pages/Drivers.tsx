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
  const { data, isLoading, error, refetch } = useGetDriversQuery(queryParams);
  const drivers = (data?.data || []) as AdminDriver[];
  
  // Log for debugging
  console.log('Query params:', queryParams);
  console.log('API Response:', { data, isLoading, error });
  console.log('Drivers array:', drivers);
  const [startBgCheck, { isLoading: starting }] = useStartBackgroundCheckMutation();
  const [approveDriver, { isLoading: approving }] = useApproveDriverMutation();
  const [rejectDriver, { isLoading: rejecting }] = useRejectDriverMutation();
  const { data: stats, isLoading: isLoadingStats } = useGetDriverStatsQuery();
  const [selectedDriver, setSelectedDriver] = useState<AdminDriver | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (driver: AdminDriver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };
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

  interface DriverDetailsModalProps {
    driver: AdminDriver | null;
    isOpen: boolean;
    onClose: () => void;
  }

  function DriverDetailsModal({ driver, isOpen, onClose }: DriverDetailsModalProps) {
    if (!driver || !isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" onClick={onClose}>
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Driver Details
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Personal Information</h4>
                      <dl className="space-y-2">
                        <div className="bg-gray-50 px-4 py-3 rounded-md">
                          <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{driver.firstName || 'N/A'}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-md">
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{driver.email || 'N/A'}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-md">
                          <dt className="text-sm font-medium text-gray-500">Phone</dt>
                          <dd className="mt-1 text-sm text-gray-900">{driver.phone || 'N/A'}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-md">
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              driver.accountStatus === 'active' ? 'bg-green-100 text-green-800' :
                              driver.accountStatus === 'awaiting_verification' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {driver.accountStatus}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </div>
  
                    {/* Vehicle Information */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Vehicle Information</h4>
                      <dl className="space-y-2">
                        <div className="bg-gray-50 px-4 py-3 rounded-md">
                          <dt className="text-sm font-medium text-gray-500">Vehicle</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {[driver.vehicleYear, driver.vehicleMake, driver.vehicleModel]
                              .filter(Boolean)
                              .join(' ') || 'N/A'}
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-md">
                          <dt className="text-sm font-medium text-gray-500">License Plate</dt>
                          <dd className="mt-1 text-sm text-gray-900">{driver.licensePlate || 'N/A'}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-md">
                          <dt className="text-sm font-medium text-gray-500">Vehicle Color</dt>
                          <dd className="mt-1 text-sm text-gray-900">{driver.vehicleColor || 'N/A'}</dd>
                        </div>
                      </dl>
                    </div>
  
                    {/* Documents */}
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-700 mb-2">Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {driver.driversLicenseFront && (
                          <div className="border rounded-md p-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Driver's License (Front)</p>
                            <img 
                              src={driver.driversLicenseFront} 
                              alt="Driver's License Front" 
                              className="h-40 w-full object-contain border rounded"
                            />
                          </div>
                        )}
                        {driver.driversLicenseBack && (
                          <div className="border rounded-md p-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Driver's License (Back)</p>
                            <img 
                              src={driver.driversLicenseBack} 
                              alt="Driver's License Back" 
                              className="h-40 w-full object-contain border rounded"
                            />
                          </div>
                        )}
                        {driver.vehicleRegistration && (
                          <div className="border rounded-md p-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Vehicle Registration</p>
                            <img 
                              src={driver.vehicleRegistration} 
                              alt="Vehicle Registration" 
                              className="h-40 w-full object-contain border rounded"
                            />
                          </div>
                        )}
                        {driver.proofOfInsurance && (
                          <div className="border rounded-md p-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Proof of Insurance</p>
                            <img 
                              src={driver.proofOfInsurance} 
                              alt="Proof of Insurance" 
                              className="h-40 w-full object-contain border rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
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
              ) : error ? (
                <tr><td className="px-6 py-4 text-red-600" colSpan={6}>
                  Error loading drivers: {JSON.stringify(error)}
                  <button onClick={() => refetch()} className="ml-4 text-blue-600 underline">Retry</button>
                </td></tr>
              ) : drivers.length === 0 ? (
                <tr><td className="px-6 py-4" colSpan={6}>No registrations found</td></tr>
              ) : drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {(driver.firstName || 'N A').split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{driver.firstName}</div>
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
                      <button className="text-blue-600 hover:text-blue-900" title="View Details" onClick={() => handleViewDetails(driver)}>
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

      <DriverDetailsModal 
        driver={selectedDriver} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

