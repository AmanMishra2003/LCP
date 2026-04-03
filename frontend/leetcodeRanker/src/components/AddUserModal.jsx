import { useState } from "react";

const BADGES = ["Guardian", "Knight", "Expert", "Novice"];

export default function AddUserModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ username: "", displayName: "", badge: "Expert", rating: "" });

  const handleSubmit = () => {
    if (!form.username || !form.rating) return;
    onAdd({ ...form, rating: Number(form.rating), delta: 0, id: Date.now() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 w-80 shadow-sm">
        <h2 className="text-base font-medium mb-4">Add user</h2>

        {[
          { label: "LeetCode username", key: "username", type: "text", placeholder: "e.g. aryan_s" },
          { label: "Display name",      key: "displayName", type: "text", placeholder: "e.g. Aryan Sharma" },
          { label: "Rating",            key: "rating", type: "number", placeholder: "e.g. 2100" },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key} className="mb-3">
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Badge</label>
          <select
            value={form.badge}
            onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
          >
            {BADGES.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            Add user
          </button>
        </div>
      </div>
    </div>
  );
}