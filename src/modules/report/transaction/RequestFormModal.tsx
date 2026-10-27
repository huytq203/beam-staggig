import { Button, Modal, Spin } from '@douyinfe/semi-ui';
import { ReportService } from '@services/report';
import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';

const toPdfUrl = (base64: string) => {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
};

// Phiếu yêu cầu ứng lương của 1 giao dịch: đúng bytes PDF payment đã lưu, giống bản mobile hiển thị.
export const RequestFormModal = (props: any) => {
  const { transactionId, onClose } = props;
  const { data, isSuccess, isError } = useQuery(
    ['report-transaction-request-form', transactionId],
    () => ReportService.getTransactionRequestForm(transactionId),
    {
      enabled: !!transactionId,
      retry: false,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );
  const form = data?.data;
  const url = useMemo(
    () => (form?.pdfBase64 ? toPdfUrl(form.pdfBase64) : ''),
    [form?.pdfBase64]
  );
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  // Không có phiếu / không có quyền: axiosInstance đã báo lỗi, chỉ cần đóng modal.
  const failed = isError || (isSuccess && !form?.pdfBase64);
  useEffect(() => {
    if (failed) onClose();
  }, [failed]);

  const download = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = form?.fileName;
    link.click();
  };

  return (
    <Modal
      title={form?.title ?? 'Phiếu yêu cầu ứng lương'}
      visible={!!transactionId && !failed}
      onCancel={onClose}
      width={900}
      footer={
        <>
          <Button onClick={onClose}>Đóng</Button>
          <Button theme="solid" disabled={!url} onClick={download}>
            Tải xuống
          </Button>
        </>
      }
    >
      {url ? (
        <iframe
          title={form?.fileName}
          src={url}
          className="w-full h-[70vh] border-0"
        />
      ) : (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      )}
    </Modal>
  );
};
