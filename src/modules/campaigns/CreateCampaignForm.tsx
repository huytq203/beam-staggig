import {
  FileManagerButton,
  InputNumber,
  InputNumberByType,
} from '@components/shared';
import { InputWrapper } from '@components/shared/InputWrapper';
import { CustomSelect } from '@components/shared/Select';
import { FormWrapper, MainContentWrapper } from '@components/widgets';
import { COMMON_FORMAT } from '@constants/common-format';
import {
  simpleStatusOptions,
  statusOptionsWithDraf,
} from '@constants/select-options.constants';
import { IconMinus, IconPlus } from '@douyinfe/semi-icons';
import {
  Collapse,
  DatePicker,
  Input,
  Modal,
  Notification,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextArea,
} from '@douyinfe/semi-ui';
import { ArrayHelper } from '@helpers/array.helper';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIsMount } from '@hooks/useIsMount';
import { CampaignService } from '@services/campaigns';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { CreateCampaignSchema } from 'validations/CreateCampaignSchema.schema';
import { CampaignCompanyPickList } from './CampaignCompanyPickList';
import { CampaignCompanyPicker } from './CampaignCompanyPicker';
import { CampaignGroupSelect } from './CampaignGroupSelect';
import { SelectCampaignType } from './SelectCampaignType';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { BeamEditor } from '@components/shared/RichText/NanoEditor';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
import { FunctionBase } from '@helpers/fuction-base.helpers';
export interface CreateCampaignForm {
  campaignId?: any;
  onClickCancel: () => void;
  isNew?: boolean;
}

const campaignValueTypes = [
  {
    label: 'VNĐ',
    value: 0,
  },
  {
    label: '%',
    value: 1,
  },
];
export const CreateCampaignForm = (props: CreateCampaignForm) => {
  const { campaignId, isNew, onClickCancel } = props;
  const router = useRouter();
  const { companyId } = router.query;
  const isFirstMount = useIsMount();
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['campaign_detail', campaignId],
    () => CampaignService.getCampaign(campaignId),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const { authCheckByRole, profile } = useAuth();
  if (isNew) {
    authCheckByRole([
      UserRole.BEAM_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.CUSTOMER_SERVICE,
    ]);
  }
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateCampaignSchema),
    defaultValues: {
      companyId: companyId,
      code: '',
      valueType: 0,
      status: 0,
      applyType: 0,
      applyIds: [],
      applyAll: false,
      companyEmployeeId: null,
      multipleApply: false,
      applyNumber: 3,
      image: '',
      imageUrl: '',
      sex: 0,
      birthMonth: [0],
      ageRange: [0],
      jobRole: 0,
      totalSpending: [0],
      minimumTransfer: 0,
      reason: '',
      maximumBudget: '',
    },
  });
  // useEffect(() => {
  //   const checkInvalidData = async () => {
  //     if (!data) return router.push('/404');
  //   };

  //   checkInvalidData();
  // }, []);
  const onSubmitValues = (values: any) => {
    // const apply = values.applyIds;
    // remove();
    setLoading(true);

    const payload = {
      ...values,
      // applyIds: apply,
      startTime: DateTimeHelper.fomartDateRangeSubmit(values.startTime),
      endTime: DateTimeHelper.fomartDateRangeSubmit(values.endTime),
      sex: ArrayHelper.convertStringNumberToArray(values.sex),
      // member: ArrayHelper.convertStringNumberToArray(values.member),
      member: [0],
      jobRole: ArrayHelper.convertStringNumberToArray(values.jobRole),
      applyNumber: ArrayHelper.convertStringNumberToArray(values.applyNumber),
      minimumTransfer: ArrayHelper.convertStringNumberToArray(
        values.minimumTransfer
      ),
      maximumDiscount: values.maximumDiscount ? values.maximumDiscount : null,
    };
    CampaignService.addOrUpdate(payload)
      .then((response: any) => {
        if (response) {
          Notification.success({
            title: 'Thành công',
            content: `${
              isNew ? 'Thêm mới' : 'Cập nhật thông tin'
            } chiến dịch thành công!`,
            duration: 3,
            theme: 'light',
          });
          router.push(`/campaigns`);
        } else {
          {
            Notification.error({
              title: 'Thất bại',
              content: `${
                isNew ? 'Thêm mới' : 'Cập nhật thông tin'
              } chiến dịch thất bại!`,
              duration: 3,
              theme: 'light',
            });
          }
        }
        setLoading(false);
      })
      .catch((e: any) => {});
  };
  useEffect(() => {
    if (!isFirstMount) {
      reset(getValues());
    }
  }, [watch('valueType')]);

  useEffect(() => {
    if (!isLoading && !isNew) {
      const startDate = DateTimeHelper.convertTimeZone(
        data?.startTime,
        COMMON_FORMAT.EMPTY_FORMAT
      );
      const endDate = DateTimeHelper.convertTimeZone(
        data?.endTime,
        COMMON_FORMAT.EMPTY_FORMAT
      );
      const dateRanges = [startDate, endDate];

      let resetData = data;
      const apply = data?.applyIds;
      resetData = {
        ...resetData,
        applyIds: apply,
        startTime: DateTimeHelper.convertTimeZone(
          data?.startTime,
          COMMON_FORMAT.EMPTY_FORMAT
        ),
        endTime: DateTimeHelper.convertTimeZone(
          data?.endTime,
          COMMON_FORMAT.EMPTY_FORMAT
        ),
        sex: data?.sex[0],
        // member: StringHelper.convertArrToNumber(data?.member),
        jobRole: data?.jobRole[0],
        applyNumber: data?.applyNumber[0],
        minimumTransfer: data?.minimumTransfer[0],
      };
      reset(resetData);
    }
  }, [isLoading, isFetching]);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'applyIds',
    } as any
  );

  const onSelectEmployee = (employeeId: any) => {
    remove();
    append(employeeId);
  };
  const onSelectCompany = (listIds: any[]) => {
    remove();
    append(listIds);
  };
  // useEffect(() => {
  //   if(watch('applyType') == 0){
  //     onSelectEmployee([])
  //   }else if(watch('applyType') == 1){
  //     onSelectCompany([])
  //   }
  // }, [watch('applyIds')]);
  if (isLoading) return <></>;
  // if (!data && !isLoading && !isNew) return <NotFound />;
  const checkDisabled = () => {
    if (!isNew && getValues('status') === 3) {
      return true;
    } else if (
      [
        UserRole.ACCOUNTANT,
        UserRole.SALE,
        UserRole.CONTROLLER,
        UserRole.RECONCILER,
      ].includes(profile?.roles[0])
    ) {
      return true;
    }

    return false;
  };

  return (
    <MainContentWrapper isNew={isNew} isLoading={isLoading} data={data}>
      <SpinWrapper spinning={loading}>
        <FormWrapper
          pageTitle={isNew ? 'Tạo mới chiến dịch' : 'Cập nhật chiến dịch'}
          onCancel={onClickCancel}
          onSubmit={handleSubmit(onSubmitValues, (errors) =>
            FunctionBase.scrollToErrorField(errors as any, setFocus)
          )}
          showSubmitButton={watch('status') !== 3}
          cancelText={watch('status') == 3 ? 'Quay lại' : 'Huỷ'}
          loading={loading}
        >
          <div className="flex flex-col gap-5">
            <Collapse
              expandIcon={<IconPlus />}
              collapseIcon={<IconMinus />}
              className="p-0"
              defaultActiveKey={[
                'campaignInformation',
                'applyRange',
                'applyCondition',
              ]}
            >
              <Collapse.Panel
                header="THÔNG TIN CHIẾN DỊCH"
                itemKey="campaignInformation"
              >
                <div className="flex flex-col gap-4 mb-4">
                  <div className="grid grid-cols-2 gap-12">
                    <InputWrapper
                      required
                      field="name"
                      label="Tên chiến dịch"
                      component={(props: any) => (
                        <Input
                          disabled={checkDisabled()}
                          maxLength={100}
                          showClear
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />

                    <InputWrapper
                      required
                      field="campaignTypeId"
                      label="Loại chiến dịch"
                      component={(props: any) => (
                        <SelectCampaignType
                          disabled={checkDisabled()}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                    <InputWrapper
                      field="image"
                      label="Ảnh"
                      component={(props: any) => (
                        <>
                          <div className="flex items-center gap-4">
                            {watch('image') && (
                              <img
                                className="w-12 h-12 object-cover border-dashed border-gray-500 rounded p-0.5"
                                src={watch('imageUrl') as any}
                              />
                            )}

                            <FileManagerButton
                              onOk={(file: any) => {
                                setValue('imageUrl', file?.url);
                                if (file?.name) props.onChange(file?.name);
                              }}
                              url="scheduler-notification/upload"
                              urlGet="scheduler-notification/get-all"
                              fileSize={2048}
                              fileType=".jpg,.png,.jpeg"
                              disabled={checkDisabled()}
                            />
                          </div>
                        </>
                      )}
                      errors={errors}
                      control={control}
                    />
                    <InputWrapper
                      required
                      field="code"
                      label="Mã chiến dịch"
                      component={(props: any) => (
                        <Input
                          disabled={checkDisabled() || !isNew}
                          maxLength={50}
                          showClear
                          onInput={(e: any) =>
                            (e.target.value = e.target.value.toUpperCase())
                          }
                          value={props.value}
                          onChange={(value: any) => {
                            const reg = /^[a-zA-Z0-9]*$/;
                            if (
                              (!Number.isNaN(value) && reg.test(value)) ||
                              value === '' ||
                              value === '-'
                            ) {
                              props.onChange(value);
                            }
                          }}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                    <InputWrapper
                      required
                      field="description"
                      label="Mô tả"
                      component={(props: any) => (
                        <TextArea
                          disabled={checkDisabled()}
                          maxLength={3000}
                          maxCount={3000}
                          showCounter
                          showClear
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                    <InputWrapper
                      field="guide"
                      label="Cách thức tham gia"
                      component={(props: any) => (
                        <BeamEditor
                          value={props.value}
                          onChange={props.onChange}
                          fontsize={false}
                          font={false}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                    <InputWrapper
                      required
                      field="startTime"
                      label="Ngày bắt đầu"
                      component={(props: any) => (
                        <DatePicker
                          insetInput
                          disabled={checkDisabled()}
                          type="dateTime"
                          format="dd/MM/yyyy HH:mm:ss"
                          disabledDate={(current: any) => {
                            return moment().add(-1, 'days') >= current;
                          }}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                    <InputWrapper
                      field="endTime"
                      label="Ngày kết thúc"
                      component={(props: any) => (
                        <DatePicker
                          insetInput
                          disabled={checkDisabled()}
                          type="dateTime"
                          format="dd/MM/yyyy HH:mm:ss"
                          disabledDate={(current: any) => {
                            return moment().add(-1, 'days') >= current;
                          }}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <InputWrapper
                      required
                      field="quantity"
                      label="Số lượng"
                      component={(props: any) => (
                        <InputNumber
                          disabled={checkDisabled()}
                          maxLength={10}
                          // min={0}
                          max={999999999}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />

                    <InputWrapper
                      field="valueType"
                      label="Loại giá trị"
                      component={(props: any) => (
                        <Select
                          disabled={checkDisabled()}
                          optionList={campaignValueTypes}
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
                        <InputNumberByType
                          disabled={checkDisabled()}
                          displayType={watch('valueType')}
                          max={9999999999}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />

                    <InputWrapper
                      required
                      field="maximumDiscount"
                      label="Giảm tối đa"
                      component={(props: any) => (
                        <InputNumberByType
                          displayType={0}
                          maxLength={10}
                          disabled={watch('valueType') == 0 || checkDisabled()}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputWrapper
                      field="maximumBudget"
                      label="Ngân sách chiến dịch"
                      component={(props: any) => (
                        <InputNumberByType
                          disabled={checkDisabled()}
                          displayType={0}
                          max={100000000}
                          {...props}
                        />
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
                          disabled={checkDisabled()}
                          optionList={
                            isNew || (!isNew && getValues('status') === 2)
                              ? statusOptionsWithDraf
                              : simpleStatusOptions
                          }
                          {...props}
                          onSelect={(value: any) => {
                            if (!isNew && value === 1) {
                              return setVisible(true);
                            }
                          }}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>
                  <Modal
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
                  </Modal>
                </div>
              </Collapse.Panel>

              <Collapse.Panel header="PHẠM VI ÁP DỤNG" itemKey="applyRange">
                <div className="flex flex-col gap-4 mb-4">
                  <div>
                    <InputWrapper
                      required
                      field="applyType"
                      label="Phạm vi áp dụng cho"
                      component={(props: any) => (
                        <RadioGroup
                          disabled={checkDisabled()}
                          name="applyType-group"
                          value={props.value}
                          onChange={(e: any) => {
                            props.onChange(e);
                            setValue('applyIds', []);
                          }}
                        >
                          <Radio value={0}>1 Doanh nghiệp</Radio>
                          <Radio value={1}>Nhiều doanh nghiệp</Radio>
                        </RadioGroup>
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  <div>
                    {watch('applyType') == 0 && (
                      <CampaignCompanyPickList
                        remove={remove}
                        onSelect={onSelectEmployee}
                        control={control}
                        errors={errors}
                        watch={watch}
                        disabledPicker={checkDisabled()}
                      />
                    )}

                    {watch('applyType') == 1 && (
                      <CampaignCompanyPicker
                        remove={remove}
                        control={control}
                        errors={errors}
                        watch={watch}
                        onSelect={onSelectCompany}
                        disabledPicker={checkDisabled()}
                      />
                    )}
                  </div>
                </div>
              </Collapse.Panel>

              <Collapse.Panel
                header="ĐIỀU KIỆN ÁP DỤNG"
                itemKey="applyCondition"
              >
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-x-12 items-center">
                    <span>Số lần áp dụng (trên một tài khoản)</span>
                    <InputWrapper
                      field="applyNumber"
                      component={(props: any) => (
                        <Select
                          disabled={checkDisabled()}
                          optionList={[
                            {
                              value: 0,
                              label: '01',
                            },
                            {
                              value: 1,
                              label: '02',
                            },
                            {
                              value: 2,
                              label: '03',
                            },
                            {
                              value: 3,
                              label: 'Không giới hạn',
                            },
                          ]}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  {/* <div className="grid grid-cols-2 gap-x-12 items-center">
                <span>Thành viên</span>
                <InputWrapper
                  field="member"
                  component={(props: any) => (
                    <Select
                      disabled={disabled}
                      optionList={[
                        {
                          value: 0,
                          label: 'Tất cả',
                        },
                        {
                          value: 1,
                          label: 'Mới',
                        },
                        {
                          value: 2,
                          label: 'Cũ',
                        },
                      ]}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div> */}

                  <div className="grid grid-cols-2 gap-x-12 items-center">
                    <span>Giới tính</span>
                    <InputWrapper
                      field="sex"
                      component={(props: any) => (
                        <Select
                          disabled={checkDisabled()}
                          optionList={[
                            {
                              value: 0,
                              label: 'Tất cả',
                            },
                            {
                              value: 1,
                              label: 'Nam',
                            },
                            {
                              value: 2,
                              label: 'Nữ',
                            },
                            {
                              value: 3,
                              label: 'Khác',
                            },
                          ]}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 items-center">
                    <span>Sinh nhật</span>
                    <InputWrapper
                      field="birthMonth"
                      component={(props: any) => (
                        <CustomSelect
                          disabled={checkDisabled()}
                          optionList={[
                            {
                              value: 0,
                              label: 'Tất cả',
                            },
                            {
                              value: 1,
                              label: 'Tháng 1',
                            },
                            {
                              value: 2,
                              label: 'Tháng 2',
                            },
                            {
                              value: 3,
                              label: 'Tháng 3',
                            },
                            {
                              value: 4,
                              label: 'Tháng 4',
                            },
                            {
                              value: 5,
                              label: 'Tháng 5',
                            },
                            {
                              value: 6,
                              label: 'Tháng 6',
                            },
                            {
                              value: 7,
                              label: 'Tháng 7',
                            },
                            {
                              value: 8,
                              label: 'Tháng 8',
                            },
                            {
                              value: 9,
                              label: 'Tháng 9',
                            },
                            {
                              value: 10,
                              label: 'Tháng 10',
                            },
                            {
                              value: 11,
                              label: 'Tháng 11',
                            },
                            {
                              value: 12,
                              label: 'Tháng 12',
                            },
                          ]}
                          allSelectValue={0}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 items-center">
                    <span>Độ tuổi</span>
                    <InputWrapper
                      field="ageRange"
                      component={(props: any) => (
                        <CustomSelect
                          disabled={checkDisabled()}
                          allSelectValue={0}
                          optionList={[
                            {
                              value: 0,
                              label: 'Tất cả',
                            },
                            {
                              value: 1,
                              label: 'Dưới 20',
                            },
                            {
                              value: 2,
                              label: '20 - 29',
                            },
                            {
                              value: 3,
                              label: '30 - 39',
                            },
                            {
                              value: 4,
                              label: '40 - 49',
                            },
                            {
                              value: 5,
                              label: '50 - 59',
                            },
                            {
                              value: 6,
                              label: 'Trên 60',
                            },
                          ]}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 items-center">
                    <span>Chức vụ</span>
                    <InputWrapper
                      field="jobRole"
                      component={(props: any) => (
                        <Select
                          disabled={checkDisabled()}
                          optionList={[
                            {
                              value: 0,
                              label: 'Tất cả',
                            },
                            {
                              value: 1,
                              label: 'Nhân viên',
                            },
                            {
                              value: 2,
                              label: 'Quản lý',
                            },
                          ]}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  {/* <div className="grid grid-cols-2 gap-x-12 items-center">
                <span>Tổng chi tiêu</span>
                <InputWrapper
                  field="totalSpending"
                  component={(props: any) => (
                    <Select
                      disabled={disabled}
                      optionList={[
                        {
                          value: 0,
                          label: '0',
                        },
                        {
                          value: 1,
                          label: 'Dưới 1,000,000',
                        },
                        {
                          value: 2,
                          label: 'Từ 1,000,000 - 5,000,000',
                        },
                        {
                          value: 3,
                          label: 'Từ 5,000,000 - 10,000,000',
                        },
                      ]}
                      multiple
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div> */}
                  <div className="grid grid-cols-2 gap-x-12 items-center">
                    <span>Mức giao dịch tối thiểu</span>
                    <InputWrapper
                      field="minimumTransfer"
                      component={(props: any) => (
                        <Select
                          disabled={checkDisabled()}
                          optionList={[
                            {
                              value: 0,
                              label: '0',
                            },
                            {
                              value: 1,
                              label: '100,000',
                            },
                            {
                              value: 2,
                              label: '1,000,000',
                            },
                            {
                              value: 3,
                              label: '3,000,000',
                            },
                            {
                              value: 4,
                              label: '5,000,000',
                            },
                          ]}
                          // multiple
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>

                  {watch('applyType') == 0 && (
                    <div className="grid grid-cols-2 gap-x-12 items-center">
                      <span>Nhóm</span>
                      <CampaignGroupSelect
                        field={'groupIds'}
                        control={control}
                        errors={errors}
                        disabled={checkDisabled()}
                        companyId={watch('companyEmployeeId')}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-x-12 items-center">
                    <span>Áp dụng đồng thời với các chiến dịch khác</span>
                    <InputWrapper
                      field="multipleApply"
                      component={(props: any) => (
                        <Switch
                          disabled={checkDisabled()}
                          {...props}
                          checked={props.value}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
        </FormWrapper>
      </SpinWrapper>
    </MainContentWrapper>
  );
};
