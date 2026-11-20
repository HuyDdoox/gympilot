import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Members API & CSV Import Endpoints', () => {
  it('GET /api/members - Should return members list with pagination', async () => {
    const res = await request(app).get('/api/members?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.members)).toBe(true);
    expect(res.body.data.pagination).toBeDefined();
    expect(res.body.data.pagination.page).toBe(1);
    expect(res.body.data.pagination.limit).toBe(5);
  });

  it('GET /api/members - Should support search query', async () => {
    const res = await request(app).get('/api/members?search=Dung');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.members.length).toBeGreaterThan(0);
    expect(res.body.data.members[0].fullName).toContain('Dung');
  });

  it('GET /api/members - Should support status filter', async () => {
    const res = await request(app).get('/api/members?status=PAUSED');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    for (const m of res.body.data.members) {
      expect(m.status).toBe('PAUSED');
    }
  });

  it('POST /api/members & GET /api/members/:id & PUT /api/members/:id', async () => {
    const uniqueEmail = `test.member.${Date.now()}@example.com`;

    // 1. Create
    const createRes = await request(app)
      .post('/api/members')
      .send({
        fullName: 'Nguyễn Kiểm Thử',
        email: uniqueEmail,
        phone: '0988776655',
        gender: 'Nam',
        dateOfBirth: '1995-10-10',
        notes: 'Hội viên tạo từ automated test',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.email).toBe(uniqueEmail);
    const memberId = createRes.body.data.id;

    // 2. Get Detail
    const detailRes = await request(app).get(`/api/members/${memberId}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.success).toBe(true);
    expect(detailRes.body.data.fullName).toBe('Nguyễn Kiểm Thử');

    // 3. Update
    const updateRes = await request(app)
      .put(`/api/members/${memberId}`)
      .send({
        fullName: 'Nguyễn Kiểm Thử (Updated)',
        phone: '0911223344',
        status: 'PAUSED',
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);

    // Verify update
    const verifyRes = await request(app).get(`/api/members/${memberId}`);
    expect(verifyRes.body.data.fullName).toBe('Nguyễn Kiểm Thử (Updated)');
    expect(verifyRes.body.data.status).toBe('PAUSED');
  });

  it('GET /api/members/template-csv - Should download UTF-8 CSV template', async () => {
    const res = await request(app).get('/api/members/template-csv');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text).toContain('Họ và tên');
    expect(res.text).toContain('Email');
  });

  it('POST /api/members/import-preview - Should validate CSV and return structured errors', async () => {
    const csvContent =
      'Họ và tên,Email,Số điện thoại,Giới tính,Ngày sinh,Ghi chú\n' +
      'Trần Văn Đúng,valid.person@gmail.com,0901234567,Nam,1995-01-01,Hợp lệ\n' +
      ',bad.email,0901234567,Nam,1995-01-01,Thiếu tên và sai email\n' +
      'Trần Văn Đúng,valid.person@gmail.com,0901234567,Nam,1995-01-01,Email bị trùng';

    const res = await request(app)
      .post('/api/members/import-preview')
      .send({ csvContent });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalRows).toBe(3);
    expect(res.body.data.validCount).toBe(1);
    expect(res.body.data.invalidCount).toBe(2);
    expect(res.body.data.errors.length).toBeGreaterThan(0);
  });

  it('POST /api/members/import - Should import valid rows and return summary', async () => {
    const uniqueEmail = `csv.import.${Date.now()}@example.com`;
    const rows = [
      {
        fullName: 'Người Dùng CSV',
        email: uniqueEmail,
        phone: '0933221100',
        gender: 'Nữ',
        dateOfBirth: '1998-05-12',
        notes: 'Import từ CSV test',
      },
    ];

    const res = await request(app)
      .post('/api/members/import')
      .send({ rows });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.importedCount).toBe(1);
    expect(res.body.data.failedCount).toBe(0);
  });
});
