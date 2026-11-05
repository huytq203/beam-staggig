import { Button, Modal, Notification, Skeleton, Tag } from '@douyinfe/semi-ui';
import { CompanyService } from '@services/companies/company.service';
import { useCallback, useEffect, useState } from 'react';

type PayoutChannel = 'LEGACY_BANK' | 'FLEXPAY_V2';

interface PayoutChannelData {
  companyId: string;
  payoutChannel: PayoutChannel | null;
  effectivePayoutChannel: PayoutChannel | null;
  locked: boolean;
}

const LABELS: Record<PayoutChannel, string> = {
  LEGACY_BANK: 'Chuyển khoản ngân hàng (kênh cũ của Beam)',
  FLEXPAY_V2: 'Chi hộ qua FlexPay (TGTT)',
};

/**
 * Kênh chi tiền ứng lương của doanh nghiệp (core `company.payout_channel`).
 * Chưa cấu hình = theo cấu hình cũ trên máy chủ payment. Công ty kênh FPT Pay luôn chi qua FlexPay, không đổi được.
 * Chỉ hiển thị cho super_admin / beam_admin (bọc bằng ProtectedWrapper ở trang thông tin doanh nghiệp).
 */
export const CompanyPayoutChannel = ({ companyId }: { companyId: string }) => {
  const [data, setData] = useState<PayoutChannelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (!companyId) return;
    setLoading(true);
    CompanyService.getPayoutChannel(companyId)
      .then((value: PayoutChannelData) => setData(value ?? null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [companyId]);

  useEffect(() => {
    load();
  }, [load]);

  const change = (next: PayoutChannel) => {
    Modal.confirm({
      title: 'Đổi kênh chi tiền ứng lương',
      cancelText: 'Huỷ',
      okText: 'Đổi kênh',
      content: `Các khoản ứng mới của doanh nghiệp sẽ được chi qua: ${LABELS[next]}. Khoản đang xử lý vẫn giữ kênh cũ. Bạn có chắc chắn?`,
      onOk: async () => {
        setSaving(true);
        try {
          const response = await CompanyService.updatePayoutChannel(companyId, next);
          if (response?.code == 200) {
            Notification.success({ content: 'Đã đổi kênh chi tiền ứng lương', theme: 'light' });
            setData(response.data);
          } else {
            Notification.error({ content: 'Đổi kênh chi tiền ứng lương thất bại', theme: 'light' });
          }
        } catch (e: any) {
          const code = e?.response?.data?.message;
          Notification.error({
            content:
              code === 'PAYOUT_CHANNEL_LOCKED'
                ? 'Doanh nghiệp kênh FPT Pay bắt buộc chi qua FlexPay'
                : 'Đổi kênh chi tiền ứng lương thất bại',
            theme: 'light',
          });
        } finally {
          setSaving(false);
        }
      },
    });
  };

  if (loading) return <Skeleton.Paragraph rows={2} />;
  if (!data) return <span>Không tải được kênh chi tiền ứng lương</span>;

  const effective = data.effectivePayoutChannel;
  const next: PayoutChannel = effective === 'FLEXPAY_V2' ? 'LEGACY_BANK' : 'FLEXPAY_V2';

  return (
    <div className="flex flex-col gap-3">
      <div className="font-bold">Kênh chi tiền ứng lương</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        <div>
          <label>Kênh đang dùng:</label>
        </div>
        <div className="col-span-2 flex items-center gap-2 flex-wrap">
          {effective ? (
            <Tag color={effective === 'FLEXPAY_V2' ? 'green' : 'blue'}>{LABELS[effective]}</Tag>
          ) : (
            <Tag color="grey">Chưa cấu hình (theo cấu hình cũ của hệ thống)</Tag>
          )}
          {data.locked ? (
            <span className="text-gray-500">Doanh nghiệp kênh FPT Pay luôn chi qua FlexPay</span>
          ) : (
            <Button loading={saving} onClick={() => change(next)}>
              Chuyển sang {next === 'FLEXPAY_V2' ? 'chi hộ qua FlexPay' : 'chuyển khoản ngân hàng'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
