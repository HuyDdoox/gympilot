# Các Luồng Nghiệp Vụ (User Flows) Quan Trọng

### Flow 1: Onboarding Chủ Phòng Gym (Owner)
```text
Truy cập /register
→ Nhập email, mật khẩu, họ tên, tên phòng gym
→ Tạo tài khoản OWNER
→ Tạo bản ghi Gym
→ Thêm staff/trainer
→ Thêm gói tập (Plans)
→ Import hoặc thêm hội viên (Members)
→ Bắt đầu vận hành
```

### Flow 2: Mua Gói & Đặt Lớp
```text
Staff tạo hội viên
→ Chọn gói tập
→ Nhập thông tin thanh toán
→ Xác nhận đã nhận tiền (PAID)
→ Kích hoạt Membership ACTIVE
→ Hội viên nhận email kích hoạt / đặt mật khẩu
→ Hội viên đăng nhập
→ Xem lịch lớp (Classes / Sessions)
→ Đặt lớp (Booking)
→ Nhận email xác nhận
→ Đến phòng tập, quét mã QR check-in
→ Hệ thống trừ số buổi nếu là gói buổi (Session Pack)
```

### Flow 3: Quy Trình Check-in
```text
Hội viên mở trang Profile hiển thị mã QR
→ Staff mở trang /check-in và quét QR
→ Hệ thống xác định thông tin hội viên
→ Kiểm tra hiệu lực gói tập và lịch đặt lớp hôm nay
→ Tạo bản ghi CheckIn
→ Nếu là gói buổi: giảm sessionsLeft đi 1
→ Hiển thị kết quả tức thì cho staff (Thành công / Cảnh báo / Lỗi)
```

### Flow 4: Nhắc Hạn Tự Động (Cron Job)
```text
Cron job kích hoạt lúc 08:00 hàng ngày
→ Quét tìm membership sẽ hết hạn trong 7 ngày tới
→ Quét tìm membership còn <= 3 buổi tập
→ Tạo bản ghi Notification
→ Gửi email thông báo nhắc nhở hội viên
→ Owner theo dõi danh sách hội viên cần liên hệ trực tiếp trên Dashboard
```
