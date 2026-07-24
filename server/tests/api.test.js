const request = require('supertest');
const { app, server } = require('../server');
const mongoose = require('mongoose');

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('Auth API', () => {
  let token;
  const testUser = { name: 'Test User', email: 'test@test.com', password: 'password123' };

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
    token = res.body.token;
  });

  it('should not register duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(400);
  });

  it('should login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });

  it('should get current user profile', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });
});

describe('Leads API', () => {
  let token;
  let leadId;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@test.com', password: 'password123' });
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
    const res = await request(app).post('/api/auth/login').send({ email: 'test@test.com', password: 'password123' });
    token = res.body.token;
  });

  it('should get dashboard data', async () => {
    const res = await request(app).get('/api/dashboard').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('stats');
    expect(res.body.stats).toHaveProperty('totalLeads');
  });
});
