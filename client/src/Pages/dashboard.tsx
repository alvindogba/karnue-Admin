
import React, { useEffect, useState } from 'react';
import WaitlistTable from '../Component/waitlistTable';
import WaitlistModal from '../Component/model';
import type { WaitlistRecord } from '../Types/waitlist';
import { CSVLink } from "react-csv";
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/waitlist/admin/all`);
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
      await fetch(`${import.meta.env.VITE_API_URL}/delete/${record.id}`, { method: 'DELETE' });
      setWaitlist((prev) => prev.filter((r) => r.id !== record.id));
    }
  };

  const handleSave = async (updated: WaitlistRecord) => {
    await fetch(`${import.meta.env.VITE_API_URL}/update/${updated.id}`, {
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
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Waitlist Dashboard</h1>
        <CSVLink data={filtered} filename="waitlist.csv" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-900">
          Export CSV
        </CSVLink>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search name, email, or user type"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      <WaitlistTable
        data={paginated}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p>
          Showing {paginated.length} of {filtered.length} results
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <WaitlistModal
        open={modalOpen}
        mode={modalMode}
        data={selectedRecord}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </main>
  );
};

export default Dashboard;
