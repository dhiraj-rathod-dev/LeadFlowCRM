const router = require('express').Router();
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

router.post('/capture', async (req, res) => {
  try {
    const { name, email, phone, company, message, source, budget, industry, country } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const lead = await Lead.create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      description: message || '',
      source: source || 'website',
      budget: budget ? parseFloat(budget) : 0,
      industry: industry || '',
      country: country || '',
      status: 'new',
      priority: 'medium',
      createdBy: null
    });
    res.status(201).json({ message: 'Thank you! We will get back to you shortly.', leadId: lead._id });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
