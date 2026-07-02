import { Button, Modal, Notification } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { DebtForm } from './DebtForm';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { DebtService } from '@services/debt-cash';

const AddNewDebtButton = (props: any) => {
  const { setIsOpenModal, isOpenModal, filter, refetch } = props;
  const [loading, setLoading] = useState(false);
  const onOpenPicker = () => {
    setIsOpenModal(true);
  };

  const onClosePicker = () => {
    setIsOpenModal(false);
  };
  const onCreate = (values: any) => {
    const salaryPeriod = values?.salaryPeriod
      ? values?.salaryPeriod.split('|')
      : '|';

    const requestParams = {
      ...values,
      expiredDate: DateTimeHelper.formatDateTime(
        values.expiredDate,
        COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
      ),
      description: FunctionBase.checkTypeofVal(values.description, 'string')
        ? values.description.trim()
        : null,
      savedDate: DateTimeHelper.formatDateTime(
        values.savedDate,
        COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
      ),
      salaryPeriodStart: salaryPeriod[0],
      salaryPeriodEnd: salaryPeriod[1],
    };
    DebtService.createDebt(requestParams).then((response: any) => {
      if (response) {
        Notification.success({
          content: `Tạo mới bút hạch toán thành công!`,
          theme: 'light',
        });
        setIsOpenModal(false);
        filter != null && refetch();
      }
      setLoading(false);
    });
  };

  return (
    <>
      <ProtectedWrapper
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.ACCOUNTANT,
        ]}
      >
        <Button onClick={onOpenPicker} theme="solid">
          Thêm mới
        </Button>
      </ProtectedWrapper>

      <Modal
        visible={isOpenModal}
        onCancel={onClosePicker}
        title="Bút toán hạch toán"
        footer={['']}
      >
        <DebtForm
          onSubmit={onCreate}
          onCancel={onClosePicker}
          loading={loading}
          filter={filter}
        />
      </Modal>
    </>
  );
};

export default AddNewDebtButton;
