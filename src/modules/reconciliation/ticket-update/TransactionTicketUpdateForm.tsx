import { InputNumber, InputWrapper } from '@components/shared';
import { FormActionButton } from '@components/widgets';
import { Button, Divider, Input, Select } from '@douyinfe/semi-ui';
import { ReconciliationService } from '@services/reconciliation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export interface TransactionTicketUpdateFormProps {
  isNew?: boolean;
  onSubmit?: any;
  data?: any;
  id?: any;
  onCancel?: any;
}

export const TransactionTicketUpdateForm = (
  props: TransactionTicketUpdateFormProps
) => {
  const { isNew, data, onSubmit, id, onCancel } = props;

  const [beamCodeFilter, setBeamCodeFilter] = useState<any>(data?.refNum);

  useEffect(() => {
    if (!isNew) {
      onFilterByBeamCode(data?.refNum);
    }
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: null,
      refNum: null,
      old_ftCode: '',
      old_amount: 0,
      old_beamStatus: 1,
      ftCode: '',
      amount: 0,
      beamStatus: 1,
    },
  });

  const onFilterByBeamCode = (beamCode: any) => {
    if (isNew) {
      ReconciliationService.getTransactionDetail(beamCode).then(
        (response: any) => {
          reset({
            id: response?.id,
            refNum: response?.id,
            old_ftCode: response?.ftCode,
            old_amount: response?.amount,
            old_beamStatus: response?.beamStatus,
            ftCode: response?.ftCode,
            amount: response?.amount,
            beamStatus: response?.beamStatus,
          });
        }
      );
    } else {
      ReconciliationService.getTransactionWithHistory(data?.id).then(
        (response: any) => {
          reset({
            id: response?.id,
            refNum: response?.refNum,
            old_ftCode: response?.oldFTCode,
            old_amount: response?.oldAmount,
            old_beamStatus: response?.oldBeamStatus,
            ftCode: response?.ftCode,
            amount: response?.amount,
            beamStatus: response?.beamStatus,
          });
        }
      );
    }
  };

  const onSubmitForm = (values: any) => {
    onSubmit && isNew && onSubmit(values, isNew);
  };

  const getRequest = (confirmationType: any) => {
    const reqData = getValues();

    return {
      ...reqData,
      id: data?.id,
      confirmationType: confirmationType,
    };
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <Input
          maxLength={100}
          onChange={setBeamCodeFilter}
          value={id !== undefined ? id : beamCodeFilter}
          disabled={!isNew}
          placeholder="Nhập vào beam code"
        />
        {isNew && (
          <Button
            type="primary"
            theme="solid"
            htmlType="submit"
            // disabled={!beamCodeFilter || beamCodeFilter.length < 1}
            onClick={() =>
              onFilterByBeamCode(id !== undefined ? id : beamCodeFilter)
            }
          >
            Kiểm tra
          </Button>
        )}
      </div>
      <Divider dashed />
      <div>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper
                label="Mã FT cũ"
                field="old_ftCode"
                component={(props: any) => (
                  <Input disabled={true} value={watch('old_ftCode')} />
                )}
                errors={errors}
                control={control}
              />

              <InputWrapper
                required
                field="ftCode"
                label="Cập nhật mã FT"
                component={(props: any) => (
                  <Input disabled={!isNew} {...props} />
                )}
                errors={errors}
                control={control}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputWrapper
                label="Số tiền cũ"
                component={(props: any) => (
                  <InputNumber
                    disabled={true}
                    format="thousands"
                    value={watch('old_amount')}
                  />
                )}
              />

              <InputWrapper
                required
                field="amount"
                label="Cập nhật số tiền"
                component={(props: any) => (
                  <InputNumber
                    disabled={!isNew}
                    format="thousands"
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper
                field="old_beamStatus"
                label="Trạng thái cũ"
                component={(props: any) => (
                  <Select
                    disabled={true}
                    optionList={[
                      {
                        value: 1,
                        label: 'Thành công',
                      },
                      {
                        value: 0,
                        label: 'Thất bại',
                      },
                    ]}
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />

              <InputWrapper
                required
                field="beamStatus"
                label="Cập nhật trạng thái"
                component={(props: any) => (
                  <Select
                    optionList={[
                      {
                        value: 1,
                        label: 'Thành công',
                      },
                      {
                        value: 0,
                        label: 'Thất bại',
                      },
                    ]}
                    disabled={!isNew}
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />
            </div>
            {isNew && (
              <FormActionButton
                disabled={
                  watch('old_ftCode')?.length <= 0 ||
                  watch('old_ftCode') === undefined
                }
                onCancel={onCancel}
              />
            )}

            {!isNew && (
              <div className="flex gap-2 justify-end">
                <Button type="tertiary" onClick={onCancel}>
                  Quay lại
                </Button>
                <Button
                  type="primary"
                  theme="light"
                  onClick={() => onSubmit(getRequest(2))}
                >
                  Từ chối
                </Button>
                <Button
                  type="primary"
                  theme="solid"
                  onClick={() => onSubmit(getRequest(1))}
                >
                  Đồng ý
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
