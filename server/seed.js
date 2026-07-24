const mongoose = require('mongoose');
const User = require('./models/User');
const Lead = require('./models/Lead');
const Note = require('./models/Note');
const Activity = require('./models/Activity');

require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Lead.deleteMany({});
    await Note.deleteMany({});
    await Activity.deleteMany({});

    const admin = await User.create({ name: 'Admin User', email: 'admin@leadflow.com', password: 'admin123', role: 'admin' });
    const member = await User.create({ name: 'Sales Rep', email: 'member@leadflow.com', password: 'member123', role: 'member' });
    console.log('Users created:', admin.email, member.email);

    const leads = [
      { name: 'Acme Corporation', email: 'contact@acme.com', phone: '+1-555-0101', company: 'Acme Corp', status: 'qualified', priority: 'high', source: 'website', assignedTo: member._id, budget: 50000, industry: 'Technology', country: 'USA', createdBy: admin._id },
      { name: 'TechStart Inc', email: 'hello@techstart.io', phone: '+1-555-0102', company: 'TechStart', status: 'contacted', priority: 'medium', source: 'referral', assignedTo: member._id, budget: 25000, industry: 'SaaS', country: 'USA', createdBy: admin._id },
      { name: 'Global Solutions', email: 'info@globalsol.com', phone: '+44-20-7946-0958', company: 'Global Solutions Ltd', status: 'new', priority: 'medium', source: 'social_media', budget: 30000, industry: 'Consulting', country: 'UK', createdBy: admin._id },
      { name: 'Digital Marketing Pro', email: 'team@digimarketing.com', phone: '+1-555-0103', company: 'Digital Marketing Pro', status: 'proposal_sent', priority: 'high', source: 'advertisement', assignedTo: member._id, budget: 75000, industry: 'Marketing', country: 'USA', createdBy: admin._id },
      { name: 'GreenTech Solutions', email: 'contact@greentech.eu', phone: '+49-30-1234567', company: 'GreenTech GmbH', status: 'negotiation', priority: 'urgent', source: 'cold_call', assignedTo: member._id, budget: 120000, industry: 'Clean Energy', country: 'Germany', createdBy: admin._id },
      { name: 'HealthPlus Medical', email: 'info@healthplus.com', phone: '+1-555-0104', company: 'HealthPlus', status: 'won', priority: 'high', source: 'email', assignedTo: member._id, budget: 95000, industry: 'Healthcare', country: 'USA', createdBy: admin._id },
      { name: 'RetailMax Stores', email: 'partnerships@retailmax.com', phone: '+1-555-0105', company: 'RetailMax', status: 'lost', priority: 'low', source: 'website', budget: 15000, industry: 'Retail', country: 'Canada', createdBy: member._id },
      { name: 'EduLearn Platform', email: 'contact@edulearn.org', phone: '+1-555-0106', company: 'EduLearn', status: 'new', priority: 'medium', source: 'website', budget: 40000, industry: 'Education', country: 'USA', createdBy: admin._id },
      { name: 'FinanceHub', email: 'bizdev@financehub.com', phone: '+1-555-0107', company: 'FinanceHub Inc', status: 'contacted', priority: 'high', source: 'referral', assignedTo: member._id, budget: 80000, industry: 'Finance', country: 'USA', createdBy: admin._id },
      { name: 'CloudNine Hosting', email: 'sales@cloudnine.io', phone: '+1-555-0108', company: 'CloudNine', status: 'qualified', priority: 'medium', source: 'social_media', budget: 35000, industry: 'Technology', country: 'Australia', createdBy: admin._id },
      { name: 'BuildRight Construction', email: 'estimates@buildright.com', phone: '+1-555-0109', company: 'BuildRight', status: 'new', priority: 'low', source: 'cold_call', budget: 60000, industry: 'Construction', country: 'USA', createdBy: member._id },
      { name: 'FoodieBox Delivery', email: 'partners@foodiebox.com', phone: '+1-555-0110', company: 'FoodieBox', status: 'proposal_sent', priority: 'medium', source: 'advertisement', assignedTo: member._id, budget: 45000, industry: 'Food & Beverage', country: 'USA', createdBy: admin._id },
    ];

    const createdLeads = await Lead.insertMany(leads);
    console.log(`${createdLeads.length} leads created`);

    for (const lead of createdLeads) {
      await Activity.create({ leadId: lead._id, action: 'created', performedBy: admin._id, details: `Lead "${lead.name}" was created` });
    }

    await Note.create({ leadId: createdLeads[0]._id, userId: member._id, message: 'Had a great initial call. They are interested in our enterprise plan.' });
    await Note.create({ leadId: createdLeads[0]._id, userId: admin._id, message: 'Follow up next week with proposal.' });
    await Note.create({ leadId: createdLeads[4]._id, userId: member._id, message: 'Decision maker is the CTO. Meeting scheduled for Thursday.' });

    console.log('Seed data created successfully!');
    console.log('\nCredentials:');
    console.log('Admin: admin@leadflow.com / admin123');
    console.log('Member: member@leadflow.com / member123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
