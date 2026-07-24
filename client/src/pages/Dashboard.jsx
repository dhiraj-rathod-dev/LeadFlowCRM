import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency, statusColors, statusLabels, formatDate } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Users, TrendingUp, Trophy, XCircle, DollarSign, Target, Plus, ArrowUpRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ef4444', '#06b6d4', '#8b5cf6'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div className="skeleton h-8 w-48" /><div className="skeleton h-10 w-32" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-72 rounded-xl" />)}</div>
    </div>
  );

  const stats = data?.stats || {};
  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads || 0, icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: "Today's Leads", value: stats.todayLeads || 0, icon: Clock, color: 'from-cyan-500 to-cyan-600', change: '+5%' },
    { label: 'Won Leads', value: stats.wonLeads || 0, icon: Trophy, color: 'from-green-500 to-green-600', change: '+8%' },
    { label: 'Lost Leads', value: stats.lostLeads || 0, icon: XCircle, color: 'from-red-500 to-red-600', change: '-3%' },
    { label: 'Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'from-purple-500 to-purple-600', change: '+15%' },
    { label: 'Conversion Rate', value: `${stats.conversionRate || 0}%`, icon: Target, color: 'from-orange-500 to-orange-600', change: '+2%' },
  ];

  const monthlyData = (data?.monthlyLeads || []).map(m => ({ name: new Date(m._id.year, m._id.month - 1).toLocaleString('en', { month: 'short' }), leads: m.count }));
  const sourceData = (data?.sourceBreakdown || []).map(s => ({ name: s._id?.replace('_', ' ') || 'Unknown', value: s.count }));
  const pipelineData = (data?.pipeline || []).map(p => ({ name: statusLabels[p._id] || p._id, count: p.count, budget: p.totalBudget }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your leads.</p>
        </div>
        <Link to="/leads" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Lead
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
              </div>
              <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-medium text-green-600">{card.change}</span>
              <span className="text-xs text-gray-400 ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Leads</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="leads" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pipeline Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pipelineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#22c55e" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Leads</h3>
          <div className="space-y-3">
            {(data?.recentLeads || []).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No leads yet. Create your first lead!</p>
            ) : (
              (data?.recentLeads || []).map(lead => (
                <Link key={lead._id} to={`/leads/${lead._id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                      {lead.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">{lead.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{lead.company || 'No company'}</p>
                    </div>
                  </div>
                  <span className={`badge ${statusColors[lead.status]}`}>{statusLabels[lead.status]}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {(data?.userPerformance || []).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr><th className="table-header">Team Member</th><th className="table-header">Total Leads</th><th className="table-header">Won</th><th className="table-header">Win Rate</th></tr></thead>
              <tbody>
                {data.userPerformance.map((u, i) => (
                  <tr key={i} className="border-t border-gray-100 dark:border-dark-800">
                    <td className="table-cell"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xs">{u.name?.charAt(0)}</div><span className="font-medium text-gray-900 dark:text-white">{u.name}</span></div></td>
                    <td className="table-cell font-medium">{u.total}</td>
                    <td className="table-cell"><span className="text-green-600 font-medium">{u.won}</span></td>
                    <td className="table-cell"><div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${u.total > 0 ? (u.won / u.total) * 100 : 0}%` }} /></div><span className="text-xs font-medium text-gray-500">{u.total > 0 ? ((u.won / u.total) * 100).toFixed(0) : 0}%</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
