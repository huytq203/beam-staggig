import {
  InputNumber,
  InputNumberByType,
  InputWrapper,
} from '@components/shared';
import { FormWrapper } from '@components/widgets/ContentWrapper';
import {
  COMMON_FORMAT,
  TIMEZONE_FORMAT,
  simpleStatusOptions,
} from '@constants/index';
import {
  DatePicker,
  Modal,
  Notification,
  Select,
  Switch,
  TextArea,
} from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { yupResolver } from '@hookform/resolvers/yup';
import { CompanyService } from '@services/companies';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { CreateProfileSchema } from '../../../../validations/CreateProfile.schema';
import SelectConfigPayFormProfile from '../SelectConfigPayFormProfile';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
import SelectConfigPayPolicyProfile from '../SelectConfigPayPolicyProfile';
import { FunctionBase } from '@helpers/fuction-base.helpers';
const payFeeTypeOptions = [
  {
    label: 'Hạn mức theo giá trị cố định',
    value: 0,
  },
  {
    label: 'Hạn mức theo % lương',
    value: 1,
  },
];

export const CreateCompanyProfileForm = (props: any) => {
  const {
    onCancel,
    onSave,
    profileId,
    isNew,
    reFetchProfileData,
    currentProfile,
    setCheckData,
    originalProfileRoute,
  } = props;
  const router = useRouter();
  const { companyId } = router.query;

  const {
    data: companyData,
    isLoading: isLoadingCompanyData,
    isFetching: isFetchingCompanyData,
    refetch: reFetchCompanyData,
  } = useQuery(
    ['company-data', companyId],
    async () => {
      const response = await CompanyService.getCompany(companyId);
      return response;
    },
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['profile_detail', profileId],
    () => CompanyService.getProfile(profileId),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CUSTOMER_SERVICE,
  ]);
  const [visible, setVisible] = useState(false);
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
    resolver: yupResolver(CreateProfileSchema),
    defaultValues: {
      payLimitType: currentProfile?.payLimitType ?? payFeeTypeOptions[0].value,
      status: 0,
      payForm: null,
      validDateTimeRange: [new Date(), new Date()],
      payPolicy: null,
      startSalaryAdvanceDay: null,
      endSalaryAdvanceDay: null,
      workDayType: companyData?.workDayType ?? 'DEFAULT',
      uploadEmployeeStartDay: null,
      uploadEmployeeEndDay: null,
      payLimitByDateEnabledStartDay: null,
      payLimitByDateEnabledEndDay: null,
      // payLimitWeekendEnabled: false,
    } as any,
  });

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
      const validDateTimeRange = [startDate, endDate];
      let lastWorkingDayOfPeriod;
      if (data?.payForm == 1) {
        lastWorkingDayOfPeriod = data?.lastWorkingDayOfPeriod
          .split(',')
          .map((x: any) => parseInt(x));
      } else {
        lastWorkingDayOfPeriod = parseInt(data?.lastWorkingDayOfPeriod);
      }

      let workday;
      if (data?.payForm == 1) {
        workday = data?.workday.split(',').map((x: any) => parseInt(x));
      } else {
        workday = parseInt(data?.workday);
      }

      let payDay;
      if (data?.payDay) {
        if (data?.payForm == 1) {
          payDay = data?.payDay.split(',').map((x: any) => parseInt(x));
        } else {
          payDay = parseInt(data?.payDay);
        }
      }
      reset({
        ...data,
        workday: workday,
        payDay: payDay,
        lastWorkingDayOfPeriod: lastWorkingDayOfPeriod,
        validDateTimeRange: validDateTimeRange,
        uploadEmployeeStartDay: parseInt(data?.uploadEmployeeStartDay),
        uploadEmployeeEndDay: parseInt(data?.uploadEmployeeEndDay),
        status: data?.status ? 1 : 0,
        workDayType: companyData && companyData?.workDayType,
      });
    } else {
      reset({
        payLimitType: 0,
        workDayType: companyData && companyData?.workDayType,
      });
    }
  }, [isLoading, isFetching, isLoadingCompanyData, isFetchingCompanyData]);

  const getStringFromSelect = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    return value;
  };
  const checkDisabled = (filedName: any) => {
    if (!isNew && companyData?.workDayType !== 'FIXED_WORKDAY') {
      return true;
    } else if (
      !isNew &&
      data[filedName] !== null &&
      data[filedName] !== undefined
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onSaveProfile = (values: any) => {
    const { id: companyId } = companyData;

    const requestObject = {
      id: values.id,
      companyId: companyId,
      creditLimit: values.creditLimit,
      maxPayLimitValuePerEmployee: values.maxPayLimitValuePerEmployee,
      maxPayLimitRatioPerEmployee: values.maxPayLimitRatioPerEmployee,
      startTime: values.startTime,
      endTime: values.endTime,
      payForm: values.payForm,
      payLimitType: values.payLimitType,
      workday: getStringFromSelect(values.workday),
      payDay: getStringFromSelect(values.payDay),
      payPolicy: values.payPolicy,
      lastWorkingDayOfPeriod: getStringFromSelect(
        values.lastWorkingDayOfPeriod
      ),
      payLimitByDateEnabledStartDay: getStringFromSelect(
        values.payLimitByDateEnabledStartDay
      ),
      payLimitByDateEnabledEndDay: getStringFromSelect(
        values.payLimitByDateEnabledEndDay
      ),
      payLimitSalary: values.payLimitSalary,
      status: values.status,
      reason: values.reason,
      startSalaryAdvanceDay: values.startSalaryAdvanceDay,
      endSalaryAdvanceDay: values.endSalaryAdvanceDay,
      uploadEmployeeStartDay: values.uploadEmployeeStartDay,
      uploadEmployeeEndDay: values.uploadEmployeeEndDay,
      // payLimitWeekendEnabled: values.payLimitWeekendEnabled,
    };
    setLoading(true);
    return CompanyService.saveOrUpdateProfile(requestObject).then((x: any) => {
      if (x) {
        let opts: any = {
          with: 3,
          Position: 'topRight',
          content: `${
            values?.id
              ? 'Cập nhật hồ sơ thành công'
              : 'Tạo mới hồ sơ thành công'
          } `,
          theme: 'light',
        };

        Notification.success({ ...opts });

        router.push(originalProfileRoute);
        reFetchProfileData();
      } else {
        let opts: any = {
          with: 3,
          Position: 'topRight',
          content: `${
            values?.id ? 'Cập nhật hồ sơ thất bại!' : 'Tạo mới hồ sơ thất bại'
          } `,
          theme: 'light',
        };

        Notification.error({ ...opts });
        setLoading(false);
      }
    })
      .catch(() => {
        setLoading(false);
      });
  };

  const onSubmit = (values: any) => {
    const requestObject = {
      exceptedProfileId: values.id,
      companyId: companyId,
      startTime: DateTimeHelper.fomartDateRangeSubmit(
        values.validDateTimeRange[0]
      ),
      endTime: DateTimeHelper.fomartDateRangeSubmit(
        values.validDateTimeRange[1]
      ),
    };
    let endDate = moment(values?.validDateTimeRange[1]).utcOffset(7);
    endDate.set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
    endDate.toISOString();
    const payload = {
      ...values,
      startTime: DateTimeHelper.fomartDateRangeSubmit(
        values.validDateTimeRange[0]
      ),
      endTime: endDate.tz(TIMEZONE_FORMAT.GMT0).format(),
    };
    setLoading(true);
    return CompanyService.checkOverlapProfile(requestObject)
      .then((x: any) => {
        if (x) {
          Modal.error({
            title: 'Đã có profile hoạt động',
            cancelText: 'Đóng',
            okButtonProps: {
              style: {
                display: 'none',
              },
            },
            onCancel: () => setLoading(false),
            content:
              'Có profile đang hoạt động trong thời gian của profile bạn vừa chọn. Vui lòng lựa chọn thời gian hoạt động khác của profile',
          });
          setLoading(false);
        } else {
          return onSaveProfile && onSaveProfile(payload);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!data && !isLoading && !isNew) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (isLoading) return <></>;

  return (
    <SpinWrapper spinning={loading}>
      <FormWrapper
        pageTitle={`${isNew ? 'Thêm mới hồ sơ' : 'Chỉnh sửa hồ sơ'}`}
        onCancel={onCancel}
        onSubmit={handleSubmit(onSubmit, (errors) =>
          FunctionBase.scrollToErrorField(errors as any, setFocus)
        )}
        loading={loading}
      >
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper
                required
                field="payLimitType"
                label="Chính sách hạn mức ứng"
                component={(props: any) => (
                  <Select
                    disabled={!isNew && data?.status == 2}
                    optionList={payFeeTypeOptions}
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />
              {watch('payLimitType') == 0 ? (
                ''
              ) : (
                <InputWrapper
                  required
                  field="payLimitSalary"
                  label={
                    watch('payLimitType') == 0
                      ? 'Hạn mức cố định'
                      : 'Hạn mức theo % lương'
                  }
                  component={(props: any) => (
                    <InputNumberByType
                      disabled={!isNew && data?.status == 2}
                      displayType={watch('payLimitType')}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              )}
            </div>

            <InputWrapper
              required
              field="creditLimit"
              label="Tổng hạn mức"
              component={(props: any) => (
                <InputNumber
                  showClear
                  autoComplete="off"
                  // disabled={!isNew}
                  placeholder="Nhập vào tổng hạn mức"
                  suffix={'VNĐ'}
                  min={0}
                  format="thousands"
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />

              <InputWrapper
                  field="maxPayLimitRatioPerEmployee"
                  label={
                      'Tỉ lệ hạn mức mỗi người lao động'
                  }
                  component={(props: any) => (
                    <InputNumberByType
                      disabled={!isNew && data?.status == 2}
                      displayType={'1'}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
            <InputWrapper
              field="maxPayLimitValuePerEmployee"
              label="Hạn mức tối đa mỗi người lao động"
              component={(props: any) => (
                <InputNumber
                  showClear
                  autoComplete="off"
                  // disabled={!isNew}
                  placeholder="Nhập vào hạn mức tối đa mỗi người lao động"
                  suffix={'VNĐ'}
                  min={0}
                  format="thousands"
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
          </div>


          <InputWrapper
            required
            field="validDateTimeRange"
            label="Ngày bắt đầu / Ngày kết thúc"
            component={(props: any) => (
              <DatePicker
                className="dateTime"
                disabled={!isNew && data?.status == 2}
                showClear={false}
                type="dateRange"
                format="dd/MM/yyyy"
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />
          <>
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper
                required={
                  companyData?.workDayType !== 'FIXED_WORKDAY' &&
                  companyData?.workDayType !== 'PAY_LIMIT_FIXED_DATE'
                }
                field="payForm"
                label="Loại hình trả lương"
                component={(props: any) => (
                  <SelectConfigPayFormProfile
                    // disabled={checkDisabled('payForm')}
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />
              <InputWrapper
                required={
                  companyData?.workDayType !== 'FIXED_WORKDAY' &&
                  companyData?.workDayType !== 'PAY_LIMIT_FIXED_DATE'
                }
                field="payDay"
                label="Ngày trả lương"
                component={(props: any) => (
                  <Select
                    // disabled={checkDisabled('payDay')}
                    {...props}
                    multiple={watch('payForm') == 1}
                    max={2}
                    value={
                      watch('payForm') == 0 && watch('payDay')?.length == 2
                        ? ''
                        : watch('payDay')
                    }
                  >
                    {Array.from(Array(31).keys()).map((x: any) => (
                      <Select.Option key={x + 1} value={x + 1}>
                        Ngày {x + 1}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                errors={errors}
                control={control}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 ">
              <InputWrapper
                // required={companyData?.workDayType !== 'FIXED_WORKDAY'}
                required
                field="workday"
                label="Ngày bắt đầu Chu kỳ công"
                component={(props: any) => (
                  <Select
                    disabled={checkDisabled('workday')}
                    {...props}
                    multiple={watch('payForm') == 1}
                    max={2}
                    value={
                      watch('payForm') == 0 && watch('workday')?.length == 2
                        ? ''
                        : watch('workday')
                    }
                  >
                    {Array.from(Array(31).keys()).map((x: any) => (
                      <Select.Option key={x + 1} value={x + 1}>
                        Ngày {x + 1}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                errors={errors}
                control={control}
              />
              <InputWrapper
                required={
                  companyData?.workDayType !== 'FIXED_WORKDAY' &&
                  companyData?.workDayType !== 'PAY_LIMIT_FIXED_DATE'
                }
                field="lastWorkingDayOfPeriod"
                label="Ngày chốt công"
                component={(props: any) => (
                  <Select
                    // disabled={checkDisabled('lastWorkingDayOfPeriod')}
                    {...props}
                    multiple={watch('payForm') == 1}
                    max={2}
                    value={
                      watch('payForm') == 0 &&
                      watch('lastWorkingDayOfPeriod')?.length == 2
                        ? ''
                        : watch('lastWorkingDayOfPeriod')
                    }
                  >
                    {Array.from(Array(31).keys()).map((x: any) => (
                      <Select.Option key={x + 1} value={x + 1}>
                        Ngày {x + 1}
                      </Select.Option>
                    ))}
                    <Select.Option value={32}>Ngày cuối tháng</Select.Option>
                  </Select>
                )}
                errors={errors}
                control={control}
              />
            </div>
          </>
          {companyData?.workDayType === 'FIXED_WORKDAY' && (
            <div className="grid grid-cols-2 gap-4 ">
              <InputWrapper
                required
                field="uploadEmployeeStartDay"
                label="Ngày bắt đầu tải lên danh sách NLĐ"
                component={(props: any) => (
                  <Select disabled={!isNew && data?.status == 2} {...props}>
                    {Array.from(Array(31).keys()).map((x: any) => (
                      <Select.Option key={x + 1} value={x + 1}>
                        Ngày {x + 1}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                errors={errors}
                control={control}
              />
              <InputWrapper
                required
                field="uploadEmployeeEndDay"
                label="Ngày kết thúc tải lên danh sách NLĐ"
                component={(props: any) => (
                  <Select disabled={!isNew && data?.status == 2} {...props}>
                    {Array.from(Array(31).keys()).map((x: any) => (
                      <Select.Option key={x + 1} value={x + 1}>
                        Ngày {x + 1}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                errors={errors}
                control={control}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 ">
            <InputWrapper
              required={companyData?.workDayType === 'FIXED_WORKDAY'}
              field="startSalaryAdvanceDay"
              label="Ngày bắt đầu ứng lương"
              component={(props: any) => (
                <Select
                  disabled={!isNew && data?.status == 2}
                  {...props}
                  showClear
                >
                  {Array.from(Array(31).keys()).map((x: any) => (
                    <Select.Option key={x + 1} value={x + 1}>
                      Ngày {x + 1}
                    </Select.Option>
                  ))}
                </Select>
              )}
              errors={errors}
              control={control}
            />
            <InputWrapper
              required={companyData?.workDayType === 'FIXED_WORKDAY'}
              field="endSalaryAdvanceDay"
              label="Ngày kết thúc ứng lương"
              component={(props: any) => (
                <Select
                  disabled={!isNew && data?.status == 2}
                  {...props}
                  showClear
                >
                  {Array.from(Array(31).keys()).map((x: any) => (
                    <Select.Option key={x + 1} value={x + 1}>
                      Ngày {x + 1}
                    </Select.Option>
                  ))}
                </Select>
              )}
              errors={errors}
              control={control}
            />
          </div>
          <div className="grid grid-cols-2 gap-4" data-testid={'status'}>
            <InputWrapper
              // required={companyData?.workDayType !== 'FIXED_WORKDAY'}
              field="payPolicy"
              label="Kỳ trả lương"
              component={(props: any) => (
                <SelectConfigPayPolicyProfile {...props} />
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
                  disabled={!isNew && data?.status == 2}
                  optionList={simpleStatusOptions}
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
          {companyData?.workDayType === 'PAY_LIMIT_FIXED_DATE' && (
            <div className="grid grid-cols-2 gap-4 ">
              <InputWrapper
                required={companyData?.workDayType === 'PAY_LIMIT_FIXED_DATE'}
                field="payLimitByDateEnabledStartDay"
                label="Ngày bắt đầu tính hạn mức"
                component={(props: any) => (
                  <Select disabled={data?.status == 2} {...props} showClear>
                    {Array.from(Array(31).keys()).map((x: any) => {
                      return (
                        <Select.Option value={x + 1}>
                          Ngày {x + 1}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
                errors={errors}
                control={control}
              />
              <InputWrapper
                required={companyData?.workDayType === 'PAY_LIMIT_FIXED_DATE'}
                field="payLimitByDateEnabledEndDay"
                label="Ngày kết thúc tính hạn mức"
                component={(props: any) => (
                  <Select disabled={data?.status == 2} {...props} showClear>
                    {Array.from(Array(31).keys()).map((x: any) => (
                      <Select.Option
                        // disabled={x <= watch('lastWorkingDayOfPeriod')}
                        value={x + 1}
                      >
                        Ngày {x + 1}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                errors={errors}
                control={control}
              />
            </div>
          )}
          {/* {companyData?.workDayType === 'PAY_LIMIT_FIXED_DATE' && (
            <div className="grid grid-cols-2 gap-4 ">
              <InputWrapper
                field="payLimitWeekendEnabled"
                label="Hạn mức Thứ 7 và CN"
                component={(props: any) => (
                  <Switch checked={props.value} {...props} />
                )}
                errors={errors}
                control={control}
              />
            </div>
          )} */}
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
      </FormWrapper>
    </SpinWrapper>
  );
};
