import { InputWrapper } from '@components/shared';
import { CompanySelect } from '@components/widgets';
import { UserRole } from '@constants/auth.constants';
import {
  listBankcode,
  listStatusPayMoneySetup,
} from '@constants/select-options.constants';
import { useAuth } from '@contexts/authentication';
import {
  Button,
  DatePicker,
  Modal,
  Notification,
  Select,
  Switch,
} from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaymentSendingMethodService } from '@services/payment-sending-method';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { CreatePayMoney } from 'validations/CreatePayMoney';

export const PayMoneySetUp = (props: any) => {
  const { onCancel, isNew, setCheckData, payMoneyId } = props;

  const { authCheckByRole } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreatePayMoney),
    defaultValues: {
      bankCode: 'VPBANK',
      companyIds: [],
      appliedAll: false,
      endAppliedDate: '',
      startAppliedDate: '',
      status: 'ACTIVE',
      isNew: isNew,
      selectAll: false,
    },
  });

  const { data, isFetching, isLoading } = useQuery(
    ['pay_money_detail', payMoneyId],
    () => PaymentSendingMethodService.getPayMoneyDefault(payMoneyId),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  useEffect(() => {
    if (!isLoading && !isNew && data?.data) {
      reset({
        bankCode: data.data.bankCode,
        companyIds: data.data.companyId ? [data.data.companyId] : [],
        startAppliedDate: data.data.startAppliedDate,
        endAppliedDate: data.data.endAppliedDate,
        appliedAll: data.data.appliedAll || false,
        status: data.data.status,
      });
    }
  }, [isLoading, isFetching, data, reset]);

  const [loading, setLoading] = useState(false);
  const appliedAll = watch('appliedAll');

  const onSubmitValues = (values: any) => {
    const requestObject = {
      ...values,
      companyIds: values.companyIds,
      startAppliedDate: values.startAppliedDate
        ? format(new Date(values.startAppliedDate), 'yyyy-MM-dd')
        : '',
      endAppliedDate: values.endAppliedDate
        ? format(new Date(values.endAppliedDate), 'yyyy-MM-dd')
        : '',
    };

    if (isNew) {
      requestObject.companyIds = values.companyIds;
      requestObject.appliedAll = values.appliedAll;

      PaymentSendingMethodService.checkCreatePaymentSendingMethod(requestObject)
        .then((response: any) => {
          if (response.data?.messages?.length === 0) {
            saveOrUpdatePayment(requestObject);
          } else {
            const companyNames = response.data.messages.map(
              (msg: any) => msg.companyName || 'Tất cả các công ty'
            );
            Modal.confirm({
              title: 'Xác nhận',
              content: `${companyNames} đã được cấu hình trùng với thời gian bạn vừa chọn. Bạn có chắc chắn muốn dừng và áp dụng cài đặt phương thức đi tiền mới cho tất cả doanh nghiệp vừa chọn không?`,
              okText: 'Xác nhận',
              cancelText: 'Hủy',
              onOk: () => {
                saveOrUpdatePayment(requestObject);
              },
              onCancel: () => {
                setLoading(false);
              },
            });
          }
        })
        .catch(() => {
          Notification.error({
            title: 'Lỗi',
            content:
              'Đã có lỗi xảy ra khi kiểm tra dữ liệu, vui lòng thử lại sau!',
            duration: 3,
            theme: 'light',
          });
          setLoading(false);
        });
    } else {
      requestObject.id = payMoneyId || '';
      PaymentSendingMethodService.checkUpdatePaymentSendingMethod(requestObject)
        .then((response: any) => {
          if (response.data?.messages?.length === 0) {
            saveOrUpdatePayment(requestObject);
          } else {
            const companyNames = response.data.messages.map(
              (msg: any) => msg.companyName || 'Tất cả các công ty'
            );
            Modal.confirm({
              title: 'Xác nhận',
              content: `${companyNames} đã được cấu hình trùng với thời gian bạn vừa chọn. Bạn có chắc chắn muốn dừng và áp dụng cài đặt phương thức đi tiền mới cho tất cả doanh nghiệp vừa chọn không?`,
              okText: 'Chắc chắn',
              cancelText: 'Hủy',
              onOk: () => {
                saveOrUpdatePayment(requestObject);
              },
              onCancel: () => {
                setLoading(false);
              },
            });
          }
        })
        .catch(() => {
          Notification.error({
            title: 'Lỗi',
            content:
              'Đã có lỗi xảy ra khi kiểm tra dữ liệu, vui lòng thử lại sau!',
            duration: 3,
            theme: 'light',
          });
          setLoading(false);
        });
    }

    setLoading(true);
  };

  const saveOrUpdatePayment = (requestObject: any) => {
    PaymentSendingMethodService.saveOrUpdatePaymentSendingMethod(requestObject)
      .then((saveResponse: any) => {
        if (saveResponse.code === 200) {
          Notification.success({
            title: 'Thành công',
            content: `${
              isNew ? 'Thêm mới' : 'Cập nhật'
            } phương thức đi tiền thành công!`,
            duration: 3,
            theme: 'light',
          });
          router.replace(`/configurations/pay-money/napas`);
        } else {
          Notification.error({
            title: 'Lỗi',
            content: `${isNew ? 'Thêm mới' : 'Cập nhật'} không thành công!`,
            duration: 3,
            theme: 'light',
          });
        }
        setLoading(false);
      })
      .catch(() => {
        Notification.error({
          title: 'Lỗi',
          content: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
          duration: 3,
          theme: 'light',
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!data && !isLoading && !isNew) {
      setCheckData(false);
    }
  }, [data, isLoading, isNew, setCheckData]);

  useEffect(() => {
    if (appliedAll) {
      setValue('companyIds', []);
      setValue('selectAll', true);
    } else {
      setValue('selectAll', false);
    }
  }, [appliedAll, setValue]);

  if (isLoading) return <></>;

  return (
    <form onSubmit={handleSubmit(onSubmitValues)}>
      <div>
        <div className="flex justify-between">
          <h1>
            {isNew
              ? 'Thêm mới phương thức đi tiền'
              : 'Chỉnh sửa phương thức đi tiền'}
          </h1>
          <div className="flex gap-4">
            <Button onClick={onCancel}>Hủy</Button>
            <Button theme="solid" htmlType="submit" loading={loading}>
              Lưu thông tin
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 my-4">
          <InputWrapper
            required
            field="bankCode"
            label="Nguồn tiền"
            component={(props: any) => (
              <Select optionList={listBankcode} {...props} />
            )}
            errors={errors}
            control={control}
          />

          <InputWrapper
            field="companyIds"
            label="Doanh nghiệp"
            component={(field: any) => (
              <CompanySelect
                {...field}
                multiple={true}
                disabled={appliedAll || !isNew}
                selectAll={watch('selectAll')}
              />
            )}
            errors={errors}
            control={control}
          />

          {isNew && (
            <InputWrapper
              field="appliedAll"
              label="Áp dụng cho tất cả"
              component={(props: any) => (
                <Switch onChange={props.onChange} checked={props.value} />
              )}
              errors={errors}
              control={control}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 my-4">
          <InputWrapper
            required
            label="Ngày bắt đầu"
            field="startAppliedDate"
            control={control}
            errors={errors}
            component={(e: any) => (
              <DatePicker
                size="large"
                className="w-full"
                format="dd/MM/yyyy"
                {...e}
                disabled={!isNew}
              />
            )}
          />

          <InputWrapper
            label="Ngày kết thúc"
            field="endAppliedDate"
            control={control}
            errors={errors}
            component={(e: any) => (
              <DatePicker
                size="large"
                className="w-full"
                format="dd/MM/yyyy"
                {...e}
              />
            )}
          />

          <InputWrapper
            required
            field="status"
            label="Trạng thái"
            component={(props: any) => (
              <Select optionList={listStatusPayMoneySetup} {...props} />
            )}
            errors={errors}
            control={control}
          />
        </div>
      </div>
    </form>
  );
};
