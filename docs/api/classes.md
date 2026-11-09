# API Contract — Lớp Học & Đặt Lịch (`classes` & `bookings`)

> **Phiên bản**: 1.0.0  
> **Người sở hữu**: Huy (Backend) & An (Frontend)  
> **Quy ước chung**:
> - Mọi API yêu cầu Bearer Token: `Authorization: Bearer <accessToken>`
> - Chuẩn format ngày tháng: ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`)

---

## 1. `GET /api/classes`
Lấy danh sách các môn/loại lớp học của phòng gym (ví dụ: Yoga Vinyasa, Pilates Reformer, Boxing, HIIT).

- **Quyền truy cập (Role)**: All (`OWNER`, `STAFF`, `TRAINER`, `MEMBER`)

### Response 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid_class_01",
      "name": "Yoga Vinyasa Sáng",
      "description": "Lớp học tăng cường sự dẻo dai và hơi thở buổi sáng",
      "capacity": 15,
      "durationMin": 60,
      "requiresSession": true,
      "isActive": true
    },
    {
      "id": "cuid_class_02",
      "name": "Pilates Core & Reformer",
      "description": "Luyện tập cơ lõi và săn chắc cơ thể",
      "capacity": 10,
      "durationMin": 50,
      "requiresSession": true,
      "isActive": true
    }
  ]
}
```

---

## 2. `POST /api/classes`
Tạo loại lớp học mới.

- **Quyền truy cập (Role)**: `OWNER`
- **Headers**: `Content-Type: application/json`

### Request Body
```json
{
  "name": "Zumba Fitness Dance",
  "description": "Đốt cháy calo cùng vũ điệu sôi động",
  "capacity": 20,
  "durationMin": 60,
  "requiresSession": false
}
```
- `name`: `string`, bắt buộc, tối thiểu 2 ký tự.
- `description`: `string`, tùy chọn.
- `capacity`: `number`, sức chứa mặc định của lớp (tối thiểu 1 người).
- `durationMin`: `number`, thời lượng phút (mặc định 60).
- `requiresSession`: `boolean`, nếu `true` thì khi đặt/check-in sẽ trừ số buổi của gói tập.

### Response 201 Created
```json
{
  "success": true,
  "data": {
    "id": "cuid_class_03",
    "name": "Zumba Fitness Dance",
    "description": "Đốt cháy calo cùng vũ điệu sôi động",
    "capacity": 20,
    "durationMin": 60,
    "requiresSession": false,
    "isActive": true,
    "createdAt": "2026-11-10T09:00:00.000Z"
  }
}
```

---

## 3. `GET /api/sessions`
Lấy danh sách các buổi học cụ thể theo lịch (dùng để vẽ lịch tuần / Calendar trên UI).

- **Quyền truy cập (Role)**: All (`OWNER`, `STAFF`, `TRAINER`, `MEMBER`)
- **Query Parameters**:
  - `startDate`: `string` ISO date (Bắt buộc, ví dụ: `2026-11-10T00:00:00.000Z`)
  - `endDate`: `string` ISO date (Bắt buộc, ví dụ: `2026-11-16T23:59:59.000Z`)
  - `classId`: `string` (Tùy chọn, lọc theo môn học)
  - `trainerId`: `string` (Tùy chọn, lọc theo huấn luyện viên)

### Response 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid_session_101",
      "classId": "cuid_class_01",
      "className": "Yoga Vinyasa Sáng",
      "trainer": {
        "id": "cuid_trainer_01",
        "fullName": "Coach Sarah",
        "specialty": "Hatha & Vinyasa Yoga"
      },
      "startsAt": "2026-11-12T06:00:00.000Z",
      "endsAt": "2026-11-12T07:00:00.000Z",
      "capacity": 15,
      "bookedCount": 12,
      "availableSlots": 3,
      "isWaitlist": false,
      "userBookingStatus": null
    }
  ]
}
```
*(Nếu người gọi là `MEMBER`, trường `userBookingStatus` sẽ trả về `BOOKED`, `WAITLISTED` hoặc `null` nếu chưa đặt).*

---

## 4. `POST /api/sessions`
Tạo lịch buổi học cụ thể.

- **Quyền truy cập (Role)**: `OWNER`, `STAFF`
- **Headers**: `Content-Type: application/json`

### Request Body
```json
{
  "classId": "cuid_class_01",
  "trainerId": "cuid_trainer_01",
  "startsAt": "2026-11-15T06:00:00.000Z",
  "endsAt": "2026-11-15T07:00:00.000Z",
  "capacity": 15
}
```

### Response 201 Created
```json
{
  "success": true,
  "data": {
    "id": "cuid_session_102",
    "classId": "cuid_class_01",
    "trainerId": "cuid_trainer_01",
    "startsAt": "2026-11-15T06:00:00.000Z",
    "endsAt": "2026-11-15T07:00:00.000Z",
    "capacity": 15,
    "bookedCount": 0
  }
}
```

---

## 5. `POST /api/bookings`
Hội viên đặt chỗ tham gia lớp học.

- **Quyền truy cập (Role)**: `MEMBER`
- **Headers**: `Content-Type: application/json`

### Request Body
```json
{
  "sessionId": "cuid_session_101"
}
```

### Business Logic Backend (Huy):
1. Kiểm tra hội viên có gói tập `Membership` hợp lệ (`status: ACTIVE` và chưa hết hạn).
2. Nếu lớp yêu cầu gói buổi (`requiresSession: true`), kiểm tra `sessionsLeft > 0`.
3. Kiểm tra xem hội viên đã đặt ca học này chưa (Không cho phép đặt trùng ca).
4. Nếu số lượng `bookedCount < capacity`:
   - Tạo booking với `status: BOOKED`.
   - Tăng `bookedCount` của session lên 1.
5. Nếu lớp đã hết chỗ (`bookedCount >= capacity`):
   - Tạo booking với `status: WAITLISTED` (đưa vào danh sách chờ).

### Response 201 Created (Đặt thành công chỗ chính thức)
```json
{
  "success": true,
  "data": {
    "id": "cuid_booking_501",
    "sessionId": "cuid_session_101",
    "status": "BOOKED",
    "message": "Đặt chỗ thành công! Chúc bạn có buổi tập vui vẻ."
  }
}
```

### Response 201 Created (Chuyển sang danh sách chờ)
```json
{
  "success": true,
  "data": {
    "id": "cuid_booking_502",
    "sessionId": "cuid_session_101",
    "status": "WAITLISTED",
    "message": "Lớp đã đủ số lượng, bạn đã được xếp vào danh sách chờ số 1."
  }
}
```

### Errors
- `400 BAD_REQUEST`: Gói tập không đủ điều kiện (hết hạn hoặc hết số buổi).
  ```json
  {
    "success": false,
    "message": "Gói tập của bạn đã hết số buổi, vui lòng gia hạn để tiếp tục đặt lớp",
    "code": "INSUFFICIENT_SESSIONS"
  }
  ```
- `409 CONFLICT`: Đã đặt ca học này rồi.
  ```json
  {
    "success": false,
    "message": "Bạn đã đăng ký buổi học này rồi",
    "code": "ALREADY_BOOKED"
  }
  ```

---

## 6. `PATCH /api/bookings/:id/cancel`
Hủy đặt chỗ lớp học.

- **Quyền truy cập (Role)**: `MEMBER` (chỉ hủy booking của chính mình), `STAFF`, `OWNER`

### Business Logic Backend (Huy):
1. Chuyển trạng thái booking hiện tại sang `CANCELLED`.
2. Nếu booking bị hủy có trạng thái cũ là `BOOKED`:
   - Giảm `bookedCount` của session đi 1.
   - **Tự động đôn**: Tìm hội viên đầu tiên có trạng thái `WAITLISTED` (theo thứ tự `createdAt` sớm nhất) và nâng lên thành `BOOKED`!
   - Gửi notification/email cho hội viên vừa được đôn lên từ waitlist.

### Response 200 OK
```json
{
  "success": true,
  "data": {
    "id": "cuid_booking_501",
    "status": "CANCELLED",
    "message": "Đã hủy đặt lớp thành công"
  }
}
```

---

## 7. `GET /api/bookings/me`
Lấy danh sách các lớp học mà hội viên hiện tại đã đăng ký (gồm cả sắp diễn ra và lịch sử).

- **Quyền truy cập (Role)**: `MEMBER`

### Response 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid_booking_501",
      "status": "BOOKED",
      "createdAt": "2026-11-10T09:15:00.000Z",
      "session": {
        "id": "cuid_session_101",
        "className": "Yoga Vinyasa Sáng",
        "startsAt": "2026-11-12T06:00:00.000Z",
        "endsAt": "2026-11-12T07:00:00.000Z",
        "trainerName": "Coach Sarah"
      }
    }
  ]
}
```

---

## 💡 Hướng dẫn tích hợp cho An (Frontend)
1. **Lịch Tuần (Weekly Calendar)**:
   - Dùng ô hiển thị `bookedCount / capacity`.
   - Nếu `availableSlots === 0`, hiển thị nút `"Vào danh sách chờ (Waitlist)"` với màu cam/vàng thay vì nút `"Đặt lớp"` màu xanh.
2. **Hủy lớp**:
   - Hiển thị nút "Hủy lớp" trong trang Cá nhân > Lịch của tôi. Sau khi hủy xong, gọi invalidate query của TanStack Query để cập nhật lại số slot còn trống trên lịch tuần.
