# Quy tắc phát triển GymPilot cho AI Agent (Antigravity)

1. Luôn dùng TypeScript strict mode.
2. Không dùng `any`. Nếu bắt buộc, phải giải thích lý do.
3. Backend: mỗi module có controller, service, routes, schema validation.
4. Không viết business logic trong controller; controller chỉ nhận request và trả res.
5. Mọi API phải validate input bằng Zod.
6. Mọi lỗi phải trả chuẩn: `{ success: false, message, code, details? }`.
7. Mọi response thành công trả: `{ success: true, data }`.
8. Prisma: luôn dùng relation đúng, tránh N+1 query; dùng include/select khi cần.
9. Không xoá cứng dữ liệu nghiệp vụ; ưu tiên soft delete hoặc status.
10. Frontend: component nhỏ, tái sử dụng, đặt trong đúng thư mục.
11. UI dùng Tailwind, ưu tiên mobile-first.
12. Mọi form phải có validation và thông báo lỗi tiếng Việt.
13. Mỗi task phải có test ít nhất cho service layer.
14. Trước khi hoàn thành, agent phải chạy:
    - npm run lint
    - npm run typecheck
    - npm run test
15. Không tự ý thêm tính năng ngoài PROJECT_BRIEF.md.
16. Khi thay đổi schema, phải tạo Prisma migration và cập nhật seed.
17. Commit theo dạng: `feat(module): mô tả ngắn`.
