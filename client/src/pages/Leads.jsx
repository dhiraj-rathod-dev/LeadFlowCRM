import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, statusColors, statusLabels, priorityColors, priorityLabels, sourceLabels } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, ChevronDown, Trash2, Edit, Eye, Archive, X, ChevronLeft, ChevronRight, Users } from 'lucide-react';

const Leads = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'new', priority: 'medium', source: 'website', budget: '', industry: '', country: '', description: '', assignedTo: '' });
  const fetchIdRef = useRef(0);

  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const priority = searchParams.get('priority') || '';
  const source = searchParams.get('source') || '';
  const assignedTo = searchParams.get('assignedTo') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 25;

  const fetchLeads = useCallback(async () => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (priority) params.set('priority', priority);
      if (source) params.set('source', source);
      if (assignedTo) params.set('assignedTo', assignedTo);
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);
      params.set('page', String(page));
      params.set('limit', String(limit));
      const res = await api.get(`/leads?${params.toString()}`);
      if (id !== fetchIdRef.current) return;
      setLeads(res.data.leads);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      if (id === fetchIdRef.current) toast.error('Failed to load leads');
    } finally {
      if (id === fetchIdRef.current) setLoading(false);
    }
  }, [search, status, priority, source, assignedTo, sortBy, sortOrder, page, limit]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => {
    let cancelled = false;
    api.get('/users?limit=100').then(res => {
      if (!cancelled) setUsers(res.data.users);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) { params.set(key, value); } else { params.delete(key); }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, budget: form.budget ? parseFloat(form.budget) : 0 };
      if (editLead) {
        await api.put(`/leads/${editLead._id}`, payload);
        toast.success('Lead updated successfully');
      } else {
        await api.post('/leads', payload);
        toast.success('Lead created successfully');
      }
      setShowModal(false); setEditLead(null);
      setForm({ name: '', email: '', phone: '', company: '', status: 'new', priority: 'medium', source: 'website', budget: '', industry: '', country: '', description: '', assignedTo: '' });
      fetchLeads();
    } catch (err) { toast.error(err.response?.data?.error || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try { await api.delete(`/leads/${id}`); toast.success('Lead deleted'); fetchLeads(); }
    catch (err) { toast.error('Failed to delete lead'); }
  };

  const handleArchive = async (id) => {
    try { await api.patch(`/leads/${id}/archive`); toast.success('Lead archived'); fetchLeads(); }
    catch (err) { toast.error('Failed to archive lead'); }
  };

  const openEdit = (lead) => {
    setEditLead(lead);
    setForm({ name: lead.name, email: lead.email || '', phone: lead.phone || '', company: lead.company || '', status: lead.status, priority: lead.priority, source: lead.source, budget: lead.budget || '', industry: lead.industry || '', country: lead.country || '', description: lead.description || '', assignedTo: lead.assignedTo?._id || '' });
    setShowModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{total} total leads</p>
        </div>
        <button onClick={() => { setEditLead(null); setForm({ name: '', email: '', phone: '', company: '', status: 'new', priority: 'medium', source: 'website', budget: '', industry: '', country: '', description: '', assignedTo: '' }); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, email, company, phone..." value={search} onChange={(e) => updateFilter('search', e.target.value)} className="input-field pl-10 text-sm" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4" /> Filters <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <select value={sortBy} onChange={(e) => updateFilter('sortBy', e.target.value)} className="input-field w-auto text-sm">
            <option value="createdAt">Newest</option>
            <option value="name">Name</option>
            <option value="budget">Budget</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-dark-800">
            <select value={status} onChange={(e) => updateFilter('status', e.target.value)} className="input-field text-sm">
              <option value="">All Status</option>
              {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={priority} onChange={(e) => updateFilter('priority', e.target.value)} className="input-field text-sm">
              <option value="">All Priority</option>
              {Object.entries(priorityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={source} onChange={(e) => updateFilter('source', e.target.value)} className="input-field text-sm">
              <option value="">All Sources</option>
              {Object.entries(sourceLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            {user?.role === 'admin' && (
              <select value={assignedTo} onChange={(e) => updateFilter('assignedTo', e.target.value)} className="input-field text-sm">
                <option value="">All Users</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            )}
          </div>
        )}
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-lg" />)}</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16"><Users className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 font-medium">No leads found</p><p className="text-sm text-gray-400 mt-1">Create your first lead to get started</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-800">
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Company</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Priority</th>
                  <th className="table-header">Source</th>
                  <th className="table-header">Assigned To</th>
                  <th className="table-header">Created</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
                {leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="table-cell">
                      <Link to={`/leads/${lead._id}`} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">{lead.name?.charAt(0)?.toUpperCase()}</div>
                        <div><p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">{lead.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{lead.email}</p></div>
                      </Link>
                    </td>
                    <td className="table-cell text-gray-600 dark:text-gray-400">{lead.company || '-'}</td>
                    <td className="table-cell"><span className={`badge ${statusColors[lead.status]}`}>{statusLabels[lead.status]}</span></td>
                    <td className="table-cell"><span className={`badge ${priorityColors[lead.priority]}`}>{priorityLabels[lead.priority]}</span></td>
                    <td className="table-cell text-gray-600 dark:text-gray-400">{sourceLabels[lead.source]}</td>
                    <td className="table-cell text-gray-600 dark:text-gray-400">{lead.assignedTo?.name || <span className="text-gray-400 italic">Unassigned</span>}</td>
                    <td className="table-cell text-gray-500 dark:text-gray-400 text-xs">{formatDate(lead.createdAt)}</td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/leads/${lead._id}`} className="btn-ghost p-1.5"><Eye className="w-4 h-4" /></Link>
                        <button onClick={() => openEdit(lead)} className="btn-ghost p-1.5"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleArchive(lead._id)} className="btn-ghost p-1.5"><Archive className="w-4 h-4" /></button>
                        {user?.role === 'admin' && <button onClick={() => handleDelete(lead._id)} className="btn-ghost p-1.5 text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-dark-800">
            <p className="text-sm text-gray-500">Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => updateFilter('page', String(page - 1))} disabled={page <= 1} className="btn-ghost p-2 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              {[...Array(Math.min(pages, 5))].map((_, i) => { const p = i + 1; return <button key={p} onClick={() => updateFilter('page', String(p))} className={`w-8 h-8 rounded-lg text-sm font-medium ${page === p ? 'bg-primary-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-dark-800'}`}>{p}</button>; })}
              <button onClick={() => updateFilter('page', String(page + 1))} disabled={page >= pages} className="btn-ghost p-2 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editLead ? 'Edit Lead' : 'Create New Lead'}</h2>
              <button onClick={() => { setShowModal(false); setEditLead(null); }} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="label">Name *</label><input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field" required /></div>
                <div><label className="label">Email</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-field" /></div>
                <div><label className="label">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="input-field" /></div>
                <div><label className="label">Company</label><input type="text" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="input-field" /></div>
                <div><label className="label">Status</label><select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="input-field">{Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                <div><label className="label">Priority</label><select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} className="input-field">{Object.entries(priorityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                <div><label className="label">Source</label><select value={form.source} onChange={(e) => setForm({...form, source: e.target.value})} className="input-field">{Object.entries(sourceLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                <div><label className="label">Budget ($)</label><input type="number" value={form.budget} onChange={(e) => setForm({...form, budget: e.target.value})} className="input-field" min="0" /></div>
                <div><label className="label">Industry</label><input type="text" value={form.industry} onChange={(e) => setForm({...form, industry: e.target.value})} className="input-field" /></div>
                <div><label className="label">Country</label><input type="text" value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} className="input-field" /></div>
                {user?.role === 'admin' && <div className="md:col-span-2"><label className="label">Assign To</label><select value={form.assignedTo} onChange={(e) => setForm({...form, assignedTo: e.target.value})} className="input-field"><option value="">Unassigned</option>{users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}</select></div>}
                <div className="md:col-span-2"><label className="label">Description</label><textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field" rows="3" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-800">
                <button type="button" onClick={() => { setShowModal(false); setEditLead(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editLead ? 'Update Lead' : 'Create Lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
