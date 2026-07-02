import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { CompanyService } from '@services/companies';
import { StringHelper } from '@helpers/string.helper';
import { DateTimeHelper } from '@helpers/date-time.helper';
import moment from 'moment-timezone';
import { InputWrapper } from '@components/shared';
import { COMMON_FORMAT, TIMEZONE_FORMAT } from '@constants/common-format';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { useRouter } from 'next/router';

enum AccountStatusType {
  ALL,
  REGISTER_FLEX_PAY,
  NOT_REGISTER_FLEX_PAY,
  REGISTER_SALARY_ADVANCE,
  NOT_REGISTER_SALARY_ADVANCE,
}

enum DateRegisterType {
  ALL,
  REGISTER_SALARY_ADVANCE,
  REGISTER_FLEX_PAY,
}

export const FilterAccounts = (props: any) => {
  const {
    onFilter,
    refetch,
    currentProfile,
    companyId,
    hiddenPayLimit,
    setFilterExport,
    companyData,
  } = props;
  const router = useRouter();

  const {
    searchKey: searchKeyRouter,
    salaryAdvance: salaryAdvanceRouter,
    enable: enableRouter,
    accountStatus: accountStatusRouter,
    timeType: timeTypeRouter,
    endTime: endTimeRouter,
    startTime: startTimeRouter,
  } = router.query;
  const { data, isLoading } = useQuery(
    ['accounts-salary-advance', companyId],
    () => CompanyService.getTransactionInfo(companyId),
    {
      enabled: companyId !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const {
    control,
    reset,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      salaryAdvance: '',
      searchKey: '',
      enable: '',
      dateRanges: [''],
      accountStatus: 'ALL',
      timeType: 'ALL',
      page: 1,
      currentPage: 1,
      size: 10,
      sort: ['updatedAt,desc'],
    },
  });
  useEffect(() => {
    reset({
      ...getValues(),
      searchKey: searchKeyRouter ? searchKeyRouter : ('' as any),
      salaryAdvance: String(salaryAdvanceRouter || ''),
      enable: String(enableRouter || ''),
      accountStatus: String(accountStatusRouter || 'ALL'),
      timeType: String(timeTypeRouter || 'ALL'),
      dateRanges: startTimeRouter
        ? [startTimeRouter as string, endTimeRouter as string]
        : [],
    });
    setFilterExport &&
      setFilterExport({
        searchKey: searchKeyRouter ? searchKeyRouter : ('' as any),
        salaryAdvance: String(salaryAdvanceRouter || ''),
        enable: String(enableRouter || ''),
        accountStatus: String(accountStatusRouter || 'ALL'),
        timeType: String(timeTypeRouter || 'ALL'),
        endTime: endTimeRouter || '',
        startTime: startTimeRouter || '',
      });
    onFilter &&
      onFilter({
        ...getValues(),
        searchKey: searchKeyRouter ? searchKeyRouter : ('' as any),
        salaryAdvance: String(salaryAdvanceRouter || ''),
        enable: String(enableRouter || ''),
        accountStatus: String(accountStatusRouter || 'ALL'),
        timeType: String(timeTypeRouter || 'ALL'),
        dateRanges: startTimeRouter
          ? [startTimeRouter as string, endTimeRouter as string]
          : [],
      });
    refetch && refetch();
  }, [router.query]);
  const onSubmitValues = (values: any) => {
    onFilter &&
      onFilter({
        // ...values,
        searchKey: values.searchKey.trim(),
        salaryAdvance: values.salaryAdvance,
        enable: values.enable,
        endTime: DateTimeHelper.fomartDateRangeSubmit(
          DateTimeHelper.addDays(values.dateRanges[1], 1)
        ),
        accountStatus: values.accountStatus,
        timeType: values.timeType,
        startTime: DateTimeHelper.fomartDateRangeSubmit(values.dateRanges[0]),
        page: 1,
        size: 10,
        sort: ['updatedAt,desc'],
      });
    router.push({
      pathname: router.pathname,
      // Thêm search query vào URL
      query: {
        ...router.query,
        page: 1,
        searchKey: values.searchKey.trim(),
        salaryAdvance: values.salaryAdvance,
        enable: values.enable,
        endTime: DateTimeHelper.formatDateTime(
          values.dateRanges[1],
          COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
        ),
        accountStatus: values.accountStatus,
        timeType: values.timeType,
        startTime: DateTimeHelper.formatDateTime(
          values.dateRanges[0],
          COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
        ),
      },
    });
    setFilterExport &&
      setFilterExport({
        searchKey: values.searchKey.trim(),
        salaryAdvance: values.salaryAdvance,
        enable: values.enable,
        endTime: values.dateRanges[1]
          ? DateTimeHelper.setEndTime(
              moment(values.dateRanges[1]),
              TIMEZONE_FORMAT.GMT7
            )
              .tz(TIMEZONE_FORMAT.GMT0)
              .format()
          : '',
        accountStatus: values.accountStatus,
        timeType: values.timeType,
        startTime: DateTimeHelper.fomartDateRangeSubmit(values.dateRanges[0]),
      });
    refetch && refetch();
  };
  return (
    <div className="">
      <form
        onKeyDown={(e) => {
          e.key === 'Enter' && e.preventDefault();
          e.key === 'Enter' && onSubmitValues(getValues());
        }}
        onSubmit={handleSubmit(onSubmitValues)}
      >
        <div className="grid grid-cols-2 gap-5">
          <InputWrapper
            field="searchKey"
            label="Tìm kiếm"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Input
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="Tên nhân viên/Mã nhân viên/Số điện thoại/CCCD/Email"
                size="large"
                {...e}
              />
            )}
          />
          {!hiddenPayLimit && (
            <>
              <InputWrapper
                field="salaryAdvance"
                label="Trạng thái ứng lương"
                control={control}
                errors={errors}
                component={(e: any) => (
                  <Select
                    optionList={listSortType}
                    size="large"
                    placeholder={'Trạng thái ứng lương'}
                    // style={{ width: 320 }}
                    {...e}
                    showClear={false}
                  />
                )}
              />
              <InputWrapper
                field="enable"
                label="Tình trạng làm việc"
                control={control}
                errors={errors}
                component={(e: any) => (
                  <Select
                    placeholder="Tình trạng làm việc"
                    optionList={listStatusEmp}
                    size="large"
                    // style={{ width: 370 }}
                    {...e}
                  />
                )}
              />
              <InputWrapper
                field="accountStatus"
                label="Trạng thái tài khoản"
                control={control}
                errors={errors}
                component={(e: any) => (
                  <Select
                    placeholder="Trạng thái tài khoản"
                    optionList={[
                      {
                        value: AccountStatusType[AccountStatusType.ALL],
                        label: 'Tất cả',
                      },
                      {
                        value:
                          AccountStatusType[
                            AccountStatusType.REGISTER_FLEX_PAY
                          ],
                        label: 'Đã đăng ký Flexpay',
                      },
                      {
                        value:
                          AccountStatusType[
                            AccountStatusType.NOT_REGISTER_FLEX_PAY
                          ],
                        label: 'Chưa đăng ký Flexpay',
                        disabled:
                          watch('timeType') ==
                            DateRegisterType[
                              DateRegisterType.REGISTER_FLEX_PAY
                            ] ||
                          watch('timeType') ==
                            DateRegisterType[
                              DateRegisterType.REGISTER_SALARY_ADVANCE
                            ],
                      },
                      {
                        value:
                          AccountStatusType[
                            AccountStatusType.REGISTER_SALARY_ADVANCE
                          ],
                        label: 'Đã đăng ký dịch vụ ứng lương',
                      },
                      {
                        value:
                          AccountStatusType[
                            AccountStatusType.NOT_REGISTER_SALARY_ADVANCE
                          ],
                        label: 'Chưa đăng ký dịch vụ ứng lương',
                        disabled:
                          watch('timeType') ==
                          DateRegisterType[
                            DateRegisterType.REGISTER_SALARY_ADVANCE
                          ],
                      },
                    ]}
                    size="large"
                    showClear={false}
                    // style={{ width: 320 }}
                    {...e}
                  />
                )}
              />
              <InputWrapper
                field="timeType"
                label="Xem theo ngày"
                control={control}
                errors={errors}
                component={(e: any) => (
                  <Select
                    placeholder="Xem theo ngày"
                    optionList={[
                      {
                        value: DateRegisterType[DateRegisterType.ALL],
                        label: 'Tất cả',
                      },
                      {
                        value:
                          DateRegisterType[
                            DateRegisterType.REGISTER_SALARY_ADVANCE
                          ],
                        label: 'Ngày đăng ký ứng lương',
                      },
                      {
                        value:
                          DateRegisterType[DateRegisterType.REGISTER_FLEX_PAY],
                        label: 'Ngày đăng ký tài khoản',
                      },
                    ]}
                    size="large"
                    showClear={false}
                    onSelect={(value: any) => {
                      setValue(
                        'accountStatus',
                        AccountStatusType[AccountStatusType.ALL]
                      );
                    }}
                    // style={{ width: 370 }}
                    {...e}
                  />
                )}
              />
              <InputWrapper
                field="dateRanges"
                label="Lựa chọn thời gian"
                control={control}
                errors={errors}
                component={(e: any) => (
                  <DatePicker
                    size="large"
                    className="w-full"
                    type="dateRange"
                    insetInput
                    format="dd/MM/yyyy"
                    {...e}
                  />
                )}
              />
            </>
          )}
          <div>
            <label>Hành động</label>
            <Button
              icon={<IconFilter />}
              theme="solid"
              onClick={() => onSubmitValues(getValues())}
              // htmlType="submit"
              type="secondary"
              className="w-full mt-2"
            >
              Tìm kiếm
            </Button>
          </div>
          <div>
            {!hiddenPayLimit && (
              <div className="bg-[#F1F1F1] rounded-lg p-2">
                <p className="text-[#4E4E4E] font-bold">
                  Tổng hạn mức NLĐ: &nbsp;&nbsp;&nbsp;
                  {StringHelper.formatVND(data?.maxPaxLimit, '0')}
                </p>
              </div>
            )}
            <div>
              <ProtectedWrapper
                allowedRoles={[
                  UserRole.ACCOUNTANT,
                  UserRole.BEAM_ADMIN,
                  UserRole.CONTROLLER,
                  UserRole.CUSTOMER_SERVICE,
                  UserRole.RECONCILER,
                  UserRole.SALE,
                  UserRole.SUPER_ADMIN,
                ]}
              >
                <div>
                  {!hiddenPayLimit && (
                    <div className="bg-[#F1F1F1] rounded-lg p-2 mt-2">
                      <p className="text-[#7e6666] font-bold">
                        Hạn mức còn lại của DN:{' '}
                        {StringHelper.formatVND(
                          data?.profilePayLimit - data?.totalAdvanced,
                          0
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </ProtectedWrapper>
            </div>
            <div>
              <ProtectedWrapper
                allowedRoles={[
                  UserRole.ACCOUNTANT,
                  UserRole.BEAM_ADMIN,
                  UserRole.CONTROLLER,
                  UserRole.CUSTOMER_SERVICE,
                  UserRole.RECONCILER,
                  UserRole.SALE,
                  UserRole.SUPER_ADMIN,
                ]}
              >
                <div>
                  {!hiddenPayLimit && (
                    <div className="bg-[#F1F1F1] rounded-lg p-2 mt-2">
                      <p className="text-[#3a2525] font-bold">
                        Hạn mức khả dụng NLĐ:{' '}
                        {StringHelper.formatVND(data?.remainingPayLimit, 0)}
                      </p>
                    </div>
                  )}
                </div>
              </ProtectedWrapper>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const listSortType = [
  { value: '', label: 'Tất cả' },
  { value: 'true', label: 'Mở ứng lương' },
  { value: 'false', label: 'Khoá ứng lương' },
];

const listStatusEmp = [
  { value: '', label: 'Tất cả' },
  { value: 'true', label: 'Đang làm việc' },
  { value: 'false', label: 'Đã nghỉ việc' },
];
