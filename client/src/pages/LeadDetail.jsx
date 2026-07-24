import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatDateTime, formatCurrency, statusColors, statusLabels, priorityColors, priorityLabels, sourceLabels } from '../utils/helpers';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2, Archive, Send, Mail, Phone, Building, Globe, DollarSign, Tag, User, Clock, Edit } from 'lucide-react';

const LeadDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [sendingNote, setSendingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get(`/leads/${id}`).then(res => {
      if (cancelled) return;
      setLead(res.data.lead);
      setNotes(res.data.notes);
      setActivities(res.data.activities);
    }).catch(() => {
      if (!cancelled) { toast.error('Lead not found'); navigate('/leads'); }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, navigate]);

  const handleStatusChange = async (status) => {
    try {
      await api.patch('/leads/status', { leadId: id, status });
      setLead(prev => ({ ...prev, status }));
      toast.success(`Status updated to ${statusLabels[status]}`);
      fetchLead();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const fetchLead = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data.lead);
      setNotes(res.data.notes);
      setActivities(res.data.activities);
    } catch (err) {}
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSendingNote(true);
    try {
      await api.post('/notes', { leadId: id, message: noteText });
      setNoteText('');
      toast.success('Note added');
      fetchLead();
    } catch (err) { toast.error('Failed to add note'); }
    finally { setSendingNote(false); }
  };

  const handleUpdateNote = async (noteId) => {
    try {
      await api.put(`/notes/${noteId}`, { message: editText });
      setEditingNote(null);
      toast.success('Note updated');
      fetchLead();
    } catch (err) { toast.error('Failed to update note'); }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    try { await api.delete(`/notes/${noteId}`); toast.success('Note deleted'); fetchLead(); }
    catch (err) { toast.error('Failed to delete note'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Permanently delete this lead?')) return;
    try { await api.delete(`/leads/${id}`); toast.success('Lead deleted'); navigate('/leads'); }
    catch (err) { toast.error('Failed to delete lead'); }
  };

  const handleArchive = async () => {
    try { await api.patch(`/leads/${id}/archive`); toast.success('Lead archived'); fetchLead(); }
    catch (err) { toast.error('Failed to archive lead'); }
  };

  const actionIcons = { created: '🎉', updated: '✏️', status_changed: '🔄', assigned: '👤', note_added: '📝', deleted: '🗑️', archived: '📦', restored: '♻️' };

  if (loading) return <div className="space-y-6">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-48 rounded-xl" />)}</div>;
  if (!lead) return null;

  const statuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/leads')} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{lead.company || 'No company'} &middot; {lead.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleArchive} className="btn-secondary flex items-center gap-2 text-sm"><Archive className="w-4 h-4" /> Archive</button>
          {user?.role === 'admin' && <button onClick={handleDelete} className="btn-danger flex items-center gap-2 text-sm"><Trash2 className="w-4 h-4" /> Delete</button>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-4 bg-white dark:bg-dark-900 rounded-xl border border-gray-100 dark:border-dark-800">
        {statuses.map(s => (
          <button key={s} onClick={() => handleStatusChange(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${lead.status === s ? `${statusColors[s]} ring-2 ring-offset-1 ring-current` : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'}`}>
            {statusLabels[s]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
            <form onSubmit={handleAddNote} className="flex gap-3 mb-6">
              <input type="text" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add a note..." className="input-field flex-1" />
              <button type="submit" disabled={sendingNote || !noteText.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                <Send className="w-4 h-4" /> Add
              </button>
            </form>
            <div className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-gray-400 text-center py-6">No notes yet</p>
              ) : notes.map(note => (
                <div key={note._id} className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 text-xs font-bold">{note.userId?.name?.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{note.userId?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(note.createdAt)}</p>
                      </div>
                    </div>
                    {(user?._id === note.userId?._id || user?.role === 'admin') && (
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingNote(note._id); setEditText(note.message); }} className="p-1 hover:bg-gray-200 dark:hover:bg-dark-700 rounded text-gray-400"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteNote(note._id)} className="p-1 hover:bg-red-100 rounded text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </div>
                  {editingNote === note._id ? (
                    <div className="mt-3">
                      <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="input-field text-sm" rows="2" />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleUpdateNote(note._id)} className="btn-primary text-xs py-1 px-3">Save</button>
                        <button onClick={() => setEditingNote(null)} className="btn-secondary text-xs py-1 px-3">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{note.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Log</h3>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-gray-400 text-center py-6">No activities yet</p>
              ) : activities.map(act => (
                <div key={act._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800">
                  <span className="text-lg">{actionIcons[act.action] || '📌'}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{act.details}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{act.performedBy?.name}</span>
                      <span className="text-xs text-gray-400">&middot;</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(act.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Details</h3>
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: lead.email },
                { icon: Phone, label: 'Phone', value: lead.phone },
                { icon: Building, label: 'Company', value: lead.company },
                { icon: Globe, label: 'Country', value: lead.country },
                { icon: Tag, label: 'Industry', value: lead.industry },
                { icon: DollarSign, label: 'Budget', value: lead.budget ? formatCurrency(lead.budget) : null },
                { icon: User, label: 'Assigned To', value: lead.assignedTo?.name || 'Unassigned' },
                { icon: Clock, label: 'Created', value: formatDate(lead.createdAt) },
              ].filter(i => i.value).map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-sm text-gray-500">Status</span><span className={`badge ${statusColors[lead.status]}`}>{statusLabels[lead.status]}</span></div>
              <div className="flex justify-between items-center"><span className="text-sm text-gray-500">Priority</span><span className={`badge ${priorityColors[lead.priority]}`}>{priorityLabels[lead.priority]}</span></div>
              <div className="flex justify-between items-center"><span className="text-sm text-gray-500">Source</span><span className="text-sm font-medium text-gray-900 dark:text-white">{sourceLabels[lead.source]}</span></div>
              <div className="flex justify-between items-center"><span className="text-sm text-gray-500">Created By</span><span className="text-sm font-medium text-gray-900 dark:text-white">{lead.createdBy?.name}</span></div>
            </div>
          </div>

          {lead.description && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{lead.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
