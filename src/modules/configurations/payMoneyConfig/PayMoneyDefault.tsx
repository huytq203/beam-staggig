import { InputWrapper } from '@components/shared';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { IconHistory } from '@douyinfe/semi-icons';
import { useAuth } from '@contexts/authentication';
import {
  Button,
  Modal,
  Notification,
  Radio,
  RadioGroup,
  Switch,
  Typography,
} from "@douyinfe/semi-ui";
import { PaymentSendingMethodService } from '@services/payment-sending-method';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
export const PayMoneyDefault = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [enabledBanks, setEnabledBanks] = useState<any>({});
  const [tempBankCode, setTempBankCode] = useState<any>(null);
  const [tempEnable, setTempEnable] = useState<any>(null);
  const { Text } = Typography;

  const { authCheckByRole, profile } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CUSTOMER_SERVICE,
    UserRole.RECONCILER,
    UserRole.SALE,
    UserRole.CONTROLLER,
  ]);
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      data: '',
    },
  });
  const router = useRouter();

  const { data } = useQuery('bankCode', () =>
    PaymentSendingMethodService.getPayMoneyMethidDefault({})
  );

  const { data: getEnableBank } = useQuery('getEnableBank', () =>
    PaymentSendingMethodService.getEnableBankPaymentSendingMethod({})
  );

  const bankCode = data?.data?.bankCode;

  const bankNames: { [key: string]: string } = {
    VPBANK: 'VPBank',
    PVCOMBANK: 'PVcomBank',
    VIETCOMBANK: 'VietcomBank',
  };

  const handleChangeBank = (value: any) => {
    setSelectedBank(value);
    setIsModalVisible(true);
  };

  const handleConfirmChange = async () => {
    if (selectedBank) {
      try {
        const response =
          await PaymentSendingMethodService.updatePayMoneyMethidDefault(
            selectedBank
          );
        Notification.success({
          title: 'Thành công',
          content: 'Cập nhật ngân hàng mặc định thành công!',
          duration: 3,
          theme: 'light',
        });
        setValue('data', selectedBank);
        setIsModalVisible(false);
      } catch (error) {
        Notification.error({
          title: 'Error',
          content: 'Áp dụng không thành công!',
          duration: 3,
          theme: 'light',
        });
      }
    }
  };

  const handleEnableBank = async (bankCode: any, enable: any) => {
    try {
      const response =
        await PaymentSendingMethodService.enableBankUpdatePaymentSendingMethod(
          bankCode,
          enable
        );
      Notification.success({
        title: 'Thành công',
        content: `Cập nhật trạng thái ngân hàng ${bankCode} thành công!`,
        duration: 3,
        theme: 'light',
      });
      setEnabledBanks((prevState: any) => ({
        ...prevState,
        [bankCode]: enable,
      }));
    } catch (error) {
      Notification.error({
        title: 'Error',
        content: `Không thể cập nhật trạng thái ngân hàng ${bankCode}. Vui lòng thử lại.`,
        duration: 3,
        theme: 'light',
      });
    }
  };

  const handleSwitchChange = (bankCode: any, enable: any) => {
    setTempBankCode(bankCode);
    setTempEnable(enable);
    setConfirmationModalVisible(true);
  };

  const confirmEnableBankChange = async () => {
    if (tempBankCode !== null && tempEnable !== null) {
      await handleEnableBank(tempBankCode, tempEnable);
      setConfirmationModalVisible(false);
    }
  };

  const getDisableRole = () => {
    if (profile?.roles[0] === UserRole.BEAM_ADMIN) {
      return false;
    }
    return true;
  };

  return (
    <div>
      <div className="flex flex-row justify-between space-x-8">
        <InputWrapper
          field="data"
          label="Ngân hàng mặc định"
          component={(field: any) => (
            <RadioGroup
              aria-label="Chọn ngân hàng mặc định"
              name="bank-radio-group"
              className="flex flex-col space-y-2"
              value={getValues('data') || bankCode}
              onChange={(event) => handleChangeBank(event.target.value)}
              disabled={getDisableRole()}
            >
              {['VPBANK', 'PVCOMBANK', 'VIETCOMBANK'].map((bank) => (
                <div key={bank} className="flex items-center space-x-2">
                  <Radio value={bank}>{bankNames[bank]}</Radio>
                </div>
              ))}
            </RadioGroup>
          )}
          errors={errors}
          control={control}
        />

        <InputWrapper
          field="enabled"
          label="Cấu hình hoạt động"
          component={(field: any) => (
            <div className="flex flex-col space-y-4">
              {['VPBANK', 'PVCOMBANK', 'VIETCOMBANK'].map((bank) => {
                const isEnabled =
                  enabledBanks[bank] ??
                  getEnableBank?.data?.find(
                    (item: any) => item.bankCode === bank
                  )?.enabled;

                return (
                  <div key={bank} className="flex items-center space-x-2">
                    <Switch
                      className="ml-2"
                      checked={isEnabled}
                      onChange={(checked) => handleSwitchChange(bank, checked)}
                      disabled={getDisableRole()}
                    />
                  </div>
                );
              })}
            </div>
          )}
          errors={errors}
          control={control}
        />
        <div className="flex flex-col justify-end">
        <Button
          theme="solid"
          type="secondary"
          onClick={() => router.push(`/change-log/PaymentSendingMethodDefault/d769e094-5ee1-4929-93d9-462d9c3f7b63`)}
          icon={<IconHistory />}
        >
          Lịch sử chỉnh sửa
        </Button>
        </div>
      </div>

      <ProtectedWrapper
        allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
      >
        <Modal
          title="Xác nhận thay đổi ngân hàng mặc định"
          visible={isModalVisible}
          onOk={handleConfirmChange}
          onCancel={() => setIsModalVisible(false)}
        >
          <p>
            Bạn có muốn chuyển ngân hàng mặc định sang {''}
            {selectedBank ? bankNames[selectedBank] : ''} không?
          </p>
        </Modal>
        <Modal
          title="Xác nhận thay đổi trạng thái ngân hàng"
          visible={confirmationModalVisible}
          onOk={confirmEnableBankChange}
          onCancel={() => setConfirmationModalVisible(false)}
        >
          <p>
            Bạn có chắc chắn muốn thay đổi trạng thái cho ngân hàng {''}
            {tempBankCode} ?
          </p>
        </Modal>
      </ProtectedWrapper>
    </div>
  );
};
