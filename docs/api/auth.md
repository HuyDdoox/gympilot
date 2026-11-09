# API Contract — Authentication & Authorization (`auth`)

> **Phiên bản**: 1.0.0  
> **Người sở hữu**: Huy (Backend) & An (Frontend)  
> **Quy ước chung**:
> - Mọi response thành công: `{ success: true, data: ... }`
> - Mọi response thất bại: `{ success: false, message: string, code: string, details?: any }`
> - Token Bearer JWT truyền trong header: `Authorization: Bearer <accessToken>`
> - Tuyệt đối không bao giờ trả về trường `passwordHash`.

---

## 1. `POST /api/auth/register`
Đăng ký tài khoản Owner và tạo phòng gym ban đầu (Onboarding).

- **Quyền truy cập (Role)**: `Public`
- **Headers**: `Content-Type: application/json`

### Request Body
```json
{
  "fullName": "Nguyễn Văn Chủ Gym",
  "email": "owner@gympilot.vn",
  "password": "Password123@",
  "phone": "0901234567",
  "gymName": "GymPilot Flagship Studio",
  "gymAddress": "123 Đường 3/2, Quận 10, TP.HCM"
}
```
- `fullName`: `string`, bắt buộc, tối thiểu 2 ký tự.
- `email`: `string`, bắt buộc, định dạng email hợp lệ, duy nhất trong hệ thống.
- `password`: `string`, bắt buộc, tối thiểu 8 ký tự.
- `phone`: `string`, tùy chọn.
- `gymName`: `string`, bắt buộc, tên phòng gym, tối thiểu 2 ký tự.
- `gymAddress`: `string`, tùy chọn, địa chỉ phòng gym.

### Response 201 Created
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid_user_123",
      "gymId": "cuid_gym_456",
      "email": "owner@gympilot.vn",
      "fullName": "Nguyễn Văn Chủ Gym",
      "phone": "0901234567",
      "role": "OWNER",
      "isActive": true,
      "createdAt": "2026-11-10T08:00:00.000Z",
      "updatedAt": "2026-11-10T08:00:00.000Z"
    },
    "gym": {
      "id": "cuid_gym_456",
      "name": "GymPilot Flagship Studio",
      "address": "123 Đường 3/2, Quận 10, TP.HCM",
      "phone": null,
      "logoUrl": null,
      "openTime": null,
      "closeTime": null,
      "createdAt": "2026-11-10T08:00:00.000Z",
      "updatedAt": "2026-11-10T08:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
}
```

### Errors
- `400 BAD_REQUEST`: Dữ liệu không hợp lệ (sai định dạng email, mật khẩu ngắn,...).
  ```json
  {
    "success": false,
    "message": "Dữ liệu không hợp lệ",
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "password", "message": "Mật khẩu phải có ít nhất 8 ký tự" }
    ]
  }
  ```
- `409 CONFLICT`: Email đã được đăng ký.
  ```json
  {
    "success": false,
    "message": "Email này đã được sử dụng",
    "code": "EMAIL_ALREADY_EXISTS"
  }
  ```

---

## 2. `POST /api/auth/login`
Đăng nhập hệ thống cho tất cả các role (`OWNER`, `STAFF`, `TRAINER`, `MEMBER`).

- **Quyền truy cập (Role)**: `Public`
- **Headers**: `Content-Type: application/json`

### Request Body
```json
{
  "email": "owner@gympilot.vn",
  "password": "Password123@"
}
```

### Response 200 OK
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid_user_123",
      "gymId": "cuid_gym_456",
      "email": "owner@gympilot.vn",
      "fullName": "Nguyễn Văn Chủ Gym",
      "phone": "0901234567",
      "role": "OWNER",
      "isActive": true,
      "createdAt": "2026-11-10T08:00:00.000Z",
      "updatedAt": "2026-11-10T08:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
}
```

### Errors
- `400 BAD_REQUEST`: Thiếu email hoặc password.
- `401 UNAUTHORIZED`: Sai email hoặc mật khẩu.
  ```json
  {
    "success": false,
    "message": "Email hoặc mật khẩu không chính xác",
    "code": "INVALID_CREDENTIALS"
  }
  ```
- `403 FORBIDDEN`: Tài khoản bị khóa (`isActive: false`).
  ```json
  {
    "success": false,
    "message": "Tài khoản của bạn đã bị vô hiệu hóa",
    "code": "ACCOUNT_DISABLED"
  }
  ```

---

## 3. `POST /api/auth/refresh`
Cấp `accessToken` mới bằng `refreshToken` khi `accessToken` cũ hết hạn (15 phút).

- **Quyền truy cập (Role)**: `Public`
- **Headers**: `Content-Type: application/json`

### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

### Response 200 OK
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

### Errors
- `401 UNAUTHORIZED`: Refresh token không hợp lệ hoặc đã hết hạn (7 ngày).
  ```json
  {
    "success": false,
    "message": "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
    "code": "INVALID_REFRESH_TOKEN"
  }
  ```

---

## 4. `POST /api/auth/logout`
Đăng xuất tài khoản. Phía client xóa token khỏi storage/cookie.

- **Quyền truy cập (Role)**: All (`OWNER`, `STAFF`, `TRAINER`, `MEMBER`)
- **Headers**: `Authorization: Bearer <accessToken>`

### Response 200 OK
```json
{
  "success": true,
  "data": {
    "message": "Đăng xuất thành công"
  }
}
```

---

## 5. `GET /api/me`
Lấy thông tin tài khoản hiện tại, phòng gym sở hữu/tham gia và profile chi tiết (nếu là member hoặc trainer).

- **Quyền truy cập (Role)**: All (`OWNER`, `STAFF`, `TRAINER`, `MEMBER`)
- **Headers**: `Authorization: Bearer <accessToken>`

### Response 200 OK
```json
{
  "success": true,
  "data": {
    "id": "cuid_user_123",
    "gymId": "cuid_gym_456",
    "email": "member@gmail.com",
    "fullName": "Trần Thị Hội Viên",
    "phone": "0987654321",
    "role": "MEMBER",
    "isActive": true,
    "createdAt": "2026-11-10T08:00:00.000Z",
    "updatedAt": "2026-11-10T08:00:00.000Z",
    "gym": {
      "id": "cuid_gym_456",
      "name": "GymPilot Flagship Studio",
      "address": "123 Đường 3/2, Quận 10, TP.HCM",
      "logoUrl": null
    },
    "memberProfile": {
      "id": "cuid_member_789",
      "qrToken": "qr_secret_token_123",
      "status": "ACTIVE"
    }
  }
}
```

### Errors
- `401 UNAUTHORIZED`: Token không hợp lệ hoặc thiếu header.
  ```json
  {
    "success": false,
    "message": "Vui lòng đăng nhập để tiếp tục",
    "code": "UNAUTHORIZED"
  }
  ```

---

## 💡 Hướng dẫn tích hợp cho An (Frontend)
1. **Lưu trữ Token**: Lưu `accessToken` vào Memory/AuthStore (Zustand) và `refreshToken` vào `localStorage` (hoặc HttpOnly cookie).
2. **Auto Refresh**: Trong `apps/web/src/lib/axios.ts`, bắt response interceptor mã `401`. Nếu gặp `401`, tự động gọi `POST /api/auth/refresh` bằng refreshToken để lấy accessToken mới rồi retry request vừa lỗi. Nếu refresh thất bại, chuyển hướng về `/login`.
3. **Phân quyền Route**: Đọc `user.role` từ `data.user.role` để bảo vệ các tuyến đường (`ProtectedRoute`, `RoleGuard`).
