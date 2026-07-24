import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Zap, Send, CheckCircle, ArrowRight } from 'lucide-react';

const PublicCapture = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '', budget: '', industry: '', country: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/public/capture', form);
      setSubmitted(true);
      toast.success('Lead submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center animate-slide-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h2>
          <p className="text-gray-500 mb-8">Your inquiry has been received. Our team will get back to you within 24 hours.</p>
          <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', company: '', message: '', budget: '', industry: '', country: '' }); }} className="btn-primary w-full">Submit Another</button>
          <Link to="/login" className="block mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">Already have an account? Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDJ2Mmgydi0yek0yNiAxNHYyaDJ2LTJoLTJ6TTIwIDM0aDJ2LTJoLTJ6bTE2LThoMnY0aC0ydi00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Get Started with<br/>LeadFlow CRM</h1>
          <p className="text-lg text-primary-100 mb-8 leading-relaxed">Tell us about your needs and our team will get in touch within 24 hours.</p>
          <div className="space-y-4">
            {['Free consultation for your sales team', 'Personalized demo of LeadFlow CRM', 'No credit card required', 'Cancel anytime'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <span className="text-primary-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">LeadFlow</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Us</h2>
          <p className="text-gray-500 mb-8">Fill out the form below and we'll be in touch.</p>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field" placeholder="John Doe" required />
              </div>
              <div>
                <label className="label">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-field" placeholder="john@company.com" required />
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="input-field" placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <label className="label">Company</label>
                <input type="text" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="input-field" placeholder="Your Company" />
              </div>
              <div>
                <label className="label">Budget ($)</label>
                <input type="number" value={form.budget} onChange={(e) => setForm({...form, budget: e.target.value})} className="input-field" placeholder="10000" min="0" />
              </div>
              <div>
                <label className="label">Country</label>
                <input type="text" value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} className="input-field" placeholder="United States" />
              </div>
            </div>
            <div>
              <label className="label">Industry</label>
              <input type="text" value={form.industry} onChange={(e) => setForm({...form, industry: e.target.value})} className="input-field" placeholder="Technology, Healthcare, etc." />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="input-field" rows="4" placeholder="Tell us about your project or requirements..." />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Submit Inquiry <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in to dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicCapture;
