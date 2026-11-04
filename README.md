# GymPilot 🏋️‍♂️

Hệ thống web application quản lý phòng gym, yoga, pilates boutique dành cho quy mô 30–300 hội viên.

## 🚀 Công nghệ sử dụng

- **Monorepo**: Turborepo + npm workspaces
- **Backend (`apps/api`)**: Node.js 20+, Express.js, TypeScript, Prisma ORM, PostgreSQL 16
- **Frontend (`apps/web`)**: React 18+, TypeScript, Vite, Tailwind CSS, TanStack Query, React Hook Form + Zod
- **Shared (`packages/shared`)**: Các kiểu dữ liệu, constants và schema validate Zod dùng chung giữa frontend và backend

## 📦 Cấu trúc dự án

```text
gympilot/
├─ apps/
│  ├─ api/             # Express.js REST API
│  └─ web/             # React + Vite frontend
├─ packages/
│  └─ shared/          # Types, Constants & Zod Schemas
├─ docs/               # API, ERD, User Flows & Deployment Docs
├─ docker-compose.yml  # PostgreSQL 16 container
└─ turbo.json          # Monorepo build system
```

## 🛠️ Hướng dẫn cài đặt & Chạy dự án

### 1. Yêu cầu môi trường
- Node.js >= 20.x
- npm >= 10.x
- Docker & Docker Compose (hoặc PostgreSQL 16 cài đặt cục bộ)

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Khởi động PostgreSQL
```bash
docker-compose up -d
```

### 4. Cấu hình biến môi trường
Sao chép `.env.example` thành `.env` tại thư mục gốc hoặc `apps/api/.env`.

### 5. Chạy cơ sở dữ liệu (Prisma)
```bash
npm --workspace=@gympilot/api run db:generate
npm --workspace=@gympilot/api run db:migrate
```

### 6. Chạy dự án ở môi trường phát triển (Dev)
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

### 7. Kiểm tra chất lượng mã nguồn
```bash
npm run lint
npm run typecheck
npm run test
```
