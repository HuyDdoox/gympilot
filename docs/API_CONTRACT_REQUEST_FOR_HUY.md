# YÊU CẦU THỐNG NHẤT API CONTRACT (GỬI HUY - BACKEND LEAD)
**Người lập:** An – Frontend Lead / Frontend Developer  
**Sprint:** Sprint 1 (Ngày 1–7) & Chuẩn bị Sprint 2  
**Mục tiêu:** Thống nhất chi tiết Request Body, Response Schema, Error Format và Query Params để Frontend ghép nối API và đồng bộ Zod validation schemas.

---

## 1. Module Xác thực (Authentication) & Refresh Token

### 1.1. Refresh Token
- **Endpoint:** `POST /api/auth/refresh`
- **Mục đích:** Cấp lại Access Token khi Access Token (15 phút) hết hạn mà không bắt người dùng đăng nhập lại.
- **Request Body đề xuất:**
  ```json
  {
    "refreshToken": "string (bắt buộc)"
  }
  ```
- **Response Thành công (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "string",
      "refreshToken": "string (nếu áp dụng cơ chế rotation)"
    }
  }
  ```
- **Response Thất bại (401 Unauthorized):**
  ```json
  {
    "success": false,
    "code": "UNAUTHORIZED",
    "message": "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại"
  }
  ```

---

## 2. Module Hội viên (Members)

### 2.1. Lấy danh sách hội viên (Pagination & Search)
- **Endpoint:** `GET /api/members`
- **Role được phép:** `OWNER`, `STAFF`
- **Query Parameters đề xuất:**
  - `page`: số trang (mặc định 1)
  - `limit`: số bản ghi/trang (mặc định 10 hoặc 20)
  - `search`: tìm kiếm theo họ tên hoặc số điện thoại
  - `status`: lọc theo `MemberStatus` (`ACTIVE`, `PAUSED`, `EXPIRED`, `CANCELLED`)
- **Response Thành công (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "items": "MemberDto[]",
      "total": 120,
      "page": 1,
      "limit": 10,
      "totalPages": 12
    }
  }
  ```

### 2.2. Thêm mới hội viên (Create Member)
- **Endpoint:** `POST /api/members`
- **Role được phép:** `OWNER`, `STAFF`
- **Request Body đề xuất:**
  ```json
  {
    "fullName": "string (min 2)",
    "phone": "string (10 chữ số)",
    "email": "string (email hợp lệ)",
    "dateOfBirth": "string (ISO Date - tùy chọn)",
    "gender": "MALE | FEMALE | OTHER (tùy chọn)",
    "notes": "string (tùy chọn)",
    "planId": "string (tùy chọn nếu mua gói ngay)",
    "startDate": "string (tùy chọn)"
  }
  ```

---

## 3. Module Lớp học & Buổi tập (Classes & Sessions)

### 3.1. Danh sách buổi học theo ngày/tuần
- **Endpoint:** `GET /api/sessions`
- **Query Parameters đề xuất:**
  - `startDate`: string (YYYY-MM-DD)
  - `endDate`: string (YYYY-MM-DD)
  - `classId`: string (tùy chọn)
  - `trainerId`: string (tùy chọn)
- **Response:** Mảng các buổi học kèm số slot còn trống (`availableSlots`) để hội viên đặt chỗ.

---

## 4. Đồng bộ Zod Schemas trong `packages/shared`

Hiện tại trong `packages/shared/src/validators/index.ts` chỉ mới có `RegisterOwnerSchema`, `LoginSchema`, `RefreshTokenSchema`.
Đề xuất phối hợp cùng Huy bổ sung:
1. `CreateMemberSchema`
2. `CreatePlanSchema`
3. `CreateBookingSchema`
4. `CreatePaymentSchema`

Nhờ Huy xem xét và phản hồi để hai bên thống nhất trước khi triển khai Sprint 2.
