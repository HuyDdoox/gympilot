import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Auth API Endpoints', () => {
  it('POST /api/auth/login - Should succeed with valid owner credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'owner@gympilot.vn',
        password: 'GymPilot@2026',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('OWNER');
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.tokens.refreshToken).toBeDefined();
  });

  it('POST /api/auth/login - Should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'owner@gympilot.vn',
        password: 'WrongPassword123',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('AUTH_FAILED');
  });

  it('POST /api/auth/login - Should fail with invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'not-an-email',
        password: 'GymPilot@2026',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/refresh-token - Should issue new tokens with valid refresh token', async () => {
    // First login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'owner@gympilot.vn',
        password: 'GymPilot@2026',
      });

    const refreshToken = loginRes.body.data.tokens.refreshToken;

    // Refresh
    const refreshRes = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data.tokens.accessToken).toBeDefined();
    expect(refreshRes.body.data.tokens.refreshToken).toBeDefined();
  });

  it('GET /api/auth/me - Should return current user when authenticated', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'owner@gympilot.vn',
        password: 'GymPilot@2026',
      });

    const accessToken = loginRes.body.data.tokens.accessToken;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.email).toBe('owner@gympilot.vn');
    expect(meRes.body.data.role).toBe('OWNER');
  });

  it('GET /api/auth/me - Should return 401 when token is missing', async () => {
    const meRes = await request(app).get('/api/auth/me');
    expect(meRes.status).toBe(401);
    expect(meRes.body.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/auth/forgot-password & reset-password flow', async () => {
    // 1. Request reset
    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'owner@gympilot.vn' });

    expect(forgotRes.status).toBe(200);
    expect(forgotRes.body.success).toBe(true);
    expect(forgotRes.body.data.resetToken).toBeDefined();

    const resetToken = forgotRes.body.data.resetToken;

    // 2. Reset password
    const resetRes = await request(app)
      .post('/api/auth/reset-password')
      .send({
        resetToken,
        newPassword: 'NewPassword@2026',
      });

    expect(resetRes.status).toBe(200);
    expect(resetRes.body.success).toBe(true);

    // 3. Login with new password
    const loginWithNewRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'owner@gympilot.vn',
        password: 'NewPassword@2026',
      });

    expect(loginWithNewRes.status).toBe(200);
    expect(loginWithNewRes.body.success).toBe(true);

    // Reset back for idempotency
    const forgotBack = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'owner@gympilot.vn' });
    await request(app)
      .post('/api/auth/reset-password')
      .send({
        resetToken: forgotBack.body.data.resetToken,
        newPassword: 'GymPilot@2026',
      });
  });

  it('POST /api/auth/logout - Should acknowledge logout', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
