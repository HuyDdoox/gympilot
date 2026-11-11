# HƯỚNG DẪN CÀI ĐẶT, CẤU HÌNH VÀ CHẠY DỰ ÁN GYMPILOT

> **Phiên bản tài liệu:** 1.0.0  
> **Cập nhật lần cuối:** 11/2026  
> **Dự án:** GymPilot – Hệ thống quản lý phòng gym, yoga, pilates boutique (quy mô 30–300 hội viên)  
> **Kho mã nguồn:** [https://github.com/HuyDdoox/gympilot.git](https://github.com/HuyDdoox/gympilot.git)

---

## MỤC LỤC

1. [PHẦN A – GIỚI THIỆU DỰ ÁN](#phần-a--giới-thiệu-dự-án)
   - 1.1. Mục đích và đối tượng phục vụ
   - 1.2. Kiến trúc Monorepo & Công nghệ sử dụng
   - 1.3. Cấu trúc thư mục chi tiết
   - 1.4. Phân công vai trò kỹ thuật (An & Huy)
2. [PHẦN B – YÊU CẦU MÔI TRƯỜNG](#phần-b--yêu-cầu-môi-trường)
   - 2.1. Bảng tổng hợp công cụ & phiên bản
   - 2.2. Hướng dẫn cài đặt & Kiểm tra từng phần mềm
3. [PHẦN C – CLONE SOURCE CODE](#phần-c--clone-source-code)
4. [PHẦN D – CÀI ĐẶT DEPENDENCIES TRONG MONOREPO](#phần-d--cài-đặt-dependencies-trong-monorepo)
5. [PHẦN E – CẤU HÌNH BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)](#phần-e--cấu-hình-biến-môi-trường-environment-variables)
   - 5.1. Danh sách file môi trường mẫu
   - 5.2. Cấu hình Backend (`apps/api/.env`)
   - 5.3. Cấu hình Frontend (`apps/web/.env`)
   - 5.4. Lưu ý quan trọng về bảo mật
6. [PHẦN F – CÀI ĐẶT VÀ KHỞI ĐỘNG DATABASE (POSTGRESQL & PRISMA)](#phần-f--cài-đặt-và-khởi-động-database-postgresql--prisma)
   - 6.1. Khởi động PostgreSQL qua Docker Compose
   - 6.2. Sinh Prisma Client (`db:generate`)
   - 6.3. Chạy Migration Database (`db:migrate`)
   - 6.4. Chạy Seed dữ liệu mẫu (`db:seed`)
   - 6.5. Cảnh báo an toàn dữ liệu
7. [PHẦN G – HƯỚNG DẪN CHẠY BACKEND API](#phần-g--hướng-dẫn-chạy-backend-api)
8. [PHẦN H – HƯỚNG DẪN CHẠY FRONTEND WEB](#phần-h--hướng-dẫn-chạy-frontend-web)
9. [PHẦN I – HƯỚNG DẪN CHẠY TOÀN BỘ MONOREPO BẰNG TURBOREPO](#phần-i--hướng-dẫn-chạy-toàn-bộ-monorepo-bằng-turborepo)
   - 9.1. Quy trình khởi động chuẩn theo thứ tự
   - 9.2. Chạy môi trường phát triển (Dev)
   - 9.3. Các lệnh kiểm tra chất lượng (Lint, Typecheck, Test, Build)
10. [PHẦN J – HƯỚNG DẪN DÀNH CHO THÀNH VIÊN MỚI](#phần-j--hướng-dẫn-dành-cho-thành-viên-mới)
    - 10.1. Bản đồ vị trí mã nguồn
    - 10.2. Quy trình thêm UI Component mới
    - 10.3. Quy trình thêm API Service / Endpoint mới
    - 10.4. Các quy tắc "Bất khả xâm phạm"
11. [PHẦN K – BẢNG XỬ LÝ LỖI THƯỜNG GẶP (TROUBLESHOOTING)](#phần-k--bảng-xử-lý-lỗi-thường-gặp-troubleshooting)
12. [PHẦN L – CHECKLIST XÁC NHẬN TRIỂN KHAI THÀNH CÔNG](#phần-l--checklist-xác-nhận-triển-khai-thành-công)

---

## PHẦN A – GIỚI THIỆU DỰ ÁN

### 1.1. Mục đích và đối tượng phục vụ
**GymPilot** là nền tảng Web Application hiện đại tối ưu hóa cho công tác quản trị và vận hành các phòng tập thể hình, yoga, pilates theo mô hình boutique (quy mô vừa và nhỏ từ 30 đến 300 hội viên). Hệ thống giải quyết các bài toán cốt lõi:
- Quản lý gói tập, thời hạn thẻ và số buổi tập.
- Đặt lịch lớp học, quản lý sĩ số lớp và huấn luyện viên (PT/Trainer).
- Check-in tự động bằng mã QR hoặc điểm danh thủ công tại quầy lễ tân.
- Theo dõi doanh thu, lịch sử đóng phí và cảnh báo hội viên có nguy cơ rời bỏ (At-risk members).
- Cổng thông tin tương tác dành cho Hội viên (Member Portal) với giao diện tối ưu trên di động lẫn máy tính.

### 1.2. Kiến trúc Monorepo & Công nghệ sử dụng
Dự án được tổ chức theo mô hình **Monorepo** quản lý bởi **npm workspaces** kết hợp hệ thống build cache tốc độ cao **Turborepo** (`turbo` v2):

- **Backend (`apps/api`)**:
  - Runtime: **Node.js 20+**
  - Ngôn ngữ: **TypeScript** (Strict mode)
  - Framework: **Express.js** 4.x
  - ORM: **Prisma ORM** 5.22.0
  - Cơ sở dữ liệu: **PostgreSQL 16** (triển khai qua Docker hoặc Local)
  - Xác thực & Bảo mật: JWT (`jsonwebtoken`), mã hóa mật khẩu `bcrypt`, `cors`
  - Validation: `zod`
  - Testing & Dev: `vitest`, `tsx`, `supertest`
- **Frontend (`apps/web`)**:
  - Runtime & Bundler: **Vite 6**, **React 18**
  - Ngôn ngữ: **TypeScript**
  - Styling: **Tailwind CSS v3**, `clsx`, `tailwind-merge`
  - Bộ icon: **Lucide React**
  - Định tuyến: **React Router DOM v7**
  - Quản lý trạng thái & Server Cache: **TanStack Query v5** (`@tanstack/react-query`), **Zustand**
  - Xử lý Form: **React Hook Form**, **Zod**
  - HTTP Client: **Axios** tập trung với Interceptors
- **Shared Package (`packages/shared`)**:
  - Thư viện nội bộ chứa types DTO, Enums (`Role`, `MemberStatus`, `PlanType`, `BookingStatus`,...), hằng số và schema Zod dùng chung, đảm bảo Type-Safety từ Frontend tới Backend.

### 1.3. Cấu trúc thư mục chi tiết

```text
gympilot/
├── apps/
│   ├── api/                     # Backend Web API (Express.js + Prisma)
│   │   ├── src/
│   │   │   ├── config/          # Cấu hình env, constants, ports
│   │   │   ├── jobs/            # Background jobs (nhắc lịch, hết hạn gói)
│   │   │   ├── middlewares/     # Auth JWT, RoleGuard, validate, error handler
│   │   │   ├── modules/         # Các module nghiệp vụ (auth, members, classes, payments...)
│   │   │   ├── prisma/          # schema.prisma, seed.ts
│   │   │   ├── utils/           # Tiện ích mã hóa, JWT, QR, format date
│   │   │   ├── app.ts           # Cấu hình Express App, CORS, Routes
│   │   │   └── server.ts        # Điểm khởi chạy máy chủ API
│   │   ├── tests/               # Unit test & Integration test cho API
│   │   └── package.json         # Workspace @gympilot/api
│   │
│   └── web/                     # Frontend Web Client (React + Vite)
│       ├── public/images/       # Vector assets (SVG avatar, QR, minh họa)
│       ├── src/
│       │   ├── components/      # UI Design System (Button, Card, Modal, Table...)
│       │   │   ├── layout/      # AppLayout, MemberHeader, MemberFooter, Sidebar
│       │   │   └── ui/          # Các nguyên tử UI dùng chung
│       │   ├── lib/             # Axios instance, Auth storage, helpers
│       │   ├── pages/           # Landing page, Login, Admin & Member Dashboard
│       │   │   └── member/      # Giao diện cổng hội viên & mockData.ts
│       │   ├── routes/          # AppRoutes, ProtectedRoute, RoleGuard
│       │   ├── App.tsx
│       │   └── main.tsx
│       └── package.json         # Workspace @gympilot/web
│
├── packages/
│   └── shared/                  # Thư viện dùng chung (@gympilot/shared)
│       ├── src/                 # Types, DTOs, Enums, Zod Schemas
│       └── package.json
│
├── docs/                        # Tài liệu dự án (API, ERD, Flow, Setup Guide)
├── docker-compose.yml           # Khởi tạo container PostgreSQL 16
├── package.json                 # Monorepo root package.json
├── turbo.json                   # Cấu hình pipeline Turborepo
└── README.md                    # Tổng quan dự án
```

### 1.4. Phân công vai trò kỹ thuật
Nhằm đảm bảo dự án vận hành mượt mà, các thành viên tuân thủ nghiêm ngặt bảng phân nhiệm:
- **An – Frontend Lead**: Quản lý toàn bộ `apps/web/**` và phối hợp cập nhật `packages/shared/src/constants/**`. Chịu trách nhiệm thiết kế UI/UX, Design System, tương tác người dùng, tích hợp API.
- **Huy – Backend Lead**: Quản lý toàn bộ `apps/api/**`, Prisma Schema, Migration, PostgreSQL, Authentication Backend, Business Logic, Middleware và Backend Tests.

---

## PHẦN B – YÊU CẦU MÔI TRƯỜNG

### 2.1. Bảng tổng hợp công cụ & phiên bản

| Phần mềm | Mục đích | Phiên bản yêu cầu | Bắt buộc | Trang tải chính thức |
|---|---|---|:---:|---|
| **Node.js** | Môi trường thực thi JavaScript | `>= 20.x` (khuyến nghị 20 LTS hoặc 22+) | **Có** | [https://nodejs.org](https://nodejs.org) |
| **npm** | Trình quản lý package Monorepo | `>= 10.x` (dự án cài mặc định npm v11/v12) | **Có** | Đi kèm cài đặt Node.js |
| **Git** | Quản lý phiên bản mã nguồn | `>= 2.40.x` | **Có** | [https://git-scm.com](https://git-scm.com) |
| **Docker & Docker Desktop** | Chạy container cơ sở dữ liệu PostgreSQL | Bản mới nhất (Docker Compose v2+) | Khuyến nghị | [https://www.docker.com](https://www.docker.com) |
| **PostgreSQL** | Hệ quản trị cơ sở dữ liệu | `PostgreSQL 16` (nếu không dùng Docker) | **Có** | [https://www.postgresql.org](https://www.postgresql.org) |
| **VS Code** | Trình soạn thảo mã nguồn | Bản ổn định mới nhất | Khuyến nghị | [https://code.visualstudio.com](https://code.visualstudio.com) |
| **DBeaver / pgAdmin** | Xem trực quan bảng dữ liệu PostgreSQL | Bản mới nhất | Tùy chọn | [https://dbeaver.io](https://dbeaver.io) |

### 2.2. Hướng dẫn cài đặt & Kiểm tra từng phần mềm

Mở ứng dụng dòng lệnh (PowerShell, Terminal hoặc Command Prompt) và chạy các lệnh kiểm tra:

```bash
# 1. Kiểm tra Node.js (phải >= v20.0.0)
node -v

# 2. Kiểm tra npm (phải >= 10.0.0)
npm -v

# 3. Kiểm tra Git
git --version

# 4. Kiểm tra Docker (nếu dùng docker-compose)
docker --version
docker compose version
```

---

## PHẦN C – CLONE SOURCE CODE

Thực hiện các bước sau để lấy mã nguồn dự án về máy:

### Bước 1: Mở Terminal tại thư mục bạn muốn lưu dự án (Ví dụ: `D:\GymPilot` hoặc `C:\Projects`)

```bash
# Tạo thư mục làm việc nếu chưa có
mkdir -p D:\GymPilot
cd D:\GymPilot
```

### Bước 2: Clone repository từ GitHub của nhóm

```bash
git clone https://github.com/HuyDdoox/gympilot.git
```
*(Nếu kho lưu trữ đổi sang link khác trong tương lai, hãy thay bằng URL GitHub chính thức do nhóm cung cấp).*

### Bước 3: Di chuyển vào thư mục gốc của repository

```bash
cd gympilot
```

### Bước 4: Mở dự án bằng Visual Studio Code

```bash
code .
```

---

## PHẦN D – CÀI ĐẶT DEPENDENCIES TRONG MONOREPO

Dự án áp dụng cấu trúc **npm workspaces**. Mọi thư viện phụ thuộc của Root, Frontend, Backend và Shared đều được liên kết tự động và phân giải một cách đồng bộ từ thư mục gốc.

### Lệnh cài đặt duy nhất từ thư mục gốc (`gympilot/`):

```bash
npm install
```

> [!IMPORTANT]
> **Tuyệt đối không di chuyển vào từng thư mục con (`apps/web`, `apps/api`) để chạy `npm install` đơn lẻ.** Việc cài từ thư mục gốc đảm bảo các symbolic link của gói `@gympilot/shared` được liên kết chính xác trong `node_modules` và tránh lỗi xung đột phiên bản.

Nếu chỉ muốn cài đặt hoặc build riêng một workspace cụ thể từ thư mục gốc:

```bash
# Cài đặt hoặc build riêng thư viện shared:
npm --workspace=@gympilot/shared run build

# Chạy lệnh trong workspace api:
npm --workspace=@gympilot/api <tên_script>

# Chạy lệnh trong workspace web:
npm --workspace=@gympilot/web <tên_script>
```

---

## PHẦN E – CẤU HÌNH BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)

### 5.1. Danh sách file môi trường mẫu
Trong dự án hiện có 3 file cấu hình mẫu:
1. `gympilot/.env.example` (Mẫu cấu hình môi trường gốc)
2. `gympilot/apps/api/.env.example` (Mẫu cấu hình Backend)
3. `gympilot/apps/web/.env.example` (Mẫu cấu hình Frontend)

### 5.2. Cấu hình Backend (`apps/api/.env`)
Tạo file `.env` tại đường dẫn `apps/api/.env` (hoặc copy từ `apps/api/.env.example`):

**Trên Windows PowerShell:**
```powershell
Copy-Item apps/api/.env.example apps/api/.env
```

**Nội dung chi tiết các biến của Backend:**

| Tên biến | Kiểu dữ liệu | Ý nghĩa | Giá trị mẫu cho môi trường Local | Bắt buộc |
|---|---|---|---|:---:|
| `PORT` | Number | Cổng lắng nghe của máy chủ Express | `5000` | Có |
| `NODE_ENV` | String | Chế độ chạy ứng dụng | `development` | Có |
| `CLIENT_URL` | String | Địa chỉ URL của Frontend dùng cho CORS | `http://localhost:5173` | Có |
| `DATABASE_URL` | String | Chuỗi kết nối PostgreSQL 16 | `"postgresql://postgres:postgres@localhost:5432/gympilot?schema=public"` | Có |
| `JWT_SECRET` | String | Khóa bí mật ký mã Access Token | `supersecretjwtkey_gympilot_development_only_2026` | Có |
| `JWT_REFRESH_SECRET` | String | Khóa bí mật ký mã Refresh Token | `supersecretjwtrefreshkey_gympilot_development_only_2026` | Có |
| `JWT_ACCESS_EXPIRES_IN` | String | Thời gian sống của Access Token | `15m` | Không |
| `JWT_REFRESH_EXPIRES_IN` | String | Thời gian sống của Refresh Token | `7d` | Không |

### 5.3. Cấu hình Frontend (`apps/web/.env`)
Tạo file `.env` tại đường dẫn `apps/web/.env`:

**Trên Windows PowerShell:**
```powershell
Copy-Item apps/web/.env.example apps/web/.env
```

**Nội dung chi tiết các biến của Frontend:**

| Tên biến | Ý nghĩa | Giá trị chuẩn | Bắt buộc |
|---|---|---|:---:|
| `VITE_API_URL` | Base URL gọi API Backend từ trình duyệt | `/api` | Có |

> [!NOTE]
> Giá trị `VITE_API_URL=/api` tận dụng tính năng Proxy có sẵn của Vite dev server (`vite.config.ts`), tự động chuyển hướng các request `/api/*` về `http://localhost:5000` mà không bị chặn bởi chính sách CORS của trình duyệt. Nếu chạy Frontend độc lập mà không qua Vite proxy, giá trị này có thể đặt là `http://localhost:5000/api`.

### 5.4. Lưu ý quan trọng về bảo mật
- **Không đưa Secret vào Frontend:** Các biến bắt đầu bằng tiền tố `VITE_` sẽ được Vite biên dịch công khai vào mã JavaScript chạy trên trình duyệt người dùng. Tuyệt đối không lưu trữ khóa bí mật, Private Key hay mật khẩu database tại `apps/web/.env`.
- **Không commit file `.env` lên Git:** File `.env` chứa mật khẩu và token riêng tư, đã được cấu hình trong `.gitignore`. Hãy kiểm tra kỹ trước khi tạo commit.

---

## PHẦN F – CÀI ĐẶT VÀ KHỞI ĐỘNG DATABASE (POSTGRESQL & PRISMA)

Dự án GymPilot sử dụng **PostgreSQL 16** và **Prisma ORM**.

### 6.1. Khởi động PostgreSQL qua Docker Compose (Khuyến nghị)
Nếu máy bạn đã cài Docker Desktop, bạn có thể khởi động ngay PostgreSQL 16 chỉ với 1 câu lệnh tại thư mục gốc:

```bash
docker-compose up -d
```
Lệnh này sẽ khởi chạy một container tên `gympilot_postgres` chạy ngầm tại cổng `5432`, tài khoản mặc định `postgres`, mật khẩu `postgres`, database `gympilot`.

*Nếu cài PostgreSQL trực tiếp trên máy không dùng Docker:*
- Đảm bảo service PostgreSQL đang chạy tại port `5432`.
- Tạo một database tên `gympilot`.
- Cập nhật username/password tương ứng vào chuỗi `DATABASE_URL` trong file `apps/api/.env`.

### 6.2. Sinh Prisma Client (`db:generate`)
Trước khi chạy Backend hoặc thực hiện typecheck, cần sinh mã TypeScript cho Prisma Client:

```bash
npm --workspace=@gympilot/api run db:generate
```
Lệnh này đọc lược đồ tại `apps/api/src/prisma/schema.prisma` và xuất bản Prisma Client vào `node_modules/@prisma/client`.

### 6.3. Chạy Migration Database (`db:migrate`)
Để khởi tạo các bảng dữ liệu (`Gym`, `User`, `Member`, `Plan`, `Booking`,...):

```bash
npm --workspace=@gympilot/api run db:migrate
```
*Lưu ý: Lệnh này áp dụng tất cả các migration của Prisma lên cơ sở dữ liệu PostgreSQL đang kết nối.*

### 6.4. Chạy Seed dữ liệu mẫu (`db:seed`)
Khởi tạo dữ liệu mẫu ban đầu (phục vụ kiểm thử):

```bash
npm --workspace=@gympilot/api run db:seed
```

### 6.5. Cảnh báo an toàn dữ liệu
- **KHÔNG** tùy tiện chạy các lệnh như `prisma migrate reset` nếu bạn đang dùng chung cơ sở dữ liệu thử nghiệm có dữ liệu quan trọng.
- **KHÔNG** tự ý sửa đổi file `apps/api/src/prisma/schema.prisma` khi chưa có sự thống nhất từ **Huy – Backend Lead**.

---

## PHẦN G – HƯỚNG DẪN CHẠY BACKEND API

### Quy trình khởi chạy Backend độc lập:

1. Đảm bảo Database PostgreSQL đã hoạt động (kiểm tra qua Docker hoặc service local).
2. Đảm bảo file `apps/api/.env` đã tồn tại và cấu hình đúng `DATABASE_URL`.
3. Chạy lệnh dev từ thư mục gốc:

```bash
npm --workspace=@gympilot/api run dev
```

### Thông số kiểm tra hoạt động:
- **Địa chỉ máy chủ:** `http://localhost:5000`
- **Môi trường:** `development`
- **Kiểm tra Health Check API:**
  Mở trình duyệt hoặc curl đến:  
  `http://localhost:5000/api/health`  
  Phản hồi JSON chuẩn:
  ```json
  {
    "success": true,
    "data": {
      "status": "ok"
    }
  }
  ```

---

## PHẦN H – HƯỚNG DẪN CHẠY FRONTEND WEB

### Quy trình khởi chạy Frontend độc lập:

1. Đảm bảo file `apps/web/.env` đã được tạo (`VITE_API_URL=/api`).
2. Chạy lệnh dev từ thư mục gốc:

```bash
npm --workspace=@gympilot/web run dev
```

### Thông số kiểm tra giao diện:
- **Địa chỉ truy cập trình duyệt:** `http://localhost:5173`
- **Các trang quan trọng:**
  - **Trang giới thiệu (Landing Page):** `http://localhost:5173/`
  - **Trang Đăng nhập:** `http://localhost:5173/login` *(có sẵn nút 1-chạm đăng nhập nhanh giả lập cho Hội viên Mai Thị Vy An và Chủ phòng Owner)*
  - **Trang chủ Hội viên (Member Homepage):** `http://localhost:5173/member/dashboard` (hoặc `http://localhost:5173/member`)
  - **Trang quản trị (Admin Dashboard):** `http://localhost:5173/dashboard`
  - **Trang Đặt lớp:** `http://localhost:5173/member/class-booking`
  - **Trang Gói tập:** `http://localhost:5173/member/my-membership`

---

## PHẦN I – HƯỚNG DẪN CHẠY TOÀN BỘ MONOREPO BẰNG TURBOREPO

### 9.1. Quy trình khởi động chuẩn theo thứ tự phụ thuộc
Để hệ thống hoạt động ổn định nhất, hãy khởi động theo thứ tự sau:

$$\text{PostgreSQL Database} \longrightarrow \text{Backend API} \longrightarrow \text{Frontend Web Client}$$

### 9.2. Chạy môi trường phát triển (Dev)
Từ thư mục gốc `gympilot/`, chỉ cần thực hiện 1 câu lệnh duy nhất:

```bash
npm run dev
```
*(Turborepo sẽ song song khởi chạy cả máy chủ Backend `@gympilot/api` tại port 5000 và Frontend `@gympilot/web` tại port 5173).*

### 9.3. Các lệnh kiểm tra chất lượng mã nguồn từ thư mục gốc

Turborepo hỗ trợ chạy đồng thời và tận dụng cache thông minh cho các tác vụ kiểm thử:

```bash
# 1. Kiểm tra lỗi cú pháp và định dạng mã nguồn (ESLint)
npm run lint

# 2. Kiểm tra tính toàn vẹn kiểu dữ liệu (TypeScript Typecheck)
npm run typecheck

# 3. Chạy toàn bộ Unit Tests (Vitest)
npm run test

# 4. Biên dịch mã nguồn sản xuất (Production Build)
npm run build
```

---

## PHẦN J – HƯỚNG DẪN DÀNH CHO THÀNH VIÊN MỚI

### 10.1. Bản đồ vị trí mã nguồn

| Thành phần | Đường dẫn thực tế | Chú thích |
|---|---|---|
| **Root Config** | `package.json`, `turbo.json` | Cấu hình chung Monorepo, script điều phối |
| **Frontend Source** | `apps/web/src/` | Toàn bộ mã nguồn giao diện người dùng |
| **UI Design System** | `apps/web/src/components/ui/` | Button, Badge, Card, Modal, Input, Table,... |
| **Cổng Hội viên** | `apps/web/src/pages/member/` | Trang chủ hội viên, mock data và các card chức năng |
| **Routing** | `apps/web/src/routes/AppRoutes.tsx` | Khai báo đường dẫn và phân quyền Role |
| **HTTP Interceptor** | `apps/web/src/lib/axios.ts` | Axios instance tập trung gắn Bearer token |
| **Backend Source** | `apps/api/src/` | Controller, Service, Middleware, Job của Huy |
| **Database Schema** | `apps/api/src/prisma/schema.prisma`| Lược đồ cấu trúc cơ sở dữ liệu PostgreSQL |
| **Shared Types/DTO**| `packages/shared/src/` | Các định nghĩa interface dùng chung 2 phía |

### 10.2. Quy trình thêm UI Component mới (Frontend)
1. Kiểm tra xem thành phần đã có trong `apps/web/src/components/ui/` chưa.
2. Nếu chưa có, tạo component mới trong `components/ui/` tuân thủ các quy tắc:
   - Dùng TypeScript với định nghĩa props rõ ràng.
   - Sử dụng các lớp tiện ích Tailwind CSS hiện có.
   - Hỗ trợ đầy đủ trạng thái `hover`, `focus-visible`, `disabled`.
3. Xuất component tại `apps/web/src/components/ui/index.ts`.

### 10.3. Quy trình thêm API Service / Endpoint mới
1. Tra cứu hợp đồng API tại `docs/api.md` hoặc đề xuất qua file `docs/API_CONTRACT_REQUEST_FOR_HUY.md`.
2. Không tự ý bịa endpoint giả định khác với cấu trúc do Huy phụ trách.
3. Tạo hàm gọi API trong `apps/web/src/services/` thông qua `apiClient` từ `@/lib/axios`.
4. Áp dụng `@tanstack/react-query` (`useQuery`, `useMutation`) để quản lý cache và trạng thái `isLoading`, `isError`.

### 10.4. Các quy tắc "Bất khả xâm phạm"
1. **Tuân thủ phân quyền phân hệ:** Thành viên phụ trách Frontend (An) tuyệt đối không tự ý chỉnh sửa mã nguồn Backend, Prisma Schema hoặc Migration của Huy; và ngược lại.
2. **Không commit thông tin nhạy cảm:** Không commit mật khẩu, khóa bí mật JWT hoặc chuỗi kết nối Database thật vào Git.
3. **Giữ gìn tài liệu hợp đồng:** Mọi thay đổi về Request Body, Response Data DTO phải được trao đổi và cập nhật đồng bộ trong `packages/shared`.

---

## PHẦN K – BẢNG XỬ LÝ LỖI THƯỜNG GẶP (TROUBLESHOOTING)

| Hiện tượng lỗi | Nguyên nhân gốc rễ | Cách kiểm tra | Giải pháp khắc phục |
|---|---|---|---|
| `Cannot find module '@gympilot/shared'` | Package `@gympilot/shared` chưa được biên dịch mã TypeScript hoặc npm link bị gián đoạn. | Xem trong thư mục `packages/shared/dist/` đã có file `index.js` chưa. | Chạy lệnh: `npm --workspace=@gympilot/shared run build` tại thư mục gốc. |
| `PrismaClientInitializationError: Can't reach database server at localhost:5432` | Container PostgreSQL chưa bật hoặc dịch vụ PostgreSQL local bị dừng. | Chạy `docker ps` kiểm tra xem container `gympilot_postgres` có trạng thái `Up` không. | Chạy lệnh `docker-compose up -d` hoặc khởi động dịch vụ PostgreSQL trên máy. |
| `Module '"@prisma/client"' has no exported member 'PrismaClient'` | Prisma Client chưa được khởi tạo sau khi clone repo hoặc vừa cập nhật schema. | Kiểm tra thư mục `node_modules/@prisma/client`. | Chạy lệnh: `npm --workspace=@gympilot/api run db:generate`. |
| `Port 5000 (hoặc 5173) is already in use` | Có tiến trình khác hoặc phiên bản chạy trước đó chưa tắt hẳn. | Trên Windows chạy: `netstat -ano \| findstr :5000`. | Đóng terminal cũ hoặc đổi cổng `PORT` trong file `.env`. |
| `CORS error: No 'Access-Control-Allow-Origin' header` | Frontend gọi trực tiếp đến Backend nhưng giá trị `CLIENT_URL` tại `apps/api/.env` không khớp với cổng Frontend. | Mở tab Network trên DevTools trình duyệt xem origin request. | Đảm bảo `CLIENT_URL=http://localhost:5173` trong file `apps/api/.env`. |
| `error TS2724: '"zod"' has no exported member named 'AnyZodObject'` | Phiên bản Zod mới có sự thay đổi về type xuất khẩu hoặc cần dùng `ZodObject<any>`. | Chạy `npm --workspace=@gympilot/api run typecheck`. | Báo cáo Backend Lead (Huy) để chuẩn hóa type trong `apps/api/src/middlewares/validate.middleware.ts`. |
| Trang trắng hoặc lỗi 404 khi F5 trang `/member/dashboard` | Cấu hình định tuyến Single Page Application (SPA) của dev server. | Kiểm tra thanh địa chỉ trình duyệt. | Vite mặc định hỗ trợ history API fallback; đảm bảo bạn khởi động qua `npm run dev`. |

---

## PHẦN L – CHECKLIST XÁC NHẬN TRIỂN KHAI THÀNH CÔNG

Sử dụng bảng kiểm sau để tự đánh giá hệ thống của bạn đã sẵn sàng làm việc:

- [ ] **Môi trường:** Đã cài Node.js (>= 20.x), npm (>= 10.x), Git và Docker.
- [ ] **Clone Code:** Đã clone repository đầy đủ các nhánh làm việc.
- [ ] **Dependencies:** Đã chạy `npm install` thành công tại thư mục gốc không có lỗi.
- [ ] **Shared Package:** Thư viện `@gympilot/shared` đã được build (`npm --workspace=@gympilot/shared run build`).
- [ ] **Environment:** 
  - Đã tạo `apps/api/.env` từ file mẫu.
  - Đã tạo `apps/web/.env` từ file mẫu.
- [ ] **Database:**
  - Container PostgreSQL 16 đã chạy (`docker-compose up -d`).
  - Đã chạy sinh client: `npm --workspace=@gympilot/api run db:generate`.
  - Đã chạy migration: `npm --workspace=@gympilot/api run db:migrate`.
- [ ] **Backend:**
  - Khởi động thành công: `npm --workspace=@gympilot/api run dev`.
  - Endpoint `http://localhost:5000/api/health` phản hồi `{"status": "ok"}`.
- [ ] **Frontend:**
  - Khởi động thành công: `npm --workspace=@gympilot/web run dev`.
  - Truy cập được Landing Page tại `http://localhost:5173`.
  - Truy cập được Member Homepage tại `http://localhost:5173/member/dashboard`.
  - Kiểm tra các UI Component, Modal, Dropdown hiển thị mượt mà.
- [ ] **Kiểm tra chất lượng (Verification):**
  - `npm run lint` đạt kết quả PASS.
  - `npm run test` đạt kết quả PASS (Unit tests chạy thành công).
