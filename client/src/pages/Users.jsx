import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X, Users as UsersIcon, Shield, UserCheck, UserX } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member', status: 'active' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users?limit=100');
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        const payload = { name: form.name, email: form.email, role: form.role, status: form.status };
        await api.put(`/users/${editUser._id}`, payload);
        toast.success('User updated');
      } else {
        await api.post('/users', form);
        toast.success('User created');
      }
      setShowModal(false); setEditUser(null);
      setForm({ name: '', email: '', password: '', role: 'member', status: 'active' });
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.error || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.delete(`/users/${id}`); toast.success('User deleted'); fetchUsers(); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed to delete'); }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, status: user.status });
    setShowModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{total} users</p>
        </div>
        <button onClick={() => { setEditUser(null); setForm({ name: '', email: '', password: '', role: 'member', status: 'active' }); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 rounded-lg" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-800">
                <tr>
                  <th className="table-header">User</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Joined</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-dark-800/50">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">{u.name?.charAt(0)?.toUpperCase()}</div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        <Shield className="w-3 h-3 mr-1" /> {u.role}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${u.status === 'active' ? 'bg-green-100 text-green-800' : u.status === 'disabled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {u.status === 'active' ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />} {u.status}
                      </span>
                    </td>
                    <td className="table-cell text-gray-500 dark:text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(u)} className="btn-ghost p-1.5"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(u._id)} className="btn-ghost p-1.5 text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 rounded-2xl w-full max-w-md shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editUser ? 'Edit User' : 'Create User'}</h2>
              <button onClick={() => { setShowModal(false); setEditUser(null); }} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="label">Name</label><input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field" required /></div>
              <div><label className="label">Email</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-field" required /></div>
              {!editUser && <div><label className="label">Password</label><input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="input-field" required minLength={6} /></div>}
              <div><label className="label">Role</label><select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="input-field"><option value="member">Member</option><option value="admin">Admin</option></select></div>
              <div><label className="label">Status</label><select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="input-field"><option value="active">Active</option><option value="inactive">Inactive</option><option value="disabled">Disabled</option></select></div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-800">
                <button type="button" onClick={() => { setShowModal(false); setEditUser(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editUser ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
