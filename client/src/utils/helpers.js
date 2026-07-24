export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount || 0);
};

export const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  proposal_sent: 'bg-indigo-100 text-indigo-800',
  negotiation: 'bg-orange-100 text-orange-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-800'
};

export const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700'
};

export const statusLabels = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified', proposal_sent: 'Proposal Sent',
  negotiation: 'Negotiation', won: 'Won', lost: 'Lost', archived: 'Archived'
};

export const sourceLabels = {
  website: 'Website', referral: 'Referral', social_media: 'Social Media', advertisement: 'Advertisement',
  cold_call: 'Cold Call', email: 'Email', other: 'Other'
};

export const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' };

export const truncate = (str, len = 50) => str?.length > len ? str.substring(0, len) + '...' : str;
