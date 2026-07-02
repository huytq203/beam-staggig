import { InputNumber, InputWrapper } from '@components/shared';
import { FormWrapper } from '@components/widgets/ContentWrapper';
import {
  listTypeOfGiftBudget,
  listeligibleParticipant,
} from '@constants/index';
import { Notification, Select } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { LuckyBoxService } from '@services/lucky-box';
import { CreateBudgetFormSchema } from 'validations/lucky-box/CreateBudgetFormSchema.schema';
import { listNameLuckyBox } from '@constants/listNameLuckyBox.constants';

export const CreateBudgetForm = (props: any) => {
  const { onCancel, isNew } = props;
  const router = useRouter();
  const { budgetId } = router.query;

  const {
    data: budgetData,
    isLoading: isLoadingBudgetData,
    isFetching: isFetchingBudgetData,
    refetch: reFetchBudgetData,
  } = useQuery(
    ['budget-detail', budgetId],
    async () => {
      const response = await LuckyBoxService.getAllBugetDetail(budgetId);
      return response;
    },
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const { authCheckByRole } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN]);
  // const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    control,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateBudgetFormSchema),
    defaultValues: {
      name: '',
      value: 0,
      amount: 0,
      size: 0,
      sizeCap: 0,
      type: 'COMMON',
      eligibleParticipant: 'ALL',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (!isLoadingBudgetData && !isNew) {
      reset({
        ...budgetData,
        name: budgetData?.name,
        value: budgetData?.value,
        size: budgetData?.size,
        sizeCap: budgetData?.sizeCap,
        type: budgetData?.type,
        eligibleParticipant: budgetData?.eligibleParticipant,
        status: budgetData?.status,
        amount: budgetData?.amount,
      });
    }
  }, [isLoadingBudgetData, isFetchingBudgetData]);

  const onSubmit = (values: any) => {
    const requestObject = {
      id: values.id,
      name: values.name,
      value: values.value,
      size: values.size,
      sizeCap: values.sizeCap,
      type: values.type,
      eligibleParticipant: values.eligibleParticipant,
      status: values.status,
      amount: values.amount,
    };
    setLoading(true);
    LuckyBoxService.addOrUpdateBuget(requestObject).then((x: any) => {
      // setLoading(false);
      if (x?.code === 200) {
        let opts: any = {
          with: 3,
          Position: 'topRight',
          content: `${
            values?.id ? 'Cập nhật thành công' : 'Tạo mới thành công'
          } `,
          theme: 'light',
        };

        Notification.success({ ...opts });

        router.push('/lucky-box/budget');
      } else {
        let opts: any = {
          with: 3,
          Position: 'topRight',
          content: `${values?.id ? 'Cập nhật thất bại!' : 'Tạo mới thất bại'} `,
          theme: 'light',
        };

        Notification.error({ ...opts });
        setLoading(false);
      }
    });
  };

  const convertNameLuckyBox = () => {
    const keyOfName = Object.keys(listNameLuckyBox);
    const valueOfName = Object.values(listNameLuckyBox);
    return keyOfName.map((key: any, index: number) => ({
      value: key,
      label: valueOfName[index],
    }));
  };

  return (
    <SpinWrapper spinning={loading}>
      <FormWrapper
        pageTitle={`${
          isNew ? 'Thêm mới phần thưởng' : 'Chỉnh sửa phần thưởng"'
        }`}
        onCancel={() => router.push('/lucky-box/budget')}
        onSubmit={handleSubmit(onSubmit, (errors) =>
          FunctionBase.scrollToErrorField(errors as any, setFocus)
        )}
        loading={loading}
      >
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <InputWrapper
              required
              field="name"
              label="Tên phần thưởng"
              component={(props: any) => (
                <Select
                  optionList={convertNameLuckyBox()}
                  disabled={!isNew}
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />

            <InputWrapper
              required
              field="value"
              label="Giá trị"
              component={(props: any) => (
                <InputNumber
                  showClear
                  autoComplete="off"
                  format="thousands"
                  placeholder="Nhập vào giá trị"
                  disabled={!isNew}
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputWrapper
              required
              field="sizeCap"
              label="Số lượng tối đa"
              component={(props: any) => (
                <InputNumber
                  disabled={!isNew}
                  placeholder="Nhập vào số lượng tối đa"
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />

            <InputWrapper
              required
              field="amount"
              label="Số lượng quà của phần thưởng"
              component={(props: any) => (
                <InputNumber
                  placeholder="Nhập vào số lượng quà của phần thưởng"
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 ">
            <InputWrapper
              required
              field="type"
              label="Loại quà"
              component={(props: any) => (
                <Select optionList={listTypeOfGiftBudget} {...props} />
              )}
              errors={errors}
              control={control}
            />
            <InputWrapper
              required
              field="size"
              label="Số lượng cài đặt"
              component={(props: any) => (
                <InputNumber
                  placeholder="Nhập vào số lượng cài đặt"
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
          </div>
          <div className="grid grid-cols-2 gap-4" data-testid={'status'}>
            <InputWrapper
              required
              field="eligibleParticipant"
              label="Đối tượng nhận thưởng"
              component={(props: any) => (
                <Select optionList={listeligibleParticipant} {...props} />
              )}
              errors={errors}
              control={control}
            />
            <InputWrapper
              required
              field="status"
              label="Trạng thái"
              component={(props: any) => (
                <Select
                  className="status"
                  optionList={[
                    {
                      value: 'ACTIVE',
                      label: 'Hoạt động',
                    },
                    {
                      value: 'INACTIVE',
                      label: 'Không hoạt động',
                    },
                  ]}
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
          </div>

          {/* <Modal
              title="Vui lòng nêu lí do chuyển trạng thái hoạt động vào ô bên dưới"
              visible={visible}
              onOk={() => {
                setVisible(false);
                setValue('status', 1);
              }}
              onCancel={() => {
                setVisible(false);
                setValue('status', 0);
              }}
              closeOnEsc={true}
              okText={'Xác nhận'}
              cancelText={'Huỷ'}
              okButtonProps={{
                disabled: watch('reason')?.length > 0 ? false : true,
              }}
            >
              <InputWrapper
                field="reason"
                component={(props: any) => (
                  <TextArea
                    maxLength={200}
                    maxCount={200}
                    showCounter
                    showClear
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />
            </Modal> */}
        </div>
      </FormWrapper>
    </SpinWrapper>
  );
};
