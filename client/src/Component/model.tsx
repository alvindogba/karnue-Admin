import React from 'react';
import type { WaitlistRecord } from '../Types/waitlist';

interface Props {
  open: boolean;
  mode: 'view' | 'edit' | null;
  data: WaitlistRecord | null;
  onClose: () => void;
  onSave?: (updated: WaitlistRecord) => void;
}

const WaitlistModal: React.FC<Props> = ({ open, mode, data, onClose, onSave }) => {
  if (!open || !data) return null;

  const isView = mode === 'view';
  const [form, setForm] = React.useState({ ...data });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {isView ? 'View Waitlist Record' : 'Edit Waitlist Record'}
        </h2>

        <div className="space-y-3">
          {['fullName', 'email', 'phone', 'city', 'zipCode'].map((field) => (
            <div key={field}>
              <label className="block font-medium capitalize">{field}</label>
              <input
                name={field}
                value={form[field as keyof typeof form] ?? ''}
                onChange={handleChange}
                disabled={isView}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          {!isView && (
            <button
              onClick={() => onSave?.(form as WaitlistRecord)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitlistModal;
