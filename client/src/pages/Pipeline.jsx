import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { statusLabels, statusColors, formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import { GripVertical } from 'lucide-react';

const Pipeline = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState(null);

  const statuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'];

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads?limit=200&isArchived=false');
      setLeads(res.data.leads);
    } catch (err) { toast.error('Failed to load pipeline'); }
    finally { setLoading(false); }
  };

  const handleDragStart = (lead) => setDraggedLead(lead);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (newStatus) => {
    if (!draggedLead || draggedLead.status === newStatus) return;
    try {
      await api.patch('/leads/status', { leadId: draggedLead._id, status: newStatus });
      setLeads(prev => prev.map(l => l._id === draggedLead._id ? { ...l, status: newStatus } : l));
      toast.success(`Moved to ${statusLabels[newStatus]}`);
    } catch (err) { toast.error('Failed to update status'); }
    setDraggedLead(null);
  };

  if (loading) return <div className="grid grid-cols-7 gap-4">{[...Array(7)].map((_, i) => <div key={i} className="skeleton h-96 rounded-xl" />)}</div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pipeline</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Drag and drop leads between stages</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map(status => {
          const statusLeads = leads.filter(l => l.status === status);
          const totalBudget = statusLeads.reduce((sum, l) => sum + (l.budget || 0), 0);
          return (
            <div key={status} className="flex-shrink-0 w-72" onDragOver={handleDragOver} onDrop={() => handleDrop(status)}>
              <div className={`rounded-xl p-4 mb-3 ${statusColors[status]}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{statusLabels[status]}</h3>
                  <span className="text-xs font-bold bg-white/30 px-2 py-0.5 rounded-full">{statusLeads.length}</span>
                </div>
                {totalBudget > 0 && <p className="text-xs mt-1 opacity-80">{formatCurrency(totalBudget)}</p>}
              </div>
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
                {statusLeads.map(lead => (
                  <Link key={lead._id} to={`/dashboard/leads/${lead._id}`} draggable onDragStart={() => handleDragStart(lead)} className="card p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group block">
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-primary-600 truncate">{lead.name}</p>
                        {lead.company && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{lead.company}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          {lead.assignedTo && <span className="text-[10px] bg-gray-100 dark:bg-dark-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400">{lead.assignedTo.name?.split(' ')[0]}</span>}
                          {lead.budget > 0 && <span className="text-[10px] text-green-600 font-medium">{formatCurrency(lead.budget)}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {statusLeads.length === 0 && <p className="text-center text-sm text-gray-400 py-8">No leads</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
