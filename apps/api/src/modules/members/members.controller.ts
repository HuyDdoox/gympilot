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

  async getMemberById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const member = await membersService.getMemberById(id);
      res.status(200).json({
        success: true,
        data: member,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Không tìm thấy thông tin hội viên.',
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

  async updateMember(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await membersService.updateMember(id, req.body);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Cập nhật thông tin hội viên thành công!',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Không thể cập nhật thông tin hội viên',
      });
    }
  }

  async deleteMember(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await membersService.deleteMember(id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Không thể hủy hội viên',
      });
    }
  }

  async previewCsv(req: Request, res: Response): Promise<void> {
    try {
      const { csvContent } = req.body;
      if (!csvContent || typeof csvContent !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp nội dung tệp CSV cần xem trước.',
        });
        return;
      }

      const preview = membersService.previewCsv(csvContent);
      res.status(200).json({
        success: true,
        data: preview,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi khi kiểm tra cấu trúc tệp CSV',
      });
    }
  }

  async importCsv(req: Request, res: Response): Promise<void> {
    try {
      const { rows } = req.body;
      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Danh sách dòng dữ liệu import không hợp lệ hoặc rỗng.',
        });
        return;
      }

      const result = await membersService.importCsv(rows);
      res.status(200).json({
        success: true,
        data: result,
        message: `Đã import thành công ${result.importedCount}/${result.totalSubmitted} hội viên.`,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi xử lý import tệp CSV',
      });
    }
  }

  getTemplateCsv(_req: Request, res: Response): void {
    const csvData = membersService.getTemplateCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="gympilot_member_template.csv"');
    res.status(200).send(csvData);
  }
}

export const membersController = new MembersController();
