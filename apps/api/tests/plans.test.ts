import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Plans API Endpoints', () => {
  let ownerToken = '';

  it('Should login as owner to get bearer token for tests', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'owner@gympilot.vn',
        password: 'GymPilot@2026',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    ownerToken = res.body.data.tokens.accessToken;
    expect(ownerToken).toBeDefined();
  });

  it('GET /api/plans - Should return list of active plans', async () => {
    const res = await request(app).get('/api/plans');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/plans/:id - Should return single plan detail', async () => {
    const res = await request(app).get('/api/plans/seed-plan-01');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toContain('Silver');
  });

  it('POST /api/plans - Should create a new plan successfully as OWNER', async () => {
    const res = await request(app)
      .post('/api/plans')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Gói Thử Nghiệm Pilates 10 Buổi',
        type: 'SESSION_PACK',
        price: 950000,
        durationDays: 60,
        totalSessions: 10,
        description: 'Gói thử nghiệm dành cho người mới bắt đầu.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Gói Thử Nghiệm Pilates 10 Buổi');
  });

  it('PUT /api/plans/:id - Should update existing plan as OWNER', async () => {
    const res = await request(app)
      .put('/api/plans/seed-plan-01')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        price: 680000,
        description: 'Tập luyện toàn diện không giới hạn các khung giờ - Đã cập nhật.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.price).toBe(680000);
  });

  it('DELETE /api/plans/:id - Should deactivate or delete plan as OWNER', async () => {
    const res = await request(app)
      .delete('/api/plans/seed-plan-04')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
