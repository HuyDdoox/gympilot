# Hướng Dẫn Triển Khai (Deployment) — GymPilot

## 1. Môi Trường Local Với Docker
- Khởi động cơ sở dữ liệu PostgreSQL:
  ```bash
  docker-compose up -d
  ```
- Khởi tạo schema trong database:
  ```bash
  npm --workspace=@gympilot/api run db:generate
  npm --workspace=@gympilot/api run db:migrate
  ```

## 2. Triển Khai MVP Lên Môi Trường Cloud
Theo mục 7 trong `PROJECT_BRIEF.md`:
- **Frontend (`apps/web`)**: Triển khai trên **Vercel** hoặc **Railway**.
- **Backend (`apps/api`)**: Triển khai trên **Railway** hoặc **Fly.io**.
- **Database (PostgreSQL 16)**: Sử dụng dịch vụ cơ sở dữ liệu được quản lý như **Neon.tech** hoặc **Supabase**.
