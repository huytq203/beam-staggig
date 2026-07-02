import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ExportReportTransactionListButton } from './ExportReportTransaction';
import { InputWrapper } from '@components/shared';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import {
  listSenderBank,
  listStatusTransaction,
  listTranferTransaction,
} from '@constants/select-options.constants';
import { TIMEZONE_FORMAT } from '@constants/common-format';
import { CustomMonthRangePicker } from '@components/shared/CustomMonthRangePicker';
import { CompanySelect } from '@components/widgets';
import { useRouter } from 'next/router';

type InputForm = {
  data: any;
  page: number;
  size: number;
  companyId: any;
  status: string | null;
  dateRanges: any;
  transferType: string | null;
  bankSource: string | null;
};
export const ReportTransactionFilter = (props: any) => {
  const { onSubmit, refetch, setFilter, companyData } = props;
  const router = useRouter();
  const {
    companyId: companyRouter,
    startDate: startDate,
    endDate: endDate,
    data: dataRouter,
  } = router.query;
  const [exportDate, setExportDate] = useState({});

  const filterByParam = () => {
    // Nếu có startDate và endDate (bất kể giá trị companyRouter, dataRouter)
    if (startDate && endDate) {
      return [
        DateTimeHelper.fomartDateRangeSubmit(
          DateTimeHelper.setStartTime(startDate, TIMEZONE_FORMAT.GMT7).format()
        ),
        DateTimeHelper.fomartDateRangeSubmit(
          DateTimeHelper.setEndTime(endDate, TIMEZONE_FORMAT.GMT7).format()
        ),
      ];
    }

    // Nếu không có startDate, endDate, dataRouter, companyRouter
    if (!startDate && !endDate && !dataRouter && !companyRouter) {
      return [
        DateTimeHelper.fomartDateRangeSubmit(
          DateTimeHelper.setStartTime(
            DateTimeHelper.getCurrentDate(),
            TIMEZONE_FORMAT.GMT7
          ).format()
        ),
        DateTimeHelper.fomartDateRangeSubmit(
          DateTimeHelper.setEndTime(
            DateTimeHelper.getCurrentDate(),
            TIMEZONE_FORMAT.GMT7
          ).format()
        ),
      ];
    }

    // Nếu không có startDate, endDate, có dataRouter, không có companyRouter
    if (!startDate && !endDate && dataRouter && !companyRouter) {
      const { startOfMonth, endOfMonth } = DateTimeHelper.getStartandEndMonth();
      return [
        DateTimeHelper.fomartDateRangeSubmit(
          DateTimeHelper.setStartTime(
            startOfMonth,
            TIMEZONE_FORMAT.GMT7
          ).format()
        ),
        DateTimeHelper.fomartDateRangeSubmit(
          DateTimeHelper.setEndTime(endOfMonth, TIMEZONE_FORMAT.GMT7).format()
        ),
      ];
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InputForm>({
    // resolver: yupResolver(ReportSchema),
    defaultValues: {
      data: dataRouter ? dataRouter : '',
      page: 1,
      size: 10,
      companyId: companyRouter ? companyRouter : '',
      status: dataRouter ? 'SUCCESS' : '',
      dateRanges: filterByParam(),
      transferType: '',
      bankSource: '',
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      companyId: companyRouter ? companyRouter : '',
      data: dataRouter ? dataRouter : '',
      status: dataRouter ? 'SUCCESS' : '',
      dateRanges: filterByParam(),
    });
    setFilter &&
      setFilter({
        data: dataRouter ? dataRouter : '',
        page: 1,
        size: 10,
        companyId: companyRouter ? companyRouter : '',
        endTime: watch('dateRanges')[1],
        startTime: watch('dateRanges')[0],
        status: dataRouter ? 'SUCCESS' : '',
        transferType: '',
        bankSource: '',
      });
    refetch();
  }, [router.query]);
  useEffect(() => {
    setExportDate({
      endTime: DateTimeHelper.fomartDateRangeSubmit(watch('dateRanges')[1]),
      startTime: DateTimeHelper.fomartDateRangeSubmit(watch('dateRanges')[0]),
      companyId: watch('companyId'),
      refNum: watch('data').trim(),
      status: watch('status'),
      transferType: watch('transferType'),
      bankSource: watch('bankSource'),
    });
  }, [
    watch('dateRanges'),
    watch('companyId'),
    watch('data'),
    watch('status'),
    watch('transferType'),
    watch('bankSource'),
  ]);

  const onSubmitValues = (values: any) => {
    onSubmit &&
      onSubmit({
        data: values?.data.trim(),
        page: 1,
        size: 10,
        companyId: values.companyId,
        endTime: DateTimeHelper.fomartDateRangeSubmit(watch('dateRanges')[1]),
        startTime: DateTimeHelper.fomartDateRangeSubmit(watch('dateRanges')[0]),
        status: values.status,
        transferType: values.transferType,
        bankSource: values.bankSource,
      });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <InputWrapper
              field="data"
              label="Tìm kiếm"
              control={control}
              errors={errors}
              component={(customProps: any) => (
                <Input
                  size="large"
                  prefix={<IconSearch />}
                  showClear
                  autoComplete="off"
                  placeholder="Mã nhân viên/Tên đăng nhập/Mã giao dịch/Chủ tài khoản"
                  {...customProps}
                />
              )}
            />
            {companyData?.length > 1 && (
              <InputWrapper
                field="companyId"
                label="Doanh nghiệp"
                control={control}
                errors={errors}
                component={(customProps: any) => (
                  <CompanySelect {...customProps} multiple={false} />
                )}
              />
            )}
            <InputWrapper
              field="status"
              label="Trạng thái giao dịch"
              control={control}
              errors={errors}
              component={(customProps: any) => (
                <Select
                  size="large"
                  optionList={listStatusTransaction}
                  {...customProps}
                />
              )}
            />
            <InputWrapper
              field="transferType"
              label="Hình thức giao dịch"
              control={control}
              errors={errors}
              component={(customProps: any) => (
                <Select
                  size="large"
                  optionList={listTranferTransaction}
                  {...customProps}
                />
              )}
            />
            <InputWrapper
              field="dateRanges"
              label="Lựa chọn thời gian"
              control={control}
              errors={errors}
              component={(customProps: any) => (
                <CustomMonthRangePicker
                  className="w-full"
                  type="dateTime"
                  placeholder="Ngày"
                  format="dd/MM/yyyy HH:mm:ss"
                  {...customProps}
                  size="large"
                />
              )}
            />
            <ProtectedWrapper
              allowedRoles={[
                UserRole.ACCOUNTANT,
                UserRole.BEAM_ADMIN,
                UserRole.RECONCILER,
                UserRole.SUPER_ADMIN,
                UserRole.CONTROLLER,
                UserRole.CUSTOMER_SERVICE,
                UserRole.SALE,
              ]}
            >
              <InputWrapper
                field="bankSource"
                label="Ngân hàng đi tiền"
                control={control}
                errors={errors}
                component={(customProps: any) => (
                  <Select
                    size="large"
                    optionList={listSenderBank}
                    {...customProps}
                  />
                )}
              />
            </ProtectedWrapper>
            <div className="grid grid-cols-2 items-center gap-4 mt-7">
              <Button
                icon={<IconFilter />}
                theme="solid"
                type="secondary"
                htmlType="submit"
              >
                Tìm kiếm
              </Button>
              <ProtectedWrapper
                allowedRoles={[
                  UserRole.ACCOUNTANT,
                  UserRole.BEAM_ADMIN,
                  UserRole.HR_ADMIN,
                  UserRole.RECONCILER,
                  UserRole.SUPER_ADMIN,
                  UserRole.CONTROLLER,
                ]}
              >
                <ExportReportTransactionListButton filter={exportDate} />
              </ProtectedWrapper>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
