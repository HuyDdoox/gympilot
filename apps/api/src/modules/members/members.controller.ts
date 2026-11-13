import { type Request, type Response } from 'express';
import { membersService } from './members.service.js';

export class MembersController {
  async getMembers(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, search, status } = req.query;
      const data = await membersService.getMembers({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search ? String(search) : undefined,
        status: status ? String(status) : undefined,
      });

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi máy chủ khi lấy danh sách hội viên',
      });
    }
  }

  async createMember(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email, phone, gender, dateOfBirth, notes, planId } = req.body;

      if (!fullName || !email) {
        res.status(400).json({
          success: false,
          message: 'Họ tên và email là thông tin bắt buộc.',
        });
        return;
      }

      const member = await membersService.createMember({
        fullName,
        email,
        phone,
        gender,
        dateOfBirth,
        notes,
        planId,
      });

      res.status(201).json({
        success: true,
        data: member,
        message: 'Tạo hội viên mới thành công!',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Không thể tạo hội viên mới',
      });
    }
  }
}

export const membersController = new MembersController();
