import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from 'sonner';
import adminAxiosInstance from '@/config/axiosConfig/adminAxiosInstance';
import {
  ADMIN_PAGE,
  ADMIN_HEADER_TITLE,
  ADMIN_TABLE_WRAP,
} from '@/components/Admin/adminPageLayout';
import { displayValue } from '@/utils/tableValue';

// Format date like "Mar 05, 2026 · 12:39 PM"
function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Initials avatar color derived from email
function avatarColor(email = '') {
  const palette = [
    ['#e0f2fe', '#0369a1'],
    ['#fce7f3', '#9d174d'],
    ['#dcfce7', '#15803d'],
    ['#fef3c7', '#92400e'],
    ['#ede9fe', '#5b21b6'],
    ['#fee2e2', '#991b1b'],
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

function Avatar({ name, email }) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : email?.[0]?.toUpperCase() ?? '?';
  const [bg, fg] = avatarColor(email);
  return (
    <div
      style={{ background: bg, color: fg }}
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 select-none"
    >
      {initials}
    </div>
  );
}

function AdminRow({ admin, index, onEdit, onToggleBlock }) {
  const isSuperAdmin = admin.isSuperAdmin === true;
  const isBlocked = admin.isBlocked === true;

  return (
    <li
      className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors duration-150"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <Avatar name={admin.name} email={admin.email} />

      {/* Name column */}
      <div className="w-40 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-slate-800 text-sm truncate">
            {admin.name || <span className="text-slate-400 font-normal">—</span>}
          </p>
          {isSuperAdmin && (
            <span className="inline-flex items-center text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0">
              Super
            </span>
          )}
        </div>
      </div>

      {/* Email column */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 truncate">{displayValue(admin.email)}</p>
      </div>

      {/* Joined */}
      <div className="hidden sm:flex flex-col items-end gap-0.5 text-right w-44">
        <span className="text-xs text-slate-600 font-mono">{formatDate(admin.createdAt)}</span>
      </div>

      {/* Status badge */}
      <div className="hidden md:block w-20 text-center">
        {isBlocked ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block" />
            Blocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
            Active
          </span>
        )}
      </div>

      {/* Action buttons — hidden for super admin */}
      <div className="flex items-center gap-2 w-24 justify-end">
        {isSuperAdmin ? (
          <span className="text-[11px] text-slate-300 italic">—</span>
        ) : (
          <>
            <button
              onClick={() => onEdit(admin)}
              title="Edit admin"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
              </svg>
            </button>
            <button
              onClick={() => onToggleBlock(admin)}
              title={isBlocked ? 'Unblock admin' : 'Block admin'}
              className={`p-1.5 rounded-md transition-colors ${
                isBlocked
                  ? 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50'
                  : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              {isBlocked ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              )}
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default function Admins() {
  const [open, setOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ _id: '', name: '', email: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await adminAxiosInstance.get('/get-admins');
      if (res?.data?.response) setAdmins(res.data.response);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Email and password required');
    setSubmitting(true);
    try {
      const res = await adminAxiosInstance.post('/create-admin', form);
      if (res?.data) {
        toast.success('Admin created');
        setOpen(false);
        setForm({ email: '', password: '', name: '' });
        fetchAdmins();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (admin) => {
    setEditForm({ _id: admin._id, name: admin.name || '', email: admin.email });
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      await adminAxiosInstance.put(`/update-admin/${editForm._id}`, {
        name: editForm.name,
        email: editForm.email,
      });
      toast.success('Admin updated');
      setEditOpen(false);
      fetchAdmins();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update admin');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleToggleBlock = async (admin) => {
    const action = admin.isBlocked ? 'unblock' : 'block';
    try {
      await adminAxiosInstance.patch(`/${action}-admin/${admin._id}`);
      toast.success(`Admin ${action}ed`);
      fetchAdmins();
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${action} admin`);
    }
  };

  return (
    <div className={ADMIN_PAGE}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className={ADMIN_HEADER_TITLE}>Administrators</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading ? 'Loading…' : `${admins.length} admin${admins.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Admin
        </button>
      </div>

      {/* Table card */}
      <div className={ADMIN_TABLE_WRAP}>

        {/* Column headers */}
        <div className="flex items-center gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="w-10 flex-shrink-0" />
          <div className="w-40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Name</div>
          <div className="flex-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email</div>
          <div className="hidden sm:block text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-44 text-right">Joined</div>
          <div className="hidden md:block text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-20 text-center">Status</div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-24 text-right">Actions</div>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <svg className="w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm">Fetching admins…</span>
          </div>
        ) : admins.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-5.197-3.775M9 20H4v-2a4 4 0 015.197-3.775M15 11a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm font-medium">No admins yet</p>
            <p className="text-xs">Click "Add Admin" to create the first one.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {admins.map((a, i) => (
              <AdminRow key={a._id} admin={a} index={i} onEdit={handleEdit} onToggleBlock={handleToggleBlock} />
            ))}
          </ul>
        )}
      </div>

      {/* Create Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full max-w-md p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-200">
            <SheetTitle className="text-base font-bold text-slate-900">Add Administrator</SheetTitle>
            <p className="text-sm text-slate-400 mt-1">New admins have full dashboard access.</p>
          </SheetHeader>
          <div className="p-6 flex-1 overflow-y-auto">
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Name <span className="text-slate-300 font-normal normal-case">(optional)</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" required />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">{submitting ? 'Creating…' : 'Create Admin'}</button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="w-full max-w-md p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-200">
            <SheetTitle className="text-base font-bold text-slate-900">Edit Administrator</SheetTitle>
            <p className="text-sm text-slate-400 mt-1">Update name or email for this admin.</p>
          </SheetHeader>
          <div className="p-6 flex-1 overflow-y-auto">
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Jane Smith" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="jane@company.com" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" required />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setEditOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={editSubmitting} className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">{editSubmitting ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}