import React from 'react';
import { BarChart3, Download, Calendar, TrendingUp, Users, Car, DollarSign, Filter, Search } from "lucide-react";

/** Accent color - Karnue brand */
const ACCENT = "#0505CE";

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Reports & Analytics
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor business performance, revenue trends, and operational metrics.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button 
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Date Range and Search */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports, metrics, or data..."
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
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
            <option>Custom range</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">$12,450</p>
            <p className="mt-1 text-sm text-gray-600">Total Revenue</p>
            <div className="mt-2 flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">+12.5%</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Car className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">1,234</p>
            <p className="mt-1 text-sm text-gray-600">Total Rides</p>
            <div className="mt-2 flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">+8.3%</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">856</p>
            <p className="mt-1 text-sm text-gray-600">Active Users</p>
            <div className="mt-2 flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">+15.7%</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">94.2%</p>
            <p className="mt-1 text-sm text-gray-600">Completion Rate</p>
            <div className="mt-2 flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">+2.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-[#EFF5FF]">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Trends</h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Revenue chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rides Chart */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-[#EFF5FF]">
            <h3 className="text-lg font-semibold text-gray-800">Ride Activity</h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Activity chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-[#EFF5FF]">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">
                Detailed analytics and activity logs will be displayed here.
              </p>
              <div className="mt-4">
                <button 
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                  style={{ backgroundColor: ACCENT }}
                >
                  <BarChart3 className="h-4 w-4" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
