const request = require('supertest');
const { app, server } = require('../server');
const mongoose = require('mongoose');

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('Auth API', () => {
  let token;
  const testEmail = `testuser_${Date.now()}@test.com`;
  const testUser = { name: 'Test User', email: testEmail, password: 'password123' };

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...testUser, role: 'admin' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testEmail);
    token = res.body.token;
  });

  it('should not register duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(400);
  });

  it('should login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testEmail, password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should not login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testEmail, password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });

  it('should get current user profile', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('email', testEmail);
  });
});

describe('Leads API', () => {
  let token;
  let leadId;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@leadflow.com', password: 'admin123' });
    token = res.body.token;
  });

  it('should create a new lead', async () => {
    const res = await request(app).post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Lead', email: 'lead@test.com', company: 'Test Co', source: 'website' });
    expect(res.statusCode).toBe(201);
    expect(res.body.lead).toHaveProperty('name', 'Test Lead');
    leadId = res.body.lead._id;
  });

  it('should get all leads', async () => {
    const res = await request(app).get('/api/leads').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.leads).toBeInstanceOf(Array);
  });

  it('should get a single lead', async () => {
    const res = await request(app).get(`/api/leads/${leadId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.lead).toHaveProperty('name', 'Test Lead');
  });

  it('should update a lead', async () => {
    const res = await request(app).put(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Lead', status: 'contacted' });
    expect(res.statusCode).toBe(200);
    expect(res.body.lead).toHaveProperty('name', 'Updated Lead');
  });

  it('should delete a lead', async () => {
    const res = await request(app).delete(`/api/leads/${leadId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Dashboard API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@leadflow.com', password: 'admin123' });
    token = res.body.token;
  });

  it('should get dashboard data', async () => {
    const res = await request(app).get('/api/dashboard').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('stats');
    expect(res.body.stats).toHaveProperty('totalLeads');
  });
});

describe('Public API', () => {
  it('should capture a lead via public form', async () => {
    const res = await request(app).post('/api/public/capture').send({
      name: 'Public Lead',
      email: 'public@test.com',
      company: 'Public Co',
      message: 'Interested in your product'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('leadId');
  });

  it('should reject capture without required fields', async () => {
    const res = await request(app).post('/api/public/capture').send({ name: 'No Email' });
    expect(res.statusCode).toBe(400);
  });
});
