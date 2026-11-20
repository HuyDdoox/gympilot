import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  RefreshCw,
  Edit,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { api } from '@/lib/axios';
import { formatVND } from '@/lib/utils';
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

export interface PlanItem {
  id: string;
  name: string;
  type: 'MONTHLY' | 'QUARTERLY' | 'SESSION_PACK' | 'DROP_IN';
  price: number;
  durationDays: number | null;
  totalSessions: number | null;
  description: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [addSuccessMsg, setAddSuccessMsg] = useState<string | null>(null);
  const [addFormErrors, setAddFormErrors] = useState<Record<string, string>>({});
  const [addForm, setAddForm] = useState({
    name: '',
    type: 'MONTHLY' as PlanItem['type'],
    price: '',
    durationDays: '30',
    totalSessions: '',
    description: '',
  });

  // Edit Modal State
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
  const [editForm, setEditForm] = useState({
    name: '',
    type: 'MONTHLY' as PlanItem['type'],
    price: '',
    durationDays: '',
    totalSessions: '',
    description: '',
    isActive: true,
  });

  // Fetch plans from API
  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/plans');
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setPlans(res.data.data);
      } else {
        setPlans([]);
      }
    } catch (err: unknown) {
      console.error('Lỗi khi tải danh sách gói tập:', err);
      setError(err instanceof Error ? err.message : 'Không thể kết nối API gói tập.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Filtered plans
  const filteredPlans = plans.filter((p) => {
    const matchType = selectedType === 'ALL' || p.type === selectedType;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchType && matchSearch;
  });

  // Validate Add Form
  const validateAddForm = () => {
    const errors: Record<string, string> = {};
    if (!addForm.name.trim() || addForm.name.trim().length < 2) {
      errors.name = 'Tên gói tập phải có ít nhất 2 ký tự.';
    }
    const priceNum = Number(addForm.price);
    if (!addForm.price || isNaN(priceNum) || priceNum < 0) {
      errors.price = 'Giá gói tập không hợp lệ (>= 0 đ).';
    }
    setAddFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add Form
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddForm()) return;

    try {
      setIsSubmittingAdd(true);
      setAddFormErrors({});
      const res = await api.post('/plans', {
        name: addForm.name.trim(),
        type: addForm.type,
        price: Number(addForm.price),
        durationDays: addForm.durationDays ? Number(addForm.durationDays) : null,
        totalSessions: addForm.totalSessions ? Number(addForm.totalSessions) : null,
        description: addForm.description.trim() || null,
      });

      if (res.data?.success) {
        setAddSuccessMsg(`Đã tạo thành công gói tập "${addForm.name}"!`);
        await fetchPlans();
        setTimeout(() => {
          setIsAddModalOpen(false);
          setAddSuccessMsg(null);
          setAddForm({
            name: '',
            type: 'MONTHLY',
            price: '',
            durationDays: '30',
            totalSessions: '',
            description: '',
          });
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setAddFormErrors({ general: msg || 'Không thể tạo gói tập mới.' });
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (plan: PlanItem) => {
    setEditingPlan(plan);
    setEditForm({
      name: plan.name,
      type: plan.type,
      price: String(plan.price),
      durationDays: plan.durationDays ? String(plan.durationDays) : '',
      totalSessions: plan.totalSessions ? String(plan.totalSessions) : '',
      description: plan.description || '',
      isActive: plan.isActive,
    });
    setEditFormErrors({});
    setEditSuccessMsg(null);
  };

  // Submit Edit Form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    if (!editForm.name.trim() || editForm.name.trim().length < 2) {
      setEditFormErrors({ name: 'Tên gói tập phải có ít nhất 2 ký tự.' });
      return;
    }

    try {
      setIsSubmittingEdit(true);
      setEditFormErrors({});
      const res = await api.put(`/plans/${editingPlan.id}`, {
        name: editForm.name.trim(),
        type: editForm.type,
        price: Number(editForm.price),
        durationDays: editForm.durationDays ? Number(editForm.durationDays) : null,
        totalSessions: editForm.totalSessions ? Number(editForm.totalSessions) : null,
        description: editForm.description.trim() || null,
        isActive: editForm.isActive,
      });

      if (res.data?.success) {
        setEditSuccessMsg('Cập nhật gói tập thành công!');
        await fetchPlans();
        setTimeout(() => {
          setEditingPlan(null);
          setEditSuccessMsg(null);
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setEditFormErrors({ general: msg || 'Không thể cập nhật gói tập.' });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Toggle Plan Status (Deactivate / Reactivate)
  const handleToggleActive = async (plan: PlanItem) => {
    try {
      await api.put(`/plans/${plan.id}`, {
        isActive: !plan.isActive,
      });
      await fetchPlans();
    } catch (err) {
      console.error('Lỗi khi đổi trạng thái gói tập:', err);
    }
  };

  const getTypeBadge = (type: PlanItem['type']) => {
    switch (type) {
      case 'MONTHLY':
        return <Badge variant="info">Theo Tháng</Badge>;
      case 'QUARTERLY':
        return <Badge variant="success">Theo Quý / Năm</Badge>;
      case 'SESSION_PACK':
        return <Badge variant="warning">Gói Buổi</Badge>;
      case 'DROP_IN':
        return <Badge variant="neutral">Tập Lẻ (Drop-in)</Badge>;
    }
  };

  const totalCount = plans.length;
  const activeCount = plans.filter((p) => p.isActive).length;
  const sessionCount = plans.filter((p) => p.type === 'SESSION_PACK').length;
  const periodCount = plans.filter((p) => p.type === 'MONTHLY' || p.type === 'QUARTERLY').length;

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Quản lý gói tập &amp; Hội viên
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Thiết lập biểu phí, thời hạn và số buổi tập cho các lớp Yoga, Pilates và Gym
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPlans}
              disabled={isLoading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Làm mới
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Tạo gói tập mới
            </Button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng số gói</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</h3>
          </Card>

          <Card className="bg-white border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đang mở bán</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{activeCount}</h3>
          </Card>

          <Card className="bg-white border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gói theo thời gian</p>
            <h3 className="text-2xl font-extrabold text-blue-600 mt-1">{periodCount}</h3>
          </Card>

          <Card className="bg-white border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gói theo lượt buổi</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{sessionCount}</h3>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <Card className="bg-white border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên gói tập hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { key: 'ALL', label: 'Tất cả' },
                { key: 'MONTHLY', label: 'Theo Tháng' },
                { key: 'QUARTERLY', label: 'Theo Quý/Năm' },
                { key: 'SESSION_PACK', label: 'Gói Buổi' },
                { key: 'DROP_IN', label: 'Tập Lẻ' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedType(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedType === tab.key
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Plans Table */}
        <Card className="bg-white border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <LoadingSpinner size="lg" className="mx-auto" />
              <p className="text-sm text-slate-500">Đang tải biểu phí gói tập...</p>
            </div>
          ) : error ? (
            <div className="p-8">
              <ErrorState title="Lỗi kết nối API" message={error} onRetry={fetchPlans} />
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Không tìm thấy gói tập nào"
                description="Hãy thử đổi từ khóa tìm kiếm hoặc tạo gói tập mới."
                actionLabel="Tạo gói tập"
                onAction={() => setIsAddModalOpen(true)}
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên gói tập</TableHead>
                  <TableHead>Loại gói</TableHead>
                  <TableHead className="text-right">Đơn giá (VNĐ)</TableHead>
                  <TableHead>Thời hạn / Số buổi</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{plan.name}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {plan.description || 'Chưa có mô tả chi tiết'}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>{getTypeBadge(plan.type)}</TableCell>

                    <TableCell className="text-right font-extrabold text-emerald-600 text-sm">
                      {formatVND(plan.price)}
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-slate-700">
                        {plan.durationDays && <span>{plan.durationDays} ngày</span>}
                        {plan.durationDays && plan.totalSessions && <span> • </span>}
                        {plan.totalSessions && (
                          <strong className="text-emerald-700">{plan.totalSessions} buổi</strong>
                        )}
                        {!plan.durationDays && !plan.totalSessions && (
                          <span className="text-slate-400 italic">Vô thời hạn</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => handleToggleActive(plan)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
                          plan.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                        }`}
                        title="Bấm để đổi trạng thái"
                      >
                        {plan.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{plan.isActive ? 'Đang mở bán' : 'Ngưng bán'}</span>
                      </button>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => handleOpenEdit(plan)}
                          title="Chỉnh sửa gói tập"
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
          )}
        </Card>
      </div>

      {/* Modal Tạo Gói Tập Mới */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddFormErrors({});
          setAddSuccessMsg(null);
        }}
        title="Tạo Gói Tập Mới"
        description="Nhập thông tin biểu phí và số buổi để niêm yết gói tập trên hệ thống."
        maxWidth="lg"
      >
        {addSuccessMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{addSuccessMsg}</span>
          </div>
        )}

        {addFormErrors.general && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{addFormErrors.general}</span>
          </div>
        )}

        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Input
                label="Tên gói tập"
                placeholder="VD: Gói Pilates 15 Buổi Kèm PT"
                value={addForm.name}
                onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                error={addFormErrors.name}
                isRequired
              />
            </div>
            <div>
              <Select
                label="Loại gói tập"
                value={addForm.type}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, type: e.target.value as PlanItem['type'] }))
                }
                options={[
                  { value: 'MONTHLY', label: 'Theo Tháng (Monthly)' },
                  { value: 'QUARTERLY', label: 'Theo Quý / Năm (Quarterly)' },
                  { value: 'SESSION_PACK', label: 'Gói Theo Buổi (Session Pack)' },
                  { value: 'DROP_IN', label: 'Tập Lẻ Từng Buổi (Drop-in)' },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <Input
                label="Đơn giá (VNĐ)"
                type="number"
                placeholder="VD: 1500000"
                value={addForm.price}
                onChange={(e) => setAddForm((p) => ({ ...p, price: e.target.value }))}
                error={addFormErrors.price}
                isRequired
              />
            </div>
            <div>
              <Input
                label="Thời hạn (Số ngày)"
                type="number"
                placeholder="VD: 30"
                value={addForm.durationDays}
                onChange={(e) => setAddForm((p) => ({ ...p, durationDays: e.target.value }))}
              />
            </div>
            <div>
              <Input
                label="Số buổi tập (Nếu có)"
                type="number"
                placeholder="VD: 15"
                value={addForm.totalSessions}
                onChange={(e) => setAddForm((p) => ({ ...p, totalSessions: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả quyền lợi gói tập
            </label>
            <textarea
              rows={3}
              value={addForm.description}
              onChange={(e) => setAddForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Ghi chú về quyền lợi phòng tắm, tủ đồ, lớp tập áp dụng..."
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
              Lưu gói tập
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Chỉnh Sửa Gói Tập */}
      {editingPlan && (
        <Modal
          isOpen={Boolean(editingPlan)}
          onClose={() => {
            setEditingPlan(null);
            setEditFormErrors({});
            setEditSuccessMsg(null);
          }}
          title="Chỉnh Sửa Gói Tập"
          description="Cập nhật biểu phí, số buổi hoặc chuyển đổi trạng thái kinh doanh của gói."
          maxWidth="lg"
        >
          {editSuccessMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{editSuccessMsg}</span>
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
                  label="Tên gói tập"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  error={editFormErrors.name}
                  isRequired
                />
              </div>
              <div>
                <Select
                  label="Loại gói tập"
                  value={editForm.type}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, type: e.target.value as PlanItem['type'] }))
                  }
                  options={[
                    { value: 'MONTHLY', label: 'Theo Tháng (Monthly)' },
                    { value: 'QUARTERLY', label: 'Theo Quý / Năm (Quarterly)' },
                    { value: 'SESSION_PACK', label: 'Gói Theo Buổi (Session Pack)' },
                    { value: 'DROP_IN', label: 'Tập Lẻ Từng Buổi (Drop-in)' },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <Input
                  label="Đơn giá (VNĐ)"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                  isRequired
                />
              </div>
              <div>
                <Input
                  label="Thời hạn (Ngày)"
                  type="number"
                  value={editForm.durationDays}
                  onChange={(e) => setEditForm((p) => ({ ...p, durationDays: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  label="Số buổi tập"
                  type="number"
                  value={editForm.totalSessions}
                  onChange={(e) => setEditForm((p) => ({ ...p, totalSessions: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả</label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="editIsActive"
                checked={editForm.isActive}
                onChange={(e) => setEditForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="editIsActive" className="text-xs font-semibold text-slate-700 select-none">
                Mở bán cho hội viên (Đang kích hoạt)
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingPlan(null)}
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
                Cập nhật gói tập
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PlansPage;
