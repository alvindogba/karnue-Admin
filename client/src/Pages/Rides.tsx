import { Car, Search, Filter, MapPin, Clock, Eye, Edit, Navigation } from "lucide-react";

/** Utility */
function classNames(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** Sample rides data */
const rides = [
  {
    id: "RIDE-1234",
    rider: "John Doe",
    driver: "Michael Johnson",
    pickup: "Downtown Mall",
    destination: "Airport Terminal 1",
    distance: "12.5 km",
    duration: "25 min",
    fare: "$25.50",
    status: "Completed",
    startTime: "14:30",
    endTime: "14:55",
    date: "2024-08-27",
    rating: 4.8,
  },
  {
    id: "RIDE-1235",
    rider: "Jane Smith",
    driver: "David Wilson",
    pickup: "University Campus",
    destination: "Shopping Center",
    distance: "8.2 km",
    duration: "18 min",
    fare: "$18.75",
    status: "In Progress",
    startTime: "15:10",
    endTime: "-",
    date: "2024-08-27",
    rating: null,
  },
  {
    id: "RIDE-1236",
    rider: "Mike Johnson",
    driver: "Robert Brown",
    pickup: "Business District",
    destination: "Residential Area",
    distance: "15.3 km",
    duration: "32 min",
    fare: "$32.00",
    status: "Cancelled",
    startTime: "12:20",
    endTime: "-",
    date: "2024-08-27",
    rating: null,
  },
  {
    id: "RIDE-1237",
    rider: "Sarah Wilson",
    driver: "James Davis",
    pickup: "Train Station",
    destination: "Hotel District",
    distance: "9.7 km",
    duration: "22 min",
    fare: "$22.30",
    status: "Scheduled",
    startTime: "16:00",
    endTime: "-",
    date: "2024-08-27",
    rating: null,
  },
];

export default function Rides() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6" />
              Rides Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor all ride requests, track ongoing trips, and manage ride operations in real-time.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50">
              <Navigation className="h-4 w-4" />
              Live Map
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ride ID, rider, or driver..."
              className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          
          <select className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>All Status</option>
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

          <input
            type="date"
            className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            defaultValue="2024-08-27"
          />
        </div>
      </div>

      {/* Ride Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rides Today</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <div className="rounded-md bg-blue-100 p-3">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-green-600">89</p>
            </div>
            <div className="rounded-md bg-green-100 p-3">
              <Navigation className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">1,089</p>
            </div>
            <div className="rounded-md bg-blue-100 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">69</p>
            </div>
            <div className="rounded-md bg-red-100 p-3">
              <span className="text-red-600 text-xl">✕</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rides Table */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Rides</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ride ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trip Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
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
              {rides.map((ride) => (
                <tr key={ride.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ride.id}</div>
                    <div className="text-sm text-gray-500">{ride.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Rider: {ride.rider}</div>
                    <div className="text-sm text-gray-500">Driver: {ride.driver}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm text-gray-900 truncate">{ride.pickup}</div>
                        <div className="text-xs text-gray-400">↓</div>
                        <div className="text-sm text-gray-900 truncate">{ride.destination}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ride.distance}</div>
                    <div className="text-sm text-gray-500">{ride.duration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={classNames(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      ride.status === "Completed" 
                        ? "bg-green-100 text-green-800"
                        : ride.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : ride.status === "Scheduled"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {ride.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ride.startTime}</div>
                    {ride.endTime !== "-" && (
                      <div className="text-sm text-gray-500">to {ride.endTime}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ride.fare}</div>
                    {ride.rating && (
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm text-gray-500">{ride.rating}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Navigation className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        <Edit className="h-4 w-4" />
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
            Showing 1 to 4 of 1,247 results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
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
