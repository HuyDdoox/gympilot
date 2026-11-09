# Ghi Chú Kiến Trúc & Bảo Mật Database (Supabase + Prisma) — GymPilot

> **Mục đích tài liệu**: Tổng hợp hiện trạng kết nối database, các lưu ý về bảo mật (RLS) và cấu hình môi trường để trao đổi, thống nhất định hướng phát triển trong nhóm.

---

## 1. Thông Tin Hạ Tầng Database (Supabase Cloud)

- **Tên dự án**: `gympilot`
- **Project Ref**: `tmirvpyurmuvburjgjzn`
- **Khu vực (Region)**: `ap-southeast-1` (Singapore - tối ưu tốc độ cho người dùng Việt Nam)
- **Phiên bản PostgreSQL**: `17.11`
- **Trạng thái**: `ACTIVE_HEALTHY`
- **12 Bảng dữ liệu đã đồng bộ thành công qua Prisma**:
  1. `Gym`: Thông tin phòng gym, cấu hình giờ mở/đóng cửa.
  2. `User`: Tài khoản đăng nhập hệ thống (`OWNER`, `STAFF`, `TRAINER`, `MEMBER`).
  3. `Member`: Hồ sơ chi tiết hội viên (liên kết 1-1 với `User`).
  4. `Trainer`: Hồ sơ huấn luyện viên (liên kết 1-1 với `User`).
  5. `Plan`: Danh mục các gói tập (tháng, quý, số buổi, vé lẻ).
  6. `Membership`: Thẻ tập hội viên sở hữu (ngày hết hạn, số buổi còn lại).
  7. `GymClass`: Loại lớp học (sức chứa, thời lượng).
  8. `ClassSession`: Lịch buổi học cụ thể, phân công HLV phụ trách.
  9. `Booking`: Lịch sử đặt chỗ và danh sách chờ (Waitlist).
  10. `CheckIn`: Lịch sử điểm danh (quét QR / thủ công bởi staff).
  11. `Payment`: Ghi nhận giao dịch thanh toán (tiền mặt, chuyển khoản, Momo, VNPay).
  12. `Notification`: Thông báo in-app và nhắc lịch/hết hạn.

---

## 2. Điểm Quan Trọng Cần Bàn Bạc: Row Level Security (RLS)

### 📌 Hiện trạng
Supabase đưa ra cảnh báo: **12 bảng đang TẮT Row Level Security (RLS)**.

### ❓ Tại sao có cảnh báo này?
Supabase cung cấp tính năng gọi trực tiếp database từ client (Frontend web/mobile) thông qua thư viện `supabase-js` và khóa công khai `anon_key`. Nếu dùng cách này mà không bật RLS, bất kỳ ai có `anon_key` đều có thể đọc/ghi toàn bộ dữ liệu.

### 💡 Đánh giá theo Kiến trúc của GymPilot
Hiện tại GymPilot đang phát triển theo mô hình **BFF / Backend trung gian (Node.js + Express + Prisma)**:
- **Frontend** KHÔNG kết nối trực tiếp vào Supabase database. Mọi yêu cầu đều phải đi qua Express API (`/api/...`).
- **Express Backend** kết nối vào Supabase bằng quyền quản trị server thông qua Prisma ORM.
- **Xác thực & phân quyền (RBAC)** được xử lý chặt chẽ ở tầng middleware (`auth.middleware.ts`, `role.middleware.ts`) và schema validation (`Zod`).
👉 Do đó, hệ thống hiện tại **hoàn toàn an toàn trong phạm vi API Backend**.

### 🤝 2 Phương án cần thống nhất với bạn cùng làm:
1. **Phương án 1 (Khuyên dùng - Chuẩn kiến trúc API hiện tại)**:
   - Giữ nguyên toàn bộ logic truy vấn đi qua Express Backend.
   - Không public `anon_key` của Supabase ra ngoài Frontend.
   - Không cần bật RLS phức tạp trên Supabase vì Prisma backend đã quản lý toàn bộ phân quyền.
2. **Phương án 2 (Nếu muốn dùng tính năng Realtime của Supabase)**:
   - Nếu muốn Frontend lắng nghe sự kiện tức thì (ví dụ: hội viên quét QR thì màn hình lễ tân tự nảy thông báo realtime):
   - Ta sẽ bật RLS trên các bảng cần thiết và viết policy phân quyền bằng SQL.
   - Đoạn SQL bật RLS mẫu:
     ```sql
     ALTER TABLE "public"."Gym" ENABLE ROW LEVEL SECURITY;
     ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
     -- (Cần thêm chính sách CREATE POLICY tương ứng nếu bật)
     ```

---

## 3. Lưu Ý Về Biến Môi Trường (.env)

Khi cấu hình connection string trên máy cá nhân của các thành viên khác:
1. **Ký tự đặc biệt trong mật khẩu**: Mật khẩu database có ký tự `@` bắt buộc phải được mã hóa URL thành `%40`.
2. **2 chuỗi kết nối chuẩn Supabase**:
   - `DATABASE_URL`: Kết nối qua Transaction Pooler (Port `6543`, có `?pgbouncer=true`), dùng cho API chạy hàng ngày.
   - `DIRECT_URL`: Kết nối trực tiếp (Port `5432`), dùng khi chạy lệnh `prisma migrate` hoặc `prisma db push`.

---

## 4. Các Bước Kế Tiếp (Next Steps)

1. [ ] **Thảo luận & chốt phương án RLS** (theo Mục 2).
2. [ ] **Seed dữ liệu mẫu (Seed script)**: Chạy script tạo sẵn 1 Owner, 1 Phòng gym, vài Gói tập mẫu và 1 HLV để test toàn bộ luồng.
3. [ ] **Triển khai Module Auth**: Hoàn thiện API Đăng nhập, Đăng ký, sinh JWT Token cho 4 Role (`OWNER`, `STAFF`, `TRAINER`, `MEMBER`).
