import { InputWrapper } from '@components/shared';
import { CompanySelect, FormActionButton } from '@components/widgets';
import { InputNumber, Modal, Switch, TextArea } from '@douyinfe/semi-ui';
import React from 'react';
import { useForm } from 'react-hook-form';

interface OuststandingBalanceFormProps {
  setOpenModal: any;
  openModal: {
    isOpenModal: boolean;
    id?: string | null;
  };
}

export const OuststandingBalanceForm = (
  props: OuststandingBalanceFormProps
) => {
  const { setOpenModal, openModal } = props;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: false,
    defaultValues: {},
  });

  const onClosePicker = () => {
    setOpenModal({
      isOpenModal: false,
      id: null,
    });
  };
  const onSubmit = () => {};
  return (
    <div>
      <Modal
        visible={openModal?.isOpenModal}
        onCancel={onClosePicker}
        title="Thêm mới quản lý dư nợ"
        footer={['']}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div>
              <InputWrapper
                required
                label="Doanh nghiệp"
                field="companyId"
                control={control}
                errors={errors}
                component={(e: any) => {
                  return (
                    <CompanySelect
                      className="w-full"
                      placeholder="Doanh nghiệp ABCDEFG"
                      {...e}
                    />
                  );
                }}
              />
              <InputWrapper
                label="Số tiền được phép nợ"
                field="moneyAmount"
                control={control}
                errors={errors}
                required
                component={(e: any) => {
                  return (
                    <InputNumber
                      format="thousands"
                      className="w-full"
                      placeholder="Số tiền"
                      max={999999999999}
                      {...e}
                    />
                  );
                }}
              />

              <InputWrapper
                label="Số ngày được quá hạn"
                field="savedDate"
                control={control}
                errors={errors}
                component={(e: any) => {
                  return (
                    <InputNumber
                      format="thousands"
                      className="w-full"
                      placeholder="Số ngày quá hạn"
                      max={999999999999}
                      {...e}
                    />
                  );
                }}
              />
              <InputWrapper
                label="Khoá DN khi ngày đến hạn kết thúc"
                field=""
                control={control}
                errors={errors}
                component={(e: any) => {
                  return <Switch {...e} />;
                }}
              />
              <InputWrapper
                label="Ghi chú"
                field="description"
                control={control}
                errors={errors}
                component={(e: any) => {
                  return (
                    <TextArea
                      className="w-full"
                      maxLength={500}
                      maxCount={500}
                      placeholder="Ghi chú"
                      {...e}
                    />
                  );
                }}
              />
            </div>
            <FormActionButton
              onCancel={onClosePicker}
              // loading={loading}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
