import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Lock, Save } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', profileForm);
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return toast.error('Passwords do not match');
    if (passwordForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setSaving(true);
    try {
      await api.put('/users/profile/password', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to change password'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center"><User className="w-5 h-5 text-primary-600" /></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2><p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p></div>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div><label className="label">Name</label><input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="input-field" required /></div>
          <div><label className="label">Phone</label><input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="input-field" placeholder="+1 (555) 123-4567" /></div>
          <div><label className="label">Email</label><input type="email" value={user?.email} className="input-field bg-gray-50 dark:bg-dark-800" disabled /><p className="text-xs text-gray-400 mt-1">Email cannot be changed</p></div>
          <div className="flex justify-end"><button type="submit" disabled={saving} className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}</button></div>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center"><Lock className="w-5 h-5 text-orange-600" /></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2><p className="text-sm text-gray-500 dark:text-gray-400">Keep your account secure</p></div>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div><label className="label">Current Password</label><input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="input-field" required /></div>
          <div><label className="label">New Password</label><input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="input-field" required minLength={6} /></div>
          <div><label className="label">Confirm New Password</label><input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="input-field" required /></div>
          <div className="flex justify-end"><button type="submit" disabled={saving} className="btn-primary flex items-center gap-2"><Lock className="w-4 h-4" /> {saving ? 'Updating...' : 'Update Password'}</button></div>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-sm text-gray-500">Role</p><p className="font-medium text-gray-900 dark:text-white capitalize">{user?.role}</p></div>
          <div><p className="text-sm text-gray-500">Status</p><p className="font-medium text-gray-900 dark:text-white capitalize">{user?.status}</p></div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
