import { Car, Search, Filter, Plus, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

/** Utility */
function classNames(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** Accent color - Karnue brand */
const ACCENT = "#0505CE";

/** Sample driver data */
const drivers = [
  {
    id: 1,
    name: "Michael Johnson",
    email: "michael.j@email.com",
    phone: "+1 234 567 8900",
    licenseNumber: "DL123456789",
    vehicleModel: "Toyota Camry 2020",
    plateNumber: "ABC-1234",
    totalRides: 234,
    rating: 4.8,
    status: "Active",
    joinDate: "2024-01-10",
    earnings: "$2,450",
  },
  {
    id: 2,
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1 234 567 8901",
    licenseNumber: "DL987654321",
    vehicleModel: "Honda Accord 2021",
    plateNumber: "XYZ-5678",
    totalRides: 189,
    rating: 4.6,
    status: "Active",
    joinDate: "2024-02-15",
    earnings: "$1,890",
  },
  {
    id: 3,
    name: "Robert Brown",
    email: "robert.brown@email.com",
    phone: "+1 234 567 8902",
    licenseNumber: "DL456789123",
    vehicleModel: "Nissan Altima 2019",
    plateNumber: "DEF-9012",
    totalRides: 67,
    rating: 4.3,
    status: "Pending",
    joinDate: "2024-03-20",
    earnings: "$670",
  },
  {
    id: 4,
    name: "James Davis",
    email: "james.davis@email.com",
    phone: "+1 234 567 8903",
    licenseNumber: "DL789123456",
    vehicleModel: "Hyundai Elantra 2022",
    plateNumber: "GHI-3456",
    totalRides: 312,
    rating: 4.9,
    status: "Active",
    joinDate: "2023-11-05",
    earnings: "$3,120",
  },
];

export default function Drivers() {
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
            onFocus={(e) => {
              e.target.style.borderColor = ACCENT;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Car className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">856</p>
            <p className="mt-1 text-sm text-gray-600">Total Drivers</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">743</p>
            <p className="mt-1 text-sm text-gray-600">Active Drivers</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">67</p>
            <p className="mt-1 text-sm text-gray-600">Pending Approval</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <span className="text-white text-lg">★</span>
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">4.6</p>
            <p className="mt-1 text-sm text-gray-600">Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-[#EFF5FF]">
          <h3 className="text-lg font-semibold text-gray-800">All Drivers</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-sm text-gray-500">ID: {driver.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.email}</div>
                    <div className="text-sm text-gray-500">{driver.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.vehicleModel}</div>
                    <div className="text-sm text-gray-500">{driver.plateNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.totalRides} rides</div>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm text-gray-900">{driver.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={classNames(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      driver.status === "Active" 
                        ? "bg-green-100 text-green-800"
                        : driver.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.earnings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
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
  );
}
