import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Plus,
  RefreshCw,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Upload,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api } from '@/lib/axios';
import {
  Button,
  Card,
  Input,
  Select,
  Badge,
  Modal,
  LoadingSpinner,
  EmptyState,
  ErrorState,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';
import { ImportCsvModal } from './components/ImportCsvModal';

export interface MemberData {
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
  activeMembership: {
    id: string;
    planName: string;
    planType: string;
    price: number;
    startDate: string;
    endDate: string | null;
    sessionsLeft: number | null;
    status: string;
  } | null;
}

export interface PlanData {
  id: string;
  name: string;
  type: string;
  price: number;
  durationDays: number | null;
  totalSessions: number | null;
}

export const MembersPage: React.FC = () => {
  const navigate = useNavigate();

  // 1. Quản lý State danh sách và API từ Supabase / Backend
  const [members, setMembers] = useState<MemberData[]>([]);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. State tìm kiếm, bộ lọc và Phân trang (Backend Synced)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // 3. State Thống kê nhanh tổng quan
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    paused: 0,
    expired: 0,
  });

  // 4. State Modal Thêm hội viên mới
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState<boolean>(false);
  const [addSuccessMessage, setAddSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Nam',
    planId: '',
    dateOfBirth: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // 5. State Modal Chỉnh sửa hội viên
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<MemberData | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState<string | null>(null);
  const [editFormErrors, setEditFormErrors] = useState<{ [key: string]: string }>({});
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    phone: '',
    gender: 'Nam',
    dateOfBirth: '',
    status: 'ACTIVE' as 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED',
    notes: '',
  });

  // 6. State Modal Import CSV
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // 7. Hàm fetch danh sách hội viên kèm phân trang từ Backend API
  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/members', {
        params: {
          page,
          limit,
          search: searchTerm.trim() || undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
        },
      });

      if (res.data?.success && res.data?.data) {
        const { members: memberList, pagination } = res.data.data;
        setMembers(memberList || []);
        if (pagination) {
          setTotalPages(pagination.totalPages || 1);
          setTotalItems(pagination.totalItems || memberList.length);
        }
      } else {
        setMembers([]);
      }
    } catch (err: unknown) {
      console.error('Lỗi khi tải danh sách hội viên:', err);
      setError(err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ API');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchTerm, statusFilter]);

  // 8. Tải thống kê tổng quan (fetch full count 1 lần)
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/members', { params: { limit: 100 } });
      if (res.data?.success && res.data?.data?.members) {
        const all: MemberData[] = res.data.data.members;
        setStats({
          total: res.data.data.pagination?.totalItems || all.length,
          active: all.filter((m) => m.status === 'ACTIVE').length,
          paused: all.filter((m) => m.status === 'PAUSED').length,
          expired: all.filter((m) => m.status === 'EXPIRED').length,
        });
      }
    } catch {
      // Bỏ qua lỗi stats phụ
    }
  }, []);

  // 9. Hàm fetch danh sách gói tập
  const fetchPlans = useCallback(async () => {
    try {
      const res = await api.get('/plans');
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setPlans(res.data.data);
      }
    } catch {
      // Bỏ qua lỗi plans phụ
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    fetchStats();
    fetchPlans();
  }, [fetchStats, fetchPlans]);

  // Reset về page 1 khi filter hoặc search thay đổi
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  // 10. Xử lý Form Thêm hội viên
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateAddForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = 'Họ tên hội viên phải có ít nhất 2 ký tự.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Địa chỉ email không đúng định dạng hợp lệ.';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phone.trim())) {
      errors.phone = 'Số điện thoại phải từ 10 số (VD: 0912345678).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddForm()) return;

    try {
      setIsSubmittingAdd(true);
      const res = await api.post('/members', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || undefined,
        planId: formData.planId || undefined,
        notes: formData.notes || undefined,
      });

      if (res.data?.success) {
        setAddSuccessMessage(`Đã thêm thành công hội viên "${formData.fullName}"!`);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          gender: 'Nam',
          planId: '',
          dateOfBirth: '',
          notes: '',
        });
        await fetchMembers();
        await fetchStats();
        setTimeout(() => {
          setIsAddModalOpen(false);
          setAddSuccessMessage(null);
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormErrors((prev) => ({
        ...prev,
        general: msg || 'Không thể tạo hội viên mới. Vui lòng kiểm tra lại.',
      }));
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // 11. Xử lý Chỉnh sửa hội viên
  const handleOpenEditModal = (m: MemberData) => {
    setEditingMember(m);
    setEditFormData({
      fullName: m.fullName,
      phone: m.phone,
      gender: m.gender || 'Nam',
      dateOfBirth: m.dateOfBirth ? m.dateOfBirth.slice(0, 10) : '',
      status: m.status,
      notes: m.notes || '',
    });
    setEditFormErrors({});
    setEditSuccessMessage(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    if (!editFormData.fullName.trim() || editFormData.fullName.trim().length < 2) {
      setEditFormErrors({ fullName: 'Họ tên hội viên phải có ít nhất 2 ký tự.' });
      return;
    }

    try {
      setIsSubmittingEdit(true);
      setEditFormErrors({});
      const res = await api.put(`/members/${editingMember.id}`, {
        fullName: editFormData.fullName.trim(),
        phone: editFormData.phone.trim(),
        gender: editFormData.gender,
        dateOfBirth: editFormData.dateOfBirth || undefined,
        status: editFormData.status,
        notes: editFormData.notes.trim() || undefined,
      });

      if (res.data?.success) {
        setEditSuccessMessage('Cập nhật thông tin hội viên thành công!');
        await fetchMembers();
        await fetchStats();
        setTimeout(() => {
          setIsEditModalOpen(false);
          setEditSuccessMessage(null);
          setEditingMember(null);
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setEditFormErrors({
        general: msg || 'Không thể cập nhật hội viên.',
      });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Banner nguồn dữ liệu và thao tác đầu trang */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Cơ sở dữ liệu GymPilot (Live API Backend)
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Đang đồng bộ
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Quản lý hồ sơ hội viên, tìm kiếm, phân trang và import hàng loạt bằng tệp CSV.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMembers}
              disabled={isLoading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Làm mới
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportModalOpen(true)}
              leftIcon={<Upload className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Import CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Thêm hội viên
            </Button>
          </div>
        </div>

        {/* 4 Cards Thống Kê Nhanh */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200/80 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng hội viên</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total || totalItems}</h3>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="bg-white border-slate-200/80 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Đang hoạt động</p>
                <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.active}</h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="bg-white border-slate-200/80 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tạm dừng (Paused)</p>
                <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{stats.paused}</h3>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="bg-white border-slate-200/80 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Hết hạn (Expired)</p>
                <h3 className="text-2xl font-extrabold text-red-600 mt-1">{stats.expired}</h3>
              </div>
              <div className="p-3 rounded-xl bg-red-50 text-red-600">
                <UserX className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Thanh Tìm Kiếm & Lọc Trạng Thái */}
        <Card className="bg-white border-slate-200/80 p-4 rounded-2xl shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo họ tên, SĐT, email..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Trạng thái:</span>
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
                {[
                  { key: 'ALL', label: 'Tất cả' },
                  { key: 'ACTIVE', label: 'Hoạt động' },
                  { key: 'PAUSED', label: 'Tạm dừng' },
                  { key: 'EXPIRED', label: 'Hết hạn' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleStatusFilterChange(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      statusFilter === tab.key
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Bảng Danh Sách Hội Viên */}
        <Card className="bg-white border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <LoadingSpinner size="lg" className="mx-auto" />
              <p className="text-sm text-slate-500">Đang tải danh sách hội viên...</p>
            </div>
          ) : error ? (
            <div className="p-8">
              <ErrorState title="Lỗi kết nối API" message={error} onRetry={fetchMembers} />
            </div>
          ) : members.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Không tìm thấy hội viên nào"
                description="Hãy thử đổi từ khóa tìm kiếm hoặc bấm thêm hội viên mới."
                actionLabel="Thêm hội viên"
                onAction={() => setIsAddModalOpen(true)}
              />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hội viên</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Gói tập đang dùng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Mã QR</TableHead>
                    <TableHead>Ngày tham gia</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                            {m.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{m.fullName}</p>
                            <p className="text-[11px] text-slate-500">
                              {m.gender} • {m.dateOfBirth ? m.dateOfBirth : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm font-medium text-slate-800">{m.phone}</p>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </TableCell>

                      <TableCell>
                        {m.activeMembership ? (
                          <div>
                            <p className="font-semibold text-xs text-slate-900">
                              {m.activeMembership.planName}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {m.activeMembership.sessionsLeft !== null
                                ? `Còn ${m.activeMembership.sessionsLeft} buổi`
                                : m.activeMembership.endDate
                                ? `Hạn đến ${m.activeMembership.endDate}`
                                : 'Vô thời hạn'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Chưa đăng ký gói</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            m.status === 'ACTIVE'
                              ? 'success'
                              : m.status === 'PAUSED'
                              ? 'warning'
                              : 'error'
                          }
                        >
                          {m.status === 'ACTIVE'
                            ? 'Hoạt động'
                            : m.status === 'PAUSED'
                            ? 'Tạm dừng'
                            : 'Hết hạn'}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                          <QrCode className="w-3 h-3 text-emerald-600" />
                          {m.qrToken ? m.qrToken.slice(0, 14) + '...' : '---'}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-slate-600">
                          {new Date(m.joinedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => navigate(`/owner/members/${m.id}`)}
                            title="Xem chi tiết hồ sơ"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(m)}
                            title="Chỉnh sửa hội viên"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Phân Trang Backend Synced */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
                <div>
                  Hiển thị{' '}
                  <strong className="text-slate-700">
                    {totalItems === 0 ? 0 : (page - 1) * limit + 1}
                  </strong>{' '}
                  -{' '}
                  <strong className="text-slate-700">
                    {Math.min(page * limit, totalItems)}
                  </strong>{' '}
                  trong tổng số <strong className="text-slate-700">{totalItems}</strong> hội viên
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || isLoading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                  >
                    Trước
                  </Button>

                  <span className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg">
                    {page} / {totalPages || 1}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || isLoading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Modal Form Thêm Hội Viên Mới */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormErrors({});
          setAddSuccessMessage(null);
        }}
        title="Thêm Hội Viên Mới"
        description="Nhập thông tin cá nhân và gói tập để tạo tài khoản hội viên mới vào database."
        maxWidth="lg"
      >
        {addSuccessMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{addSuccessMessage}</span>
          </div>
        )}

        {formErrors.general && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{formErrors.general}</span>
          </div>
        )}

        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Input
                label="Họ và tên"
                name="fullName"
                placeholder="VD: Nguyễn Hoàng Long"
                value={formData.fullName}
                onChange={handleInputChange}
                error={formErrors.fullName}
                isRequired
              />
            </div>
            <div>
              <Input
                label="Số điện thoại"
                name="phone"
                placeholder="VD: 0988776655"
                value={formData.phone}
                onChange={handleInputChange}
                error={formErrors.phone}
                isRequired
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Input
                label="Email đăng nhập"
                type="email"
                name="email"
                placeholder="VD: hoanglong@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={formErrors.email}
                isRequired
              />
            </div>
            <div>
              <Select
                label="Giới tính"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                options={[
                  { value: 'Nam', label: 'Nam' },
                  { value: 'Nữ', label: 'Nữ' },
                  { value: 'Khác', label: 'Khác' },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Select
                label="Chọn gói tập kích hoạt ngay (Tùy chọn)"
                name="planId"
                value={formData.planId}
                onChange={handleInputChange}
                options={[
                  { value: '', label: '-- Chưa mua gói --' },
                  ...plans.map((p) => ({
                    value: p.id,
                    label: `${p.name} (${new Intl.NumberFormat('vi-VN').format(p.price)}đ)`,
                  })),
                ]}
              />
            </div>
            <div>
              <Input
                label="Ngày sinh"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú thể trạng / Lưu ý
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="VD: Có tiền sử đau khớp cổ chân, mong muốn giảm mỡ tăng cơ..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmittingAdd}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmittingAdd}
              isLoading={isSubmittingAdd}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Lưu hội viên
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Form Chỉnh Sửa Hội Viên */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditFormErrors({});
          setEditSuccessMessage(null);
          setEditingMember(null);
        }}
        title="Chỉnh Sửa Thông Tin Hội Viên"
        description="Cập nhật thông tin cá nhân và trạng thái hoạt động của hội viên."
        maxWidth="lg"
      >
        {editSuccessMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{editSuccessMessage}</span>
          </div>
        )}

        {editFormErrors.general && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{editFormErrors.general}</span>
          </div>
        )}

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Input
                label="Họ và tên"
                name="fullName"
                value={editFormData.fullName}
                onChange={(e) => setEditFormData((p) => ({ ...p, fullName: e.target.value }))}
                error={editFormErrors.fullName}
                isRequired
              />
            </div>
            <div>
              <Input
                label="Số điện thoại"
                name="phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData((p) => ({ ...p, phone: e.target.value }))}
                isRequired
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <Select
                label="Giới tính"
                name="gender"
                value={editFormData.gender}
                onChange={(e) => setEditFormData((p) => ({ ...p, gender: e.target.value }))}
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
                value={editFormData.dateOfBirth}
                onChange={(e) => setEditFormData((p) => ({ ...p, dateOfBirth: e.target.value }))}
              />
            </div>
            <div>
              <Select
                label="Trạng thái"
                name="status"
                value={editFormData.status}
                onChange={(e) =>
                  setEditFormData((p) => ({
                    ...p,
                    status: e.target.value as 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED',
                  }))
                }
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
              value={editFormData.notes}
              onChange={(e) => setEditFormData((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Ghi chú về thể trạng..."
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
              Cập nhật
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Import CSV Hội Viên (T-2.6) */}
      <ImportCsvModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          fetchMembers();
          fetchStats();
        }}
      />
    </div>
  );
};

export default MembersPage;
