# BẢNG PHÂN CÔNG & QUY ƯỚC LÀM VIỆC — GYMPILOT

## 1. Phân vai tổng thể

| Hạng mục | Huy — Backend Lead | An — Frontend Lead |
|---|---|---|
| **Sở hữu chính** | `apps/api`, Prisma schema, migration, seed, API, auth, cron, email | `apps/web`, UI, UX, routing, form, state, API client |
| **Công nghệ chính** | Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, Zod | React, TypeScript, Tailwind, React Router, TanStack Query, React Hook Form, Zod |
| **Sở hữu file** | `apps/api/**`<br>`packages/shared/src/types`<br>`packages/shared/src/validators` | `apps/web/**`<br>`packages/shared/src/constants` |
| **Review chính** | Review schema, query, bảo mật, logic nghiệp vụ | Review UI, UX, accessibility, responsive, error state |
| **Không được tự ý sửa** | UI, layout, màu sắc, flow màn hình | Prisma schema, migration, business logic, SQL query |

> **Nguyên tắc vàng**: Huy không sửa trực tiếp UI, An không sửa trực tiếp Prisma schema. Nếu cần thay đổi, tạo issue/task và người sở hữu thực hiện.

---

## 2. Quy ước làm việc chung

1. **API contract là nguồn sự thật**: Mỗi feature phải có file contract trong `docs/api/` trước khi code (endpoint, method, request, response, error, role được phép).
2. **An làm UI với mock trước**: An không chờ Huy xong API; dùng mock data hoặc MSW để dựng màn hình.
3. **Huy triển khai API đúng contract**: Không đổi field, kiểu dữ liệu, status code mà không cập nhật contract và báo An.
4. **Họp 15 phút mỗi sáng**: Xem hôm qua xong gì, hôm nay làm gì, có blocker API/schema nào.
5. **Integration mỗi 2–3 ngày**: Không gom integration đến cuối dự án.
6. **Mỗi task một branch**: `feat/auth-backend-huy`, `feat/auth-ui-an`.
7. **Pull request bắt buộc có**: Mô tả, screenshot (với An), curl/Postman example (với Huy), kết quả `lint/typecheck/test`.

---

## 3. Kế hoạch chi tiết theo Sprint (45 ngày)

### Sprint 1 — Ngày 1–7: Nền tảng (DONE ✅)
- [x] **T-1.1** Khởi tạo monorepo (Huy - P0)
- [x] **T-1.2** Setup backend Express + TS + Prisma + Postgres (Huy - P0)
- [x] **T-1.3** Setup frontend Vite + React + TS + Tailwind (An - P0)
- [x] **T-1.4** Thiết kế API contract ban đầu (Cả hai - P0)
- [x] **T-1.5** Thiết kế UI system (An - P0)
- [x] **T-1.6** Seed dữ liệu demo: 1 gym, 2 staff, 2 trainer, 20 member, 4 plan, 10 class session (Huy - P1)

---

### Sprint 2 — Ngày 8–14: Auth và Hội viên (DONE ✅)
- [x] **T-2.1 Auth API** (Huy - P0): Register owner, login, refresh, logout, GET `/api/me`, bcrypt, JWT, role middleware.
- [x] **T-2.2 Auth UI** (An - P0): Login, Register, Forgot Password, ProtectedRoute, RoleGuard, auto refresh token, logout.
- [x] **T-2.3 Member API** (Huy - P0): CRUD member, search/filter/pagination, tạo user role MEMBER, gửi email kích hoạt.
- [x] **T-2.4 Member UI** (An - P0): Bảng member, search, filter, pagination, form thêm/sửa, trang chi tiết member.
- [x] **T-2.5 Import CSV** (Huy - P1): API import, validate từng dòng, trả kết quả thành công/lỗi.
- [x] **T-2.6 Import UI** (An - P1): Upload CSV, preview, progress, danh sách lỗi theo dòng, tải template.

---

### Sprint 3 — Ngày 15–21: Gói tập và Membership (ĐANG TRIỂN KHAI 🚀)
- [x] **T-3.1 Plan API** (Huy - P0): CRUD plan, validate giá, duration, totalSessions, unit tests.
- [ ] **T-3.2 Membership API** (Huy - P0): Mua gói, gia hạn, tính endDate, sessionsLeft, trạng thái hết hạn.
- [x] **T-3.3 Plan UI** (An - P0): Trang danh sách gói, form tạo/sửa gói, toggle active, thống kê biểu phí.
- [ ] **T-3.4 Membership UI** (An - P0): Mua gói, gia hạn, lịch sử gói, trạng thái gói, số buổi còn lại.
- [x] **T-3.5 Member portal** (An - P1): Dashboard hội viên: gói hiện tại, số buổi, lịch lớp, QR, Profile Sidebar.
- [ ] **T-3.6 Cron hết hạn** (Huy - P1): Job đánh dấu membership EXPIRED, tạo notification.

---

### Sprint 4 — Ngày 22–28: Lớp học và Booking
- [ ] **T-4.1 Class API** (Huy - P0): CRUD GymClass, tạo recurring ClassSession, CRUD session.
- [ ] **T-4.2 Booking API** (Huy - P0): Đặt lớp, hủy lớp, validate capacity, waitlist, unique member-session.
- [ ] **T-4.3 Calendar UI** (An - P0): Lịch tuần, filter ngày/trainer/loại lớp, hiển thị slot còn trống.
- [ ] **T-4.4 Booking UI** (An - P0): Trang đặt lớp, modal xác nhận, hủy lớp, waitlist, trạng thái booking.
- [ ] **T-4.5 Trainer UI** (An - P1): Trainer xem lớp được phân công, danh sách hội viên, điểm danh.
- [ ] **T-4.6 Email booking** (Huy - P1): Email xác nhận đặt/hủy lớp, email nhắc lớp trước 2 giờ.

---

### Sprint 5 — Ngày 29–35: Check-in và Thanh toán
- [ ] **T-5.1 Check-in API** (Huy - P0): QR token, validate QR, tạo check-in, chống check-in trùng ngày, trừ buổi.
- [ ] **T-5.2 QR UI** (An - P0): Trang QR hội viên, camera scanner staff, kết quả thành công/lỗi, check-in thủ công.
- [ ] **T-5.3 Payment API** (Huy - P0): Tạo payment, confirm payment, liên kết membership, lọc/export CSV.
- [ ] **T-5.4 Payment UI** (An - P0): Bảng payment, form thu tiền, xác nhận thanh toán, filter, export.
- [ ] **T-5.5 Staff today page** (An - P1): Lớp hôm nay, hội viên cần check-in, payment chờ xác nhận.
- [ ] **T-5.6 Integration test** (Cả hai - P0): Test flow tạo member → mua gói → đặt lớp → check-in → trừ buổi.

---

### Sprint 6 — Ngày 36–45: Báo cáo, Notification, Pilot
- [ ] **T-6.1 Report API** (Huy - P1): Overview, revenue, attendance, top classes, at-risk members.
- [ ] **T-6.2 Dashboard UI** (An - P1): KPI cards, chart doanh thu, chart check-in, bảng hội viên rủi ro.
- [ ] **T-6.3 Notification API** (Huy - P1): Tạo notification, cron 08:00, gửi email, chống trùng.
- [ ] **T-6.4 Notification UI** (An - P1): Bell icon, danh sách thông báo, unread badge, mark as read.
- [ ] **T-6.5 Landing page** (An - P2): Trang giới thiệu, gói tập, liên hệ, CTA đăng ký.
- [ ] **T-6.6 QA và pilot** (Cả hai - P0): Sửa bug, seed gym thật, hướng dẫn sử dụng, demo bán hàng.

---

## 4. Ma trận trách nhiệm (RACI)

| Công việc | Huy | An |
|---|---|---|
| Thiết kế database | **Owner** | Consulted |
| Thiết kế API contract | **Owner** | Reviewer |
| Triển khai API | **Owner** | Consumer |
| Mock API cho frontend | Support | **Owner** |
| UI/UX | Consulted | **Owner** |
| Business logic | **Owner** | Consulted |
| Bảo mật, phân quyền | **Owner** | Support |
| Responsive/accessibility | Consulted | **Owner** |
| Integration test | **Co-owner** | **Co-owner** |
| Deploy backend | **Owner** | Support |
| Deploy frontend | Support | **Owner** |
| Seed dữ liệu | **Owner** | Support |
| Demo khách hàng | Support | **Owner** |

---

## 5. Quy tắc Antigravity dành riêng cho Huy (Backend)

Bạn là **Backend Engineer Lead** cho dự án GymPilot.

### Phạm vi:
- Chỉ làm việc trong `apps/api`, `prisma`, `migrations`, `seed`, `docs/api`, `packages/shared/src/types`, `packages/shared/src/validators`.
- **KHÔNG** sửa `apps/web`.
- Không tự thay đổi API contract đã được duyệt; nếu cần đổi, tạo task "API Contract Change" và chờ An review.

### Luôn tuân theo:
1. TypeScript strict mode, không dùng `any`.
2. Controller không chứa business logic (chỉ nhận req và trả res).
3. Validate mọi input bằng Zod.
4. Response chuẩn: `{ success: boolean, message?: string, data?: any, code?: string }`.
5. Prisma query tránh N+1 (dùng `include`/`select`).
6. Không trả `passwordHash` trong API response.
7. Mỗi service phải có unit test.
8. Trước khi xong task: `npm run lint && npm run typecheck && npm run test`.
9. Khi hoàn thành task xuất:
   - Danh sách endpoint
   - Ví dụ request/response
   - Migration đã tạo (nếu có)
   - Kết quả test
   - Những điểm An cần biết để tích hợp UI.
