import {
  FileManagerButton,
  InputNumber,
  InputNumberByType,
  InputWrapper,
} from '@components/shared';
import { FormWrapper } from '@components/widgets/ContentWrapper';
import {
  Button,
  Collapse,
  DatePicker,
  Input,
  Modal,
  Notification,
  Select,
  Switch,
  TextArea,
} from '@douyinfe/semi-ui';
import { useIsMount } from '@hooks/useIsMount';
import { yupResolver } from '@hookform/resolvers/yup';
import { CompanyService } from '@services/companies';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';
import { CreateCompanySchema } from 'validations/companies';
import { IconMinus, IconPlus } from '@douyinfe/semi-icons';
import { getDateList } from '@modules/fee-policies';
import moment from 'moment-timezone';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';

export interface CreateCompanyForm {
  companyId?: any;
  onClickCancel: () => void;
  isNew?: boolean;
  reFetchCompanyData?: () => void;
  setCheckData?: any;
}

export interface DefaultValuesCreateCompanyForm {
  enabled: boolean;
  changeEnableReason: string;
  logo: string;
  logoUrl: string;
  autoGenEmployeeCode: boolean;
  companyPayRate: any;
  noExpiredDates: boolean;
  companySize: number;
  contractExpiredDates: any;
  gracePeriod: number;
  ticketRegisterSalaryAdvance: boolean;
  ticketChangeInformation: boolean;
  manageSalaryAdvanceRequest: boolean;
  employeeInformationChange: boolean;
  requireSocialInsuranceNumber: boolean;
  workDayType: string;
  maxCreditLimitPerPeriod: null;
}

export const CreateCompanyForm = (props: CreateCompanyForm) => {
  const {
    onClickCancel,
    companyId,
    isNew = true,
    reFetchCompanyData,
    setCheckData,
  } = props;
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CUSTOMER_SERVICE,
  ]);
  const router = useRouter();
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['company_detail', companyId],
    () => CompanyService.getCompany(companyId),
    {
      enabled: !isNew && companyId !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isAmount = useIsMount();
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<DefaultValuesCreateCompanyForm>({
    resolver: yupResolver(CreateCompanySchema),
    defaultValues: {
      enabled: true,
      changeEnableReason: '',
      logo: '',
      logoUrl: '',
      autoGenEmployeeCode: false,
      companyPayRate: 100,
      // autoRenew: true,
      // contractEndDate: new Date(),
      noExpiredDates: false,
      companySize: 0,
      contractExpiredDates: [{ date: new Date() }],
      gracePeriod: 0,
      ticketRegisterSalaryAdvance: true,
      ticketChangeInformation: true,
      manageSalaryAdvanceRequest: false,
      employeeInformationChange: true,
      requireSocialInsuranceNumber: false,
      workDayType: 'DEFAULT',
      maxCreditLimitPerPeriod: null,
    },
  });
  const { fields, append, prepend, remove } = useFieldArray({
    name: 'contractExpiredDates',
    control,
  });
  useEffect(() => {
    if (!isLoading && !isNew) {
      reset({
        ...data,
        contractExpiredDates: getDateList(data),
      });
    }
  }, [isLoading, isFetching]);

  const changeDataByWorkDay = (curentData: any, data: any) => {
    return curentData ? curentData : data;
  };

  useEffect(() => {
    reset({
      ...getValues(),
    });
  }, []);

  useEffect(() => {
    reset({
      ...getValues(),
    });
  }, []);

  const onSubmitValues = async (values: any) => {
    const requestObject = {
      exceptedCompanyId: values.id,
      taxIdentificationNumber: values.taxIdentificationNumber,
    };
    const contractExpiredDates = values?.contractExpiredDates.map((x: any) =>
      DateTimeHelper.formatDateTime(x.date, COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD)
    );
    setLoading(true);
    CompanyService.checkAvailabilityTaxNumber(requestObject).then((x: any) => {
      if (x?.data?.data) {
        Modal.confirm({
          title: 'Xác nhận hành động',
          cancelText: 'Quay lại',
          okText: 'Tiếp tục',
          onOk: async () => {
            CompanyService.saveOrUpdateCompany({
              ...values,
              noExpiredDates:
                values.noExpiredDates == null ? false : values.noExpiredDates,
              ticketRegisterSalaryAdvance:
                values.ticketRegisterSalaryAdvance == null
                  ? false
                  : values.ticketRegisterSalaryAdvance,
              ticketChangeInformation:
                values.ticketChangeInformation == null
                  ? false
                  : values.ticketChangeInformation,
              manageSalaryAdvanceRequest:
                values.manageSalaryAdvanceRequest == null
                  ? false
                  : values.manageSalaryAdvanceRequest,
              workDayType:
                values.workDayType == null ? 'DEFAULT' : values.workDayType,
              requireSocialInsuranceNumber:
                values.workDayType !== 'FIXED_WORKDAY'
                  ? false
                  : values.requireSocialInsuranceNumber,
              contractExpiredDates:
                contractExpiredDates[0]?.length > 0 ? contractExpiredDates : [],
              description: FunctionBase.checkTypeofVal(
                values.description,
                'string'
              )
                ? values.description.trim()
                : null,
              changeEnableReason: FunctionBase.checkTypeofVal(
                values.changeEnableReason,
                'string'
              )
                ? values.changeEnableReason.trim()
                : null,
              employeeInformationChange:
                values.employeeInformationChange == null
                  ? false
                  : values.employeeInformationChange,
              maxCreditLimitPerPeriod:
                FunctionBase.checkTypeofVal(
                  values.maxCreditLimitPerPeriod,
                  'number'
                ) && values.workDayType === 'FIXED_WORKDAY'
                  ? values.maxCreditLimitPerPeriod
                  : null,
            }).then((x: any) => {
              if (x?.code == 200 && x?.message == 'OK') {
                Notification.success({
                  content: `${
                    isNew ? 'Tạo mới' : 'Cập nhật'
                  } doanh nghiệp thành công`,
                  theme: 'light',
                });
                router.push(`/companies/${x?.data?.id}`);
                onClickCancel();
                reFetchCompanyData?.();
              }
            });
          },
          content:
            'Mã số thuế đã tồn tại ở Doanh nghiệp khác, bạn có chắc muốn tiếp tục?',
          onCancel: () => setLoading(false),
        });
      } else {
        CompanyService.saveOrUpdateCompany({
          ...values,
          noExpiredDates:
            values.noExpiredDates == null ? false : values.noExpiredDates,
          ticketRegisterSalaryAdvance:
            values.ticketRegisterSalaryAdvance == null
              ? false
              : values.ticketRegisterSalaryAdvance,
          ticketChangeInformation:
            values.ticketChangeInformation == null
              ? false
              : values.ticketChangeInformation,
          manageSalaryAdvanceRequest:
            values.manageSalaryAdvanceRequest == null
              ? false
              : values.manageSalaryAdvanceRequest,
          contractExpiredDates:
            contractExpiredDates[0]?.length > 0 ? contractExpiredDates : [],
          description: FunctionBase.checkTypeofVal(values.description, 'string')
            ? values.description.trim()
            : null,
          changeEnableReason: FunctionBase.checkTypeofVal(
            values.changeEnableReason,
            'string'
          )
            ? values.changeEnableReason.trim()
            : null,
          employeeInformationChange:
            values.employeeInformationChange == null
              ? false
              : values.employeeInformationChange,
          requireSocialInsuranceNumber:
            values.workDayType !== 'FIXED_WORKDAY'
              ? false
              : values.requireSocialInsuranceNumber,
          workDayType:
            values.workDayType == null ? 'DEFAULT' : values.workDayType,
          maxCreditLimitPerPeriod:
            FunctionBase.checkTypeofVal(
              values.maxCreditLimitPerPeriod,
              'number'
            ) && values.workDayType === 'FIXED_WORKDAY'
              ? values.maxCreditLimitPerPeriod
              : null,
        }).then((x: any) => {
          if (x?.code == 200 && x?.message == 'OK') {
            Notification.success({
              content: `${
                isNew ? 'Tạo mới' : 'Cập nhật'
              } doanh nghiệp thành công`,
              theme: 'light',
            });
            router.push(`/companies/${x?.data?.id}`);
            onClickCancel();
            reFetchCompanyData?.();
          } else {
            setLoading(false);
          }
        });
      }
    });
  };
  const checkDisableCreditLimit = () => {
    if (!isNew && watch('workDayType') === 'FIXED_WORKDAY') {
      return false;
    } else if (
      data?.workDayType == 'FIXED_WORKDAY' &&
      !isNew &&
      data?.creditLimit == null
    ) {
      return false;
    } else if (isNew) {
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    if (!data && !isLoading && !isNew) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (isLoading) return <></>;

  // if (data == null && !isLoading && !isNew) return <NotFound />;
  return (
    <SpinWrapper spinning={loading}>
      <FormWrapper
        pageTitle={isNew ? 'Tạo mới doanh nghiệp' : 'Cập nhật doanh nghiệp'}
        onCancel={onClickCancel}
        onSubmit={handleSubmit(onSubmitValues, (errors) =>
          FunctionBase.scrollToErrorField(errors as any, setFocus)
        )}
        loading={loading}
      >
        <div className="flex flex-col gap-4">
          <Collapse
            expandIcon={<IconPlus />}
            collapseIcon={<IconMinus />}
            className="p-0"
            defaultActiveKey={[
              'companyInformation',
              'creditInformation',
              'contractInformation',
              'configCompany',
            ]}
          >
            <Collapse.Panel
              header="THÔNG TIN DOANH NGHIỆP"
              itemKey="companyInformation"
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    required
                    field="name"
                    label="Tên doanh nghiệp"
                    component={(props: any) => (
                      <Input maxLength={200} showClear {...props} />
                    )}
                    errors={errors}
                    control={control}
                  />

                  <InputWrapper
                    required
                    field="shortName"
                    label="Tên doanh nghiệp viết tắt"
                    component={(props: any) => (
                      <Input maxLength={100} showClear {...props} />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    field="logo"
                    label="Logo"
                    component={(props: any) => (
                      <>
                        <div className="flex items-center gap-4">
                          {watch('logo') && (
                            <img
                              className="w-12 h-12 object-cover border-dashed border-gray-500 rounded p-0.5"
                              src={watch('logoUrl') as any}
                            />
                          )}

                          <FileManagerButton
                            onOk={(file: any) => {
                              setValue('logoUrl', file?.url);
                              if (file?.name) props.onChange(file?.name);
                            }}
                            url="upload"
                            urlGet="get-all"
                            fileSize={5120}
                            fileType=".jpg,.png,.jpeg"
                          />
                        </div>
                      </>
                    )}
                    errors={errors}
                    control={control}
                  />

                  <InputWrapper
                    required
                    field="taxIdentificationNumber"
                    label="Mã số thuế"
                    component={(props: any) => (
                      <Input
                        // formatter={(value) => `${value}`.replace(/\D/g, '')}
                        showClear
                        {...props}
                        maxLength={30}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    required
                    field="email"
                    label="Email đại diện"
                    component={(props: any) => (
                      <Input maxLength={200} showClear {...props} />
                    )}
                    errors={errors}
                    control={control}
                  />

                  <InputWrapper
                    required
                    field="phoneNumber"
                    label="Điện thoại liên hệ"
                    component={(props: any) => <Input showClear {...props} />}
                    errors={errors}
                    control={control}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    required
                    field="address"
                    label="Địa chỉ doanh nghiệp"
                    component={(props: any) => (
                      <Input maxLength={250} showClear {...props} />
                    )}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    required
                    field="workDayType"
                    label="Nhóm doanh nghiệp"
                    component={(props: any) => (
                      <Select
                        optionList={[
                          {
                            label: 'Nhóm doanh nghiệp mặc định',
                            value: 'DEFAULT',
                          },
                          {
                            label: 'Doanh nghiệp tải lên ngày công',
                            value: 'UPLOAD_WORKDAY',
                          },
                          {
                            label: 'Doanh nghiệp tích hợp dữ liệu',
                            value: 'API_MIGRATION',
                          },
                          {
                            label:
                              'Doanh nghiệp ứng lương không theo ngày công',
                            value: 'FIXED_WORKDAY',
                          },
                          {
                            label: 'Doanh nghiệp có thời gian tính hạn mức',
                            value: 'PAY_LIMIT_FIXED_DATE',
                          },
                        ]}
                        showClear={false}
                        {...props}
                        onSelect={(value: any) => {
                          switch (value) {
                            case 'FIXED_WORKDAY':
                              setValue('ticketRegisterSalaryAdvance', false);
                              setValue('ticketChangeInformation', false);
                              setValue('manageSalaryAdvanceRequest', false);
                              setValue('employeeInformationChange', true);
                              setValue('requireSocialInsuranceNumber', false);
                              setValue('autoGenEmployeeCode', false);
                              setValue('gracePeriod', 0);
                              setValue('companyPayRate', null);
                              break;
                            case 'API_MIGRATION':
                              setValue('ticketRegisterSalaryAdvance', false);
                              setValue('ticketChangeInformation', false);
                              setValue('manageSalaryAdvanceRequest', false);
                              setValue('employeeInformationChange', false);
                              setValue('autoGenEmployeeCode', false);
                              break;
                            default:
                              setValue('ticketRegisterSalaryAdvance', true);
                              setValue('ticketChangeInformation', true);
                              setValue('manageSalaryAdvanceRequest', false);
                              setValue('employeeInformationChange', true);
                              setValue('autoGenEmployeeCode', false);
                          }
                        }}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    // required
                    field="bankHolderName"
                    label="Tên chủ tài khoản doanh nghiệp"
                    component={(props: any) => <Input showClear {...props} />}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    // required
                    field="bankAccountNumber"
                    label="Số tài khoản ngân hàng"
                    component={(props: any) => (
                      <Input
                        maxLength={24}
                        // formatter={(value) => `${value}`.replace(/\D/g, '')}
                        showClear
                        {...props}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    // required
                    field="bankName"
                    label="Ngân hàng"
                    component={(props: any) => <Input showClear {...props} />}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    field="companySize"
                    label="Quy mô nhân sự"
                    component={(props: any) => (
                      <InputNumber showClear {...props} min={0} />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    required
                    field="companyRepresentativeName"
                    label="Người đại diện"
                    component={(props: any) => <Input showClear {...props} />}
                    errors={errors}
                    control={control}
                  />

                  <InputWrapper
                    required
                    field="companyRepresentativeRole"
                    label="Chức vụ"
                    component={(props: any) => <Input showClear {...props} />}
                    errors={errors}
                    control={control}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-rows-1 grid-flow-col gap-4">
                    <InputWrapper
                      field="enabled"
                      label="Trạng thái"
                      component={(props: any) => (
                        <Select
                          optionList={simpleEnabledOptions}
                          {...props}
                          onSelect={(value: any) => {
                            if (!isNew && value === false) {
                              return setVisible(true);
                            }
                          }}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                    <Modal
                      title="Vui lòng nêu lí do chuyển trạng thái hoạt động vào ô bên dưới"
                      visible={visible}
                      onOk={() => {
                        setVisible(false);
                        setValue('enabled', false);
                      }}
                      onCancel={() => {
                        setVisible(false);
                        setValue('enabled', true);
                      }}
                      closeOnEsc={true}
                      okText={'Xác nhận'}
                      cancelText={'Huỷ'}
                      okButtonProps={{
                        disabled:
                          watch('changeEnableReason')?.length > 0
                            ? false
                            : true,
                      }}
                    >
                      <InputWrapper
                        field="changeEnableReason"
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

                  <InputWrapper
                    field="description"
                    label="Ghi chú"
                    component={(props: any) => (
                      <TextArea
                        maxLength={2000}
                        maxCount={2000}
                        showCounter
                        showClear
                        {...props}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>
              </div>
            </Collapse.Panel>
            <Collapse.Panel
              header="CẤU HÌNH DOANH NGHIỆP"
              itemKey="configCompany"
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    field="ticketRegisterSalaryAdvance"
                    label="Phê duyệt đăng ký ứng lương"
                    component={(props: any) => (
                      <Switch {...props} checked={props.value} />
                    )}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    field="ticketChangeInformation"
                    label="Thay đổi thông tin tài khoản ứng lương"
                    component={(props: any) => (
                      <Switch {...props} checked={props.value} />
                    )}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    field="manageSalaryAdvanceRequest"
                    label="Phê duyệt ứng lương từng lần"
                    component={(props: any) => (
                      <Switch {...props} checked={props.value} />
                    )}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    field="autoGenEmployeeCode"
                    label="Tự động sinh mã nhân viên"
                    component={(props: any) => (
                      <Switch {...props} checked={props.value} />
                    )}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    field="employeeInformationChange"
                    label="HR chỉnh sửa thông tin nhân sự"
                    component={(props: any) => (
                      <Switch {...props} checked={props.value} />
                    )}
                    errors={errors}
                    control={control}
                  />
                  {watch('workDayType') == 'FIXED_WORKDAY' && (
                    <InputWrapper
                      field="requireSocialInsuranceNumber"
                      label="Mã số BHXH"
                      component={(props: any) => (
                        <Switch {...props} checked={props.value} />
                      )}
                      errors={errors}
                      control={control}
                    />
                  )}
                </div>
              </div>
            </Collapse.Panel>
            <Collapse.Panel
              header="THÔNG TIN HẠN MỨC"
              itemKey="creditInformation"
            >
              <div className="grid grid-cols-2 gap-4">
                <InputWrapper
                  required={watch('workDayType') !== 'FIXED_WORKDAY'}
                  field="creditLimit"
                  label="Tổng hạn mức tối đa"
                  component={(props: any) => (
                    <InputNumber
                      format="thousands"
                      // disabled={checkDisableCreditLimit()}
                      max={999999999999}
                      showClear
                      placeholder={"Nhập vào giá trị"}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />

                <InputWrapper
                  required={watch('workDayType') !== 'FIXED_WORKDAY'}
                  field="companyPayRate"
                  label="Tỉ lệ ứng thực tế (%)"
                  component={(props: any) => (
                    <InputNumberByType displayType={1} showClear {...props} />
                  )}
                  errors={errors}
                  control={control}
                />
                <InputWrapper
                  field="maxPayLimitRatioPerEmployee"
                  label="Hạn mức người lao động"
                  component={(props: any) => (
                    <InputNumberByType displayType={1} showClear {...props} placeholder={"Nhập vào giá trị %"} />
                  )}
                  control={control}
                />
                  <InputWrapper
                  field="maxPayLimitValuePerEmployee"
                  label="Hạn mức tối đa trên người lao động"
                  component={(props: any) => (
                    <InputNumber
                      format="thousands"
                      // disabled={checkDisableCreditLimit()}
                      max={999999999999}
                      showClear
                      {...props}

                      placeholder={"Nhập vào giá trị"}
                    />
                  )}
                  control={control}
                />
                {watch('workDayType') === 'FIXED_WORKDAY' && (
                  <InputWrapper
                    required
                    field="maxCreditLimitPerPeriod"
                    label="Hạn mức tối đa doanh nghiệp được ứng trong 1 kỳ công"
                    component={(props: any) => (
                      <InputNumber
                        format="thousands"
                        max={99999999999}
                        showClear
                        {...props}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                )}
              </div>
            </Collapse.Panel>
            <Collapse.Panel
              header="THÔNG TIN HỢP ĐỒNG"
              itemKey="contractInformation"
            >
              <div className="grid grid-cols-2 gap-4 mb-5">
                {/* <InputWrapper
                required
                field='contractEndDate'
                label='Ngày kết thúc hợp đồng'
                component={(props: any) => <DatePicker format='dd-MM-yyy' showClear {...props} />}
                errors={errors}
                control={control}
              /> */}
                {/* <InputWrapper
                required
                field='autoRenew'
                label='Tự động gia hạn'
                component={(props: any) => <Switch {...props} checked={props.value} />}
                errors={errors}
                control={control}
              /> */}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <InputWrapper
                  field="noExpiredDates"
                  label="Không thời hạn"
                  component={(props: any) => (
                    <Switch {...props} checked={props.value} />
                  )}
                  errors={errors}
                  control={control}
                />
                <InputWrapper
                  required
                  field="gracePeriod"
                  label="Ngày ân hạn"
                  component={(props: any) => (
                    <InputNumber
                      formatter={(value) => `${value}`.replace(/\D/g, '')}
                      showClear
                      {...props}
                      min={0}
                      max={999}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {fields.map((field, index) => {
                  return (
                    <section key={field.id}>
                      <p>Ngày kết thúc hợp đồng</p>
                      <div className="grid grid-cols-2 gap-4 grid-flow-col">
                        <Controller
                          name={`contractExpiredDates.${index}.date`}
                          control={control}
                          render={({ field: { ref, ...field } }) => (
                            <>
                              <DatePicker
                                format="dd-MM-yyy"
                                // showClear={false}
                                // insetInput
                                disabled={
                                  (!isNew &&
                                    moment(field.value).diff(
                                      moment(new Date()),
                                      'days'
                                    ) <= -1) ||
                                  watch('noExpiredDates')
                                }
                                onChange={(e) =>
                                  field.onChange && field.onChange(e)
                                }
                                value={field.value}
                                disabledDate={(current: any) => {
                                  return moment().add(-1, 'days') >= current;
                                }}
                              />
                              <div className="flex gap-4 ">
                                <Button
                                  onClick={() => remove(index)}
                                  disabled={
                                    fields.length == 1 ||
                                    (!isNew &&
                                      moment(field.value).diff(
                                        moment(new Date()),
                                        'days'
                                      ) <= -1) ||
                                    watch('noExpiredDates')
                                  }
                                >
                                  -
                                </Button>
                              </div>
                            </>
                          )}
                        />
                      </div>
                    </section>
                  );
                })}
              </div>
              <Button
                disabled={watch('noExpiredDates')}
                onClick={() => {
                  append({
                    date: new Date(),
                  });
                }}
              >
                Thêm ngày kết thúc hợp đồng +
              </Button>
            </Collapse.Panel>
          </Collapse>
        </div>
      </FormWrapper>
    </SpinWrapper>
  );
};
export const simpleEnabledOptions = [
  {
    label: 'Hoạt động',
    value: true,
  },
  {
    label: 'Không hoạt động',
    value: false,
  },
];
