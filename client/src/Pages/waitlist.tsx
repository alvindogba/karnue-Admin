import React, { useEffect, useState } from 'react';
import { Users, Search, Download } from 'lucide-react';
import WaitlistTable from '../Component/waitlistTable';
import WaitlistModal from '../Component/model';
import type { WaitlistRecord } from '../Types/waitlist';
import { CSVLink } from "react-csv";

/** Accent color - Karnue brand */
const ACCENT = "#0505CE";
const ITEMS_PER_PAGE = 10;

const Dashboard: React.FC = () => {
  const [waitlist, setWaitlist] = useState<WaitlistRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<WaitlistRecord | null>(null);

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/waitlist/admin/all`);
        const data = await res.json();
        setWaitlist(data);
      } catch (err) {
        console.error('Failed to fetch waitlist', err);
      }
    };

    fetchWaitlist();
  }, []);

  const filtered = waitlist.filter((record) => {
    const search = searchTerm.toLowerCase();
    return (
      record.fullName?.toLowerCase().includes(search) ||
      record.email?.toLowerCase().includes(search) ||
      record.userType?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleView = (record: WaitlistRecord) => {
    setModalMode('view');
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleEdit = (record: WaitlistRecord) => {
    setModalMode('edit');
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleDelete = async (record: WaitlistRecord) => {
    if (confirm(`Delete ${record.fullName}?`)) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/waitlist/admin/delete/${record.id}`, { method: 'DELETE' });
      setWaitlist((prev) => prev.filter((r) => r.id !== record.id));
    }
  };

  const handleSave = async (updated: WaitlistRecord) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/waitlist/admin/update/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setWaitlist((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
    );
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Waitlist Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor user waitlist registrations and approvals.
            </p>
          </div>
          
          <CSVLink 
            data={filtered} 
            filename="waitlist.csv" 
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </CSVLink>
        </div>

        {/* Search */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, or user type"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
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
        </div>
      </div>

      {/* Waitlist Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">{waitlist.length}</p>
            <p className="mt-1 text-sm text-gray-600">Total Waitlist</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Search className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">{filtered.length}</p>
            <p className="mt-1 text-sm text-gray-600">Filtered Results</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">{waitlist.filter(r => r.userType === 'rider').length}</p>
            <p className="mt-1 text-sm text-gray-600">Riders</p>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-0 shadow-sm">
          <div className="flex items-center gap-2 rounded-t-md bg-black px-4 py-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold">{waitlist.filter(r => r.userType === 'driver').length}</p>
            <p className="mt-1 text-sm text-gray-600">Drivers</p>
          </div>
        </div>
      </div>

      {/* Waitlist Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-[#EFF5FF]">
          <h3 className="text-lg font-semibold text-gray-800">Waitlist Records</h3>
        </div>
        
        <WaitlistTable
          data={paginated}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {paginated.length} of {filtered.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              className="px-3 py-1 text-sm text-white rounded"
              style={{ backgroundColor: ACCENT }}
            >
              {currentPage}
            </button>
            <span className="text-sm text-gray-500">of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <WaitlistModal
        open={modalOpen}
        mode={modalMode}
        data={selectedRecord}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Dashboard;
