import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { IconExport } from '@douyinfe/semi-icons';
import { Button, DatePicker, Select } from '@douyinfe/semi-ui';

const ReconciliationBankFilter = (props: any) => {
  const {
    title,
    type,
    onFilterBank,
    onFilterTransaction,
    onFilterTransactionTicket,
    onClickUpdateButton,
  } = props;
  return (
    <div className="flex justify-between items-center">
      <div className="text-xl font-bold">{title}</div>
      {type == 1 && (
        <div className="flex items-center gap-5">
          <Select
            size="large"
            defaultValue="0"
            style={{ width: 200 }}
            onChange={(values: any) => {
              return onFilterBank(values);
            }}
          >
            <Select.Option value="0">Đối soát ngày</Select.Option>
            <Select.Option value="1">Đối soát tháng</Select.Option>
          </Select>
          <DatePicker
            size="large"
            disabled
            type="dateTime"
            format="dd/MM/yyyy HH:mm:ss"
            insetLabel="Thời gian"
            defaultValue={new Date()}
          />
          <ProtectedWrapper
            allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
          >
            <Button theme="solid">Upload file</Button>
          </ProtectedWrapper>
        </div>
      )}
      {type == 2 && (
        <div className="flex items-center gap-5">
          <ProtectedWrapper
            allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
          >
            <Button theme="solid" icon={<IconExport />} iconPosition="right">
              Xuất file báo cáo
            </Button>
          </ProtectedWrapper>
        </div>
      )}
      {type == 3 && (
        <div className="flex items-center gap-5">
          <Select
            size="large"
            defaultValue="0"
            style={{ width: 150 }}
            onChange={(values: any) => {
              return onFilterTransactionTicket(values);
            }}
          >
            <Select.Option value="0">Chờ duyệt</Select.Option>
            <Select.Option value="1">Duyệt</Select.Option>
            <Select.Option value="2">Từ chối</Select.Option>
          </Select>
          <ProtectedWrapper
            allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
          >
            <Button theme="solid" icon={<IconExport />} iconPosition="right">
              Xuất file báo cáo
            </Button>
            <Button theme="solid" onClick={() => onClickUpdateButton(null)}>
              Cập nhật
            </Button>
          </ProtectedWrapper>
        </div>
      )}
    </div>
  );
};

export default ReconciliationBankFilter;
