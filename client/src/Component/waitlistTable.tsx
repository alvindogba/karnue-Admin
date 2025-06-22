import React from 'react';
import type { WaitlistRecord } from '../Types/waitlist';

interface Props {
  data: WaitlistRecord[];
  onView: (record: WaitlistRecord) => void;
  onEdit: (record: WaitlistRecord) => void;
  onDelete: (record: WaitlistRecord) => void;
}

const WaitlistTable: React.FC<Props> = ({ data, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full table-auto bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">#</th>
            <th className="p-3">Full Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">User Type</th>
            <th className="p-3">City</th>
            <th className="p-3">Wait Position</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr key={record.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{record.fullName}</td>
              <td className="p-3">{record.email}</td>
              <td className="p-3">{record.userType}</td>
              <td className="p-3">{record.city}</td>
              <td className="p-3">{record.waitPosition ?? '-'}</td>
              <td className="p-3 space-x-2">
                <button onClick={() => onView(record)} className="text-blue-600 hover:underline">View</button>
                <button onClick={() => onEdit(record)} className="text-yellow-600 hover:underline">Edit</button>
                <button onClick={() => onDelete(record)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WaitlistTable;
