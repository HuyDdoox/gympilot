# Danh Sách API Hệ Thống GymPilot

| Phương thức | Endpoint | Role | Mô tả |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Đăng ký tài khoản owner |
| `POST` | `/api/auth/login` | Public | Đăng nhập tài khoản |
| `POST` | `/api/auth/refresh` | Public | Làm mới token truy cập (refresh token) |
| `POST` | `/api/auth/logout` | All | Đăng xuất tài khoản |
| `GET` | `/api/me` | All | Lấy thông tin user hiện tại đang đăng nhập |
| `POST` | `/api/gyms` | OWNER | Tạo phòng gym mới |
| `PATCH` | `/api/gyms/:id` | OWNER | Cập nhật thông tin phòng gym |
| `GET` | `/api/members` | OWNER, STAFF | Danh sách hội viên (filter, search, pagination) |
| `POST` | `/api/members` | OWNER, STAFF | Thêm hội viên mới |
| `GET` | `/api/members/:id` | OWNER, STAFF | Chi tiết thông tin hội viên |
| `PATCH` | `/api/members/:id` | OWNER, STAFF | Cập nhật thông tin hội viên |
| `POST` | `/api/members/import` | OWNER, STAFF | Import danh sách hội viên bằng file CSV |
| `GET` | `/api/plans` | OWNER, STAFF, MEMBER | Danh sách các gói tập |
| `POST` | `/api/plans` | OWNER | Tạo gói tập mới |
| `PATCH` | `/api/plans/:id` | OWNER | Sửa gói tập |
| `GET` | `/api/memberships` | OWNER, STAFF | Danh sách đăng ký membership |
| `POST` | `/api/memberships` | OWNER, STAFF | Mua gói tập cho hội viên |
| `POST` | `/api/memberships/:id/renew` | OWNER, STAFF | Gia hạn gói tập |
| `GET` | `/api/classes` | All | Danh sách loại lớp |
| `POST` | `/api/classes` | OWNER | Tạo loại lớp |
| `GET` | `/api/sessions` | All | Lịch buổi học theo ngày/tuần |
| `POST` | `/api/sessions` | OWNER, STAFF | Tạo buổi học cụ thể |
| `POST` | `/api/bookings` | MEMBER | Đặt lớp học |
| `PATCH` | `/api/bookings/:id/cancel` | MEMBER, STAFF | Hủy đặt lớp |
| `GET` | `/api/bookings/me` | MEMBER | Lịch đã đặt của bản thân hội viên |
| `POST` | `/api/check-ins/qr` | STAFF | Check-in hội viên bằng mã QR |
| `POST` | `/api/check-ins/manual` | OWNER, STAFF | Check-in hội viên thủ công |
| `GET` | `/api/payments` | OWNER, STAFF | Danh sách thanh toán |
| `POST` | `/api/payments` | OWNER, STAFF | Tạo bản ghi thanh toán |
| `PATCH` | `/api/payments/:id/confirm` | OWNER, STAFF | Xác nhận đã nhận tiền |
| `GET` | `/api/reports/overview` | OWNER | Dashboard tổng quan chỉ số |
| `GET` | `/api/reports/revenue` | OWNER | Báo cáo doanh thu |
| `GET` | `/api/reports/at-risk-members` | OWNER | Danh sách hội viên có nguy cơ rời bỏ |
