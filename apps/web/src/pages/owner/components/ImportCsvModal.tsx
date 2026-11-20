import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  FileSpreadsheet,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { api } from '@/lib/axios';
import { Modal, Button, LoadingSpinner } from '@/components/ui';

export interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PreviewRow {
  row: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  notes: string;
  isValid: boolean;
  errors: string[];
}

interface RowError {
  row: number;
  field: string;
  message: string;
}

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [isSubmittingImport, setIsSubmittingImport] = useState<boolean>(false);
  const [step, setStep] = useState<'UPLOAD' | 'PREVIEW' | 'PROGRESS' | 'DONE'>('UPLOAD');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preview data
  const [totalRows, setTotalRows] = useState<number>(0);
  const [validCount, setValidCount] = useState<number>(0);
  const [invalidCount, setInvalidCount] = useState<number>(0);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [rowErrors, setRowErrors] = useState<RowError[]>([]);

  // Import result
  const [importResult, setImportResult] = useState<{
    totalSubmitted: number;
    importedCount: number;
    failedCount: number;
    errors: Array<{ row: number; email: string; message: string }>;
  } | null>(null);

  const resetModalState = () => {
    setSelectedFile(null);
    setCsvContent('');
    setErrorMsg(null);
    setStep('UPLOAD');
    setPreviewRows([]);
    setRowErrors([]);
    setImportResult(null);
  };

  const handleClose = () => {
    resetModalState();
    onClose();
  };

  // 1. Tải Template CSV mẫu
  const handleDownloadTemplate = async () => {
    try {
      const res = await api.get('/members/template-csv', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'gympilot_member_template.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback client download if API unreachable
      const sampleCsv =
        '\uFEFF' +
        'Họ và tên,Email,Số điện thoại,Giới tính,Ngày sinh (YYYY-MM-DD),Ghi chú\n' +
        'Nguyễn Văn An,nguyenvanan@gmail.com,0901234567,Nam,1995-05-15,Hội viên mới\n' +
        'Trần Thị Mai,tranmai@gmail.com,0987654321,Nữ,1998-08-20,Tập Yoga sáng\n' +
        'Lê Hoàng Long,hoanglong@gmail.com,0912345678,Nam,1992-12-01,Tập Gym tăng cơ';

      const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'gympilot_member_template.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 2. Chọn File CSV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setErrorMsg('Vui lòng chọn tập tin có định dạng .csv');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Kích thước tập tin không được vượt quá 5MB.');
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
    };
    reader.readAsText(file, 'UTF-8');
  };

  // 3. Xem trước và kiểm tra cấu trúc CSV (Preview)
  const handlePreview = async () => {
    if (!csvContent || !csvContent.trim()) {
      setErrorMsg('Tập tin CSV không có nội dung.');
      return;
    }

    try {
      setIsLoadingPreview(true);
      setErrorMsg(null);

      const res = await api.post('/members/import-preview', {
        csvContent,
      });

      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        setTotalRows(d.totalRows);
        setValidCount(d.validCount);
        setInvalidCount(d.invalidCount);
        setPreviewRows(d.previewRows || []);
        setRowErrors(d.errors || []);
        setStep('PREVIEW');
      } else {
        throw new Error(res.data?.message || 'Không thể đọc cấu trúc tệp CSV');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMsg(msg || (err instanceof Error ? err.message : 'Lỗi khi kiểm tra dữ liệu CSV.'));
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // 4. Tiến hành Import các dòng hợp lệ vào Database
  const handleConfirmImport = async () => {
    const validRowsToSubmit = previewRows
      .filter((r) => r.isValid)
      .map((r) => ({
        fullName: r.fullName,
        email: r.email,
        phone: r.phone || undefined,
        gender: r.gender,
        dateOfBirth: r.dateOfBirth || undefined,
        notes: r.notes || undefined,
      }));

    if (validRowsToSubmit.length === 0) {
      setErrorMsg('Không có dòng dữ liệu hợp lệ nào để import.');
      return;
    }

    try {
      setIsSubmittingImport(true);
      setStep('PROGRESS');
      setErrorMsg(null);

      const res = await api.post('/members/import', {
        rows: validRowsToSubmit,
      });

      if (res.data?.success && res.data?.data) {
        setImportResult(res.data.data);
        setStep('DONE');
        onSuccess();
      } else {
        throw new Error(res.data?.message || 'Lỗi khi import dữ liệu');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMsg(msg || (err instanceof Error ? err.message : 'Import thất bại. Vui lòng thử lại.'));
      setStep('PREVIEW');
    } finally {
      setIsSubmittingImport(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Danh Sách Hội Viên (CSV)"
      description="Tải lên danh sách hội viên hàng loạt từ tệp CSV theo chuẩn hệ thống GymPilot."
      maxWidth="xl"
    >
      <div className="space-y-5">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{errorMsg}</div>
          </div>
        )}

        {/* STEP 1: UPLOAD */}
        {step === 'UPLOAD' && (
          <div className="space-y-4">
            {/* Template Download Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Chưa có tệp mẫu?</p>
                  <p className="text-slate-500 text-[11px]">Tải mẫu CSV chuẩn UTF-8 tương thích tiếng Việt &amp; Excel</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:border-emerald-300"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Tải file mẫu
              </Button>
            </div>

            {/* Drag & Drop Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20 rounded-2xl p-8 text-center cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1">
                Kéo thả tệp CSV vào đây hoặc bấm để chọn tệp
              </p>
              <p className="text-xs text-slate-400">
                Chỉ hỗ trợ tệp định dạng .csv (tối đa 5MB)
              </p>
            </div>

            {/* Selected File Card */}
            {selectedFile && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-xs">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-950">{selectedFile.name}</span>
                  <span className="text-emerald-700">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setCsvContent('');
                  }}
                  className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Hủy bỏ
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!selectedFile || isLoadingPreview}
                onClick={handlePreview}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs"
              >
                {isLoadingPreview ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-1.5" />
                    Đang kiểm tra tệp...
                  </>
                ) : (
                  <>
                    <span>Xem trước dữ liệu</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW */}
        {step === 'PREVIEW' && (
          <div className="space-y-4">
            {/* Stat Counters */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="block text-[11px] text-slate-500 font-semibold uppercase">Tổng số dòng</span>
                <span className="block text-xl font-extrabold text-slate-900 mt-0.5">{totalRows}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="block text-[11px] text-emerald-700 font-semibold uppercase">Hợp lệ</span>
                <span className="block text-xl font-extrabold text-emerald-600 mt-0.5">{validCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center">
                <span className="block text-[11px] text-red-700 font-semibold uppercase">Không hợp lệ</span>
                <span className="block text-xl font-extrabold text-red-600 mt-0.5">{invalidCount}</span>
              </div>
            </div>

            {/* Error alerts list if any */}
            {rowErrors.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 max-h-36 overflow-y-auto space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Danh sách lỗi cần lưu ý ({rowErrors.length} lỗi):</span>
                </div>
                {rowErrors.map((err, idx) => (
                  <p key={idx} className="text-amber-800 text-[11px]">
                    • <strong>Dòng {err.row}:</strong> {err.message}
                  </p>
                ))}
              </div>
            )}

            {/* Preview Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold sticky top-0">
                  <tr>
                    <th className="p-2.5">Trạng thái</th>
                    <th className="p-2.5">Họ tên</th>
                    <th className="p-2.5">Email</th>
                    <th className="p-2.5">SĐT</th>
                    <th className="p-2.5">Giới tính</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {previewRows.map((row) => (
                    <tr key={row.row} className={row.isValid ? '' : 'bg-red-50/50'}>
                      <td className="p-2.5">
                        {row.isValid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Hợp lệ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                            <AlertCircle className="w-3 h-3" /> Lỗi
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-medium text-slate-900">{row.fullName || '—'}</td>
                      <td className="p-2.5 text-slate-600">{row.email}</td>
                      <td className="p-2.5 text-slate-600">{row.phone || '—'}</td>
                      <td className="p-2.5 text-slate-600">{row.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setStep('UPLOAD')}>
                Chọn tệp khác
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={validCount === 0 || isSubmittingImport}
                onClick={handleConfirmImport}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs"
              >
                Xác nhận Import ({validCount} hội viên hợp lệ)
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: PROGRESS */}
        {step === 'PROGRESS' && (
          <div className="py-8 text-center space-y-4">
            <LoadingSpinner size="lg" className="mx-auto" />
            <div>
              <p className="text-sm font-bold text-slate-900">Đang lưu dữ liệu hội viên vào hệ thống...</p>
              <p className="text-xs text-slate-500 mt-1">Quá trình này có thể mất vài giây đối với danh sách lớn.</p>
            </div>
          </div>
        )}

        {/* STEP 4: DONE */}
        {step === 'DONE' && importResult && (
          <div className="py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">Import hoàn tất thành công!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Đã thêm thành công <strong>{importResult.importedCount}</strong> / {importResult.totalSubmitted} hội viên vào hệ thống.
              </p>
            </div>

            {importResult.failedCount > 0 && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
                <p className="font-bold">Các dòng bỏ qua ({importResult.failedCount}):</p>
                {importResult.errors.map((err, i) => (
                  <p key={i} className="text-[11px] text-red-700">
                    • Dòng {err.row} ({err.email}): {err.message}
                  </p>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleClose}
                className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs"
              >
                Hoàn tất &amp; Xem danh sách hội viên
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImportCsvModal;
