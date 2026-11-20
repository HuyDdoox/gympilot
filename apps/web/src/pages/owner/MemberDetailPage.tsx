import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  QrCode,
  Clock,
  Edit,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Activity,
  FileText,
} from 'lucide-react';
import { api } from '@/lib/axios';
import {
  Button,
  Card,
  Badge,
  Modal,
  Input,
  Select,
  LoadingSpinner,
  ErrorState,
} from '@/components/ui';

interface MembershipInfo {
  id: string;
  planName: string;
  planType: string;
  price: number;
  startDate: string;
  endDate: string | null;
  sessionsLeft: number | null;
  status: string;
}

interface CheckInInfo {
  id: string;
  method: string;
  createdAt: string;
  note?: string | null;
}

interface MemberDetail {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string | null;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED';
  qrToken: string;
  notes: string | null;
  joinedAt: string;
  activeMembership: MembershipInfo | null;
  recentCheckIns?: CheckInInfo[];
}

export const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [member, setMember] = useState<MemberDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    gender: 'Nam',
    dateOfBirth: '',
    status: 'ACTIVE',
    notes: '',
  });

  const fetchMember = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/members/${id}`);
      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        setMember(data);
        setEditForm({
          fullName: data.fullName || '',
          phone: data.phone || '',
          gender: data.gender || 'Nam',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '',
          status: data.status || 'ACTIVE',
          notes: data.notes || '',
        });
      } else {
        setError('Không nhận được dữ liệu chi tiết hội viên.');
      }
    } catch (err: unknown) {
      console.error('Lỗi khi tải thông tin hội viên:', err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || (err instanceof Error ? err.message : 'Lỗi kết nối máy chủ'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!editForm.fullName.trim() || editForm.fullName.trim().length < 2) {
      setEditError('Họ tên hội viên phải có ít nhất 2 ký tự.');
      return;
    }

    try {
      setIsSubmittingEdit(true);
      setEditError(null);
      setEditSuccess(null);

      const res = await api.put(`/members/${id}`, {
        fullName: editForm.fullName.trim(),
        phone: editForm.phone.trim(),
        gender: editForm.gender,
        dateOfBirth: editForm.dateOfBirth || undefined,
        status: editForm.status,
        notes: editForm.notes.trim() || undefined,
      });

      if (res.data?.success) {
        setEditSuccess('Cập nhật thông tin hội viên thành công!');
        await fetchMember();
        setTimeout(() => {
          setIsEditModalOpen(false);
          setEditSuccess(null);
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setEditError(msg || 'Không thể cập nhật thông tin hội viên.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Hoạt động</Badge>;
      case 'PAUSED':
        return <Badge variant="warning">Tạm dừng</Badge>;
      case 'EXPIRED':
        return <Badge variant="error">Hết hạn</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">Đã hủy</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-slate-500">Đang tải hồ sơ hội viên...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6 max-w-4xl mx-auto">
        <Link
          to="/owner/members"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách hội viên
        </Link>
        <ErrorState
          title="Không tìm thấy thông tin hội viên"
          message={error || 'Hội viên không tồn tại hoặc đã bị xóa.'}
          onRetry={fetchMember}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate('/owner/members')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách hội viên</span>
          </button>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMember}
              disabled={isLoading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Làm mới
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        </div>

        {/* Member Profile Header Card */}
        <Card className="bg-white border-slate-200/80 p-6 rounded-2xl shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {member.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {member.fullName}
                  </h1>
                  {getStatusBadge(member.status)}
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span>Mã hội viên: <strong className="text-slate-700 font-mono">{member.id}</strong></span>
                  <span>•</span>
                  <span>Ngày tham gia: <strong>{new Date(member.joinedAt).toLocaleDateString('vi-VN')}</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200/80">
              <QrCode className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mã QR Check-in</p>
                <p className="text-xs font-mono font-semibold text-slate-800 truncate max-w-[200px]">
                  {member.qrToken}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main 2-Column Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (2 cols): Personal Info & Check-in History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <Card className="bg-white border-slate-200/80 p-6 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <User className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Thông tin cá nhân & Liên hệ</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Email tài khoản</p>
                    <p className="font-semibold text-slate-900 truncate">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Số điện thoại</p>
                    <p className="font-semibold text-slate-900">{member.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Giới tính</p>
                    <p className="font-semibold text-slate-900">{member.gender}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Ngày sinh</p>
                    <p className="font-semibold text-slate-900">
                      {member.dateOfBirth
                        ? new Date(member.dateOfBirth).toLocaleDateString('vi-VN')
                        : 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  <span>Ghi chú thể trạng & Yêu cầu riêng</span>
                </div>
                <p className="text-xs text-amber-800">
                  {member.notes || 'Không có ghi chú thể trạng đặc biệt nào.'}
                </p>
              </div>
            </Card>

            {/* Check-in History */}
            <Card className="bg-white border-slate-200/80 p-6 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Lịch sử điểm danh gần đây</h2>
                </div>
                <span className="text-xs text-slate-500">
                  {member.recentCheckIns?.length || 0} lần ghi nhận
                </span>
              </div>

              {member.recentCheckIns && member.recentCheckIns.length > 0 ? (
                <div className="space-y-2.5">
                  {member.recentCheckIns.map((ci) => (
                    <div
                      key={ci.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {ci.note || 'Điểm danh vào phòng tập'}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(ci.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                        {ci.method}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs italic">
                  Chưa có lịch sử điểm danh nào được ghi nhận.
                </div>
              )}
            </Card>
          </div>

          {/* Right Column (1 col): Membership & Quick Pass */}
          <div className="space-y-6">
            {/* Active Membership Card */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-white">Gói tập hội viên</h3>
                </div>
                {member.activeMembership ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Đang kích hoạt
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">
                    Chưa đăng ký
                  </span>
                )}
              </div>

              {member.activeMembership ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-extrabold text-white">
                      {member.activeMembership.planName}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Loại gói: <strong className="text-emerald-400">{member.activeMembership.planType}</strong>
                    </p>
                    <p className="text-base font-extrabold text-emerald-400 mt-1">
                      {new Intl.NumberFormat('vi-VN').format(member.activeMembership.price)} đ
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Ngày bắt đầu:</span>
                      <strong className="text-white">{member.activeMembership.startDate}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Ngày hết hạn:</span>
                      <strong className="text-white">
                        {member.activeMembership.endDate || 'Vô thời hạn'}
                      </strong>
                    </div>
                    {member.activeMembership.sessionsLeft !== null && (
                      <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-700">
                        <span>Số buổi còn lại:</span>
                        <strong className="text-emerald-400">
                          {member.activeMembership.sessionsLeft} buổi
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <p className="text-xs text-slate-400">
                    Hội viên này hiện chưa được gán gói tập hợp lệ.
                  </p>
                </div>
              )}
            </Card>

            {/* Pass QR Card */}
            <Card className="bg-white border-slate-200/80 p-6 rounded-2xl shadow-xs text-center space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Thẻ thành viên điện tử</h3>
              <div className="w-36 h-36 mx-auto bg-slate-50 border-2 border-dashed border-emerald-300 rounded-2xl flex flex-col items-center justify-center p-3">
                <QrCode className="w-20 h-20 text-emerald-600" />
                <span className="text-[10px] font-mono text-slate-500 mt-1 truncate max-w-full">
                  {member.qrToken.slice(0, 12)}...
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Quét mã này tại trạm quét QR ở lối vào hoặc xuất trình khi tham gia các lớp tập.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Chỉnh Sửa Thông Tin Hội Viên */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditError(null);
          setEditSuccess(null);
        }}
        title="Chỉnh sửa thông tin hội viên"
        description="Cập nhật thông tin cá nhân, trạng thái hoặc ghi chú thể trạng của hội viên."
        maxWidth="lg"
      >
        {editSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{editSuccess}</span>
          </div>
        )}

        {editError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{editError}</span>
          </div>
        )}

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Input
                label="Họ và tên"
                name="fullName"
                value={editForm.fullName}
                onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                isRequired
              />
            </div>
            <div>
              <Input
                label="Số điện thoại"
                name="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                isRequired
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <Select
                label="Giới tính"
                name="gender"
                value={editForm.gender}
                onChange={(e) => setEditForm((p) => ({ ...p, gender: e.target.value }))}
                options={[
                  { value: 'Nam', label: 'Nam' },
                  { value: 'Nữ', label: 'Nữ' },
                  { value: 'Khác', label: 'Khác' },
                ]}
              />
            </div>
            <div>
              <Input
                label="Ngày sinh"
                type="date"
                name="dateOfBirth"
                value={editForm.dateOfBirth}
                onChange={(e) => setEditForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
              />
            </div>
            <div>
              <Select
                label="Trạng thái"
                name="status"
                value={editForm.status}
                onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                options={[
                  { value: 'ACTIVE', label: 'Hoạt động' },
                  { value: 'PAUSED', label: 'Tạm dừng' },
                  { value: 'EXPIRED', label: 'Hết hạn' },
                  { value: 'CANCELLED', label: 'Đã hủy' },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú thể trạng
            </label>
            <textarea
              name="notes"
              rows={3}
              value={editForm.notes}
              onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Ghi chú về chấn thương, mục tiêu rèn luyện..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmittingEdit}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmittingEdit}
              isLoading={isSubmittingEdit}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MemberDetailPage;
