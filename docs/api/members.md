# API Contract — Quản Lý Hội Viên (`members`)

> **Phiên bản**: 1.0.0  
> **Người sở hữu**: Huy (Backend) & An (Frontend)  
> **Quy ước chung**:
> - Mọi API yêu cầu Bearer Token: `Authorization: Bearer <accessToken>`
> - Chỉ cho phép role: `OWNER`, `STAFF` (Hội viên không có quyền quản lý danh sách này).
> - Chuẩn format ngày tháng: ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`)

---

## 1. `GET /api/members`
Lấy danh sách hội viên kèm phân trang, tìm kiếm theo từ khóa và lọc theo trạng thái.

- **Quyền truy cập (Role)**: `OWNER`, `STAFF`
- **Query Parameters**:
  - `page`: `number` (tùy chọn, mặc định `1`)
  - `limit`: `number` (tùy chọn, mặc định `10`, tối đa `100`)
  - `search`: `string` (tùy chọn, tìm theo tên, email, số điện thoại)
  - `status`: `string` (tùy chọn, giá trị: `ACTIVE`, `PAUSED`, `EXPIRED`, `CANCELLED`)

### Response 200 OK
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "cuid_member_01",
        "userId": "cuid_user_01",
        "fullName": "Lê Hoài An",
        "email": "an.le@example.com",
        "phone": "0912345678",
        "gender": "FEMALE",
        "dateOfBirth": "1998-05-15T00:00:00.000Z",
        "status": "ACTIVE",
        "qrToken": "qr_token_abc_123",
        "joinedAt": "2026-10-01T08:00:00.000Z",
        "activeMembership": {
          "id": "cuid_membership_01",
          "planName": "Gói 1 Tháng Full Lớp",
          "planType": "MONTHLY",
          "endDate": "2026-11-30T23:59:59.000Z",
          "sessionsLeft": null,
          "status": "ACTIVE"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 45,
      "totalPages": 5
    }
  }
}
```

---

## 2. `POST /api/members`
Thêm mới một hội viên. Hệ thống tự động:
1. Tạo `User` với role `MEMBER` và mật khẩu ngẫu nhiên ban đầu.
2. Tạo hồ sơ `Member`.
3. Gán gói tập ban đầu `Membership` (nếu có chọn gói).
4. Ghi nhận giao dịch `Payment` (nếu có thanh toán).

- **Quyền truy cập (Role)**: `OWNER`, `STAFF`
- **Headers**: `Content-Type: application/json`

### Request Body
```json
{
  "fullName": "Hoàng Minh Trí",
  "email": "tri.hoang@example.com",
  "phone": "0988776655",
  "gender": "MALE",
  "dateOfBirth": "1995-12-20",
  "notes": "Hội viên có tiền sử đau cổ tay",
  "planId": "cuid_plan_gym_01",
  "startDate": "2026-11-10T00:00:00.000Z",
  "payment": {
    "amount": 1200000,
    "method": "BANK_TRANSFER",
    "status": "PAID",
    "note": "Chuyển khoản Vietcombank"
  }
}
```
- `fullName`: `string`, bắt buộc, >= 2 ký tự.
- `email`: `string`, bắt buộc, định dạng email chuẩn.
- `phone`: `string`, tùy chọn.
- `gender`: `string`, tùy chọn (`MALE`, `FEMALE`, `OTHER`).
- `dateOfBirth`: `string` (YYYY-MM-DD), tùy chọn.
- `notes`: `string`, tùy chọn.
- `planId`: `string`, tùy chọn (nếu hội viên mua gói ngay khi đăng ký).
- `startDate`: `string` ISO date, bắt buộc nếu có `planId`.
- `payment`: `object`, tùy chọn (chỉ gửi khi có `planId`):
  - `amount`: `number`, số tiền (VND).
  - `method`: `BANK_TRANSFER` | `CASH` | `MOMO` | `VNPAY`.
  - `status`: `PENDING` | `PAID`.
  - `note`: `string`, tùy chọn.

### Response 201 Created
```json
{
  "success": true,
  "data": {
    "member": {
      "id": "cuid_member_99",
      "userId": "cuid_user_99",
      "fullName": "Hoàng Minh Trí",
      "email": "tri.hoang@example.com",
      "phone": "0988776655",
      "status": "ACTIVE",
      "qrToken": "qr_cuid_token_99",
      "joinedAt": "2026-11-10T08:30:00.000Z"
    },
    "membership": {
      "id": "cuid_membership_99",
      "planId": "cuid_plan_gym_01",
      "startDate": "2026-11-10T00:00:00.000Z",
      "endDate": "2026-12-10T23:59:59.000Z",
      "sessionsLeft": null,
      "status": "ACTIVE"
    },
    "payment": {
      "id": "cuid_payment_99",
      "amount": 1200000,
      "method": "BANK_TRANSFER",
      "status": "PAID"
    }
  }
}
```

### Errors
- `400 BAD_REQUEST`: Sai định dạng thông tin hoặc thiếu trường bắt buộc.
- `409 CONFLICT`: `EMAIL_ALREADY_EXISTS` — Email hội viên đã tồn tại trong hệ thống.
  ```json
  {
    "success": false,
    "message": "Email này đã được đăng ký cho hội viên khác",
    "code": "EMAIL_ALREADY_EXISTS"
  }
  ```

---

## 3. `GET /api/members/:id`
Lấy toàn bộ hồ sơ chi tiết của một hội viên, bao gồm danh sách gói tập (active và lịch sử), lịch sử check-in gần nhất, và các buổi học đã đặt chỗ.

- **Quyền truy cập (Role)**: `OWNER`, `STAFF`

### Response 200 OK
```json
{
  "success": true,
  "data": {
    "id": "cuid_member_01",
    "userId": "cuid_user_01",
    "fullName": "Lê Hoài An",
    "email": "an.le@example.com",
    "phone": "0912345678",
    "gender": "FEMALE",
    "dateOfBirth": "1998-05-15T00:00:00.000Z",
    "notes": "Hội viên thích tập Yoga buổi sáng",
    "status": "ACTIVE",
    "qrToken": "qr_token_abc_123",
    "joinedAt": "2026-10-01T08:00:00.000Z",
    "memberships": [
      {
        "id": "cuid_membership_01",
        "planName": "Gói 10 Buổi Yoga",
        "planType": "SESSION_PACK",
        "startDate": "2026-10-01T00:00:00.000Z",
        "endDate": null,
        "sessionsLeft": 7,
        "status": "ACTIVE",
        "payments": [
          {
            "id": "cuid_pay_1",
            "amount": 800000,
            "method": "MOMO",
            "status": "PAID",
            "paidAt": "2026-10-01T08:15:00.000Z"
          }
        ]
      }
    ],
    "recentCheckIns": [
      {
        "id": "cuid_checkin_1",
        "method": "QR",
        "createdAt": "2026-11-08T09:00:00.000Z"
      }
    ]
  }
}
```

### Errors
- `404 NOT_FOUND`: Không tìm thấy hội viên.
  ```json
  {
    "success": false,
    "message": "Không tìm thấy thông tin hội viên",
    "code": "MEMBER_NOT_FOUND"
  }
  ```

---

## 4. `PATCH /api/members/:id`
Cập nhật thông tin hồ sơ của hội viên.

- **Quyền truy cập (Role)**: `OWNER`, `STAFF`
- **Headers**: `Content-Type: application/json`

### Request Body
```json
{
  "fullName": "Lê Hoài An (Updated)",
  "phone": "0912345999",
  "notes": "Cập nhật ghi chú mới",
  "status": "PAUSED"
}
```
*(Các trường đều là tùy chọn, chỉ gửi các trường cần cập nhật).*

### Response 200 OK
```json
{
  "success": true,
  "data": {
    "id": "cuid_member_01",
    "fullName": "Lê Hoài An (Updated)",
    "phone": "0912345999",
    "status": "PAUSED",
    "updatedAt": "2026-11-10T09:00:00.000Z"
  }
}
```

---

## 5. `POST /api/members/import`
Nhập danh sách hội viên hàng loạt từ file CSV/Excel. Backend duyệt từng dòng, tạo bản ghi cho các dòng hợp lệ và thu thập danh sách các dòng bị lỗi.

- **Quyền truy cập (Role)**: `OWNER`, `STAFF`
- **Headers**: `Content-Type: application/json` (Gửi JSON parsed từ CSV) hoặc `multipart/form-data`

### Request Body (JSON format)
```json
{
  "members": [
    {
      "fullName": "Nguyễn Văn A",
      "email": "a.nguyen@example.com",
      "phone": "0901111111",
      "gender": "MALE",
      "dateOfBirth": "1990-01-01"
    },
    {
      "fullName": "Trần Thị B",
      "email": "invalid-email",
      "phone": "0902222222"
    }
  ]
}
```

### Response 200 OK
```json
{
  "success": true,
  "data": {
    "total": 2,
    "importedCount": 1,
    "failedCount": 1,
    "errors": [
      {
        "row": 2,
        "email": "invalid-email",
        "reason": "Email không đúng định dạng"
      }
    ]
  }
}
```

---

## 💡 Hướng dẫn tích hợp cho An (Frontend)
1. **Bảng Danh Sách Hội Viên**:
   - Sử dụng các cột: Họ tên, Email, Số điện thoại, Gói hiện tại (`activeMembership.planName`), Ngày hết hạn / Số buổi còn lại, Trạng thái (`ACTIVE`, `EXPIRED`,...).
   - Đặt Debounce (300ms) cho thanh tìm kiếm `search` trước khi bắn request `GET /api/members`.
2. **Import CSV**:
   - Tải file template mẫu `.csv` cho người dùng điền theo header: `fullName,email,phone,gender,dateOfBirth`.
   - Đọc và validate sơ bộ ở client trước khi gửi lên API `POST /api/members/import`. Hiển thị modal tóm tắt kết quả (Số dòng thành công, bảng các dòng lỗi).
