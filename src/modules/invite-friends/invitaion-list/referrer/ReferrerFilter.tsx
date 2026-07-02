import { InputWrapper } from '@components/shared';
import { CompanySelect } from '@components/widgets';
import { TIMEZONE_FORMAT } from '@constants/common-format';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
type InputForm = {
  searchWord: any;
  page: number;
  size: number;
};
export const ReferrerFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const router = useRouter();
  const { phoneNumber: phoneNumberRouter } = router.query;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<InputForm>({
    defaultValues: {
      searchWord: phoneNumberRouter ? phoneNumberRouter : '',
      page: 1,
      size: 10,
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      searchWord: phoneNumberRouter ? phoneNumberRouter : '',
    });
    if (phoneNumberRouter) {
      onFilter &&
        onFilter({
          searchWord: phoneNumberRouter,
          page: 1,
          size: 10,
        });
      refetch();
    }
  }, [phoneNumberRouter]);
  const onSubmitValues = (values: any) => {
    refetch();
    return onFilter({
      searchWord: values.searchWord.trim(),
      page: 1,
      size: 10,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            field="searchWord"
            label="Người giới thiệu"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Input
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="SĐT người giới thiệu"
                size="large"
                {...e}
              />
            )}
          />
          {/* <InputWrapper
            field="companyIds"
            label="Doanh nghiệp người giới thiệu"
            control={control}
            errors={errors}
            component={(e: any) => (
              <CompanySelect {...e} multiple={true} filter={true} />
            )}
          /> */}
          {/* <InputWrapper
            field="dateType"
            label="Xem theo ngày"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select
                placeholder="Xem theo ngày"
                optionList={[
                  {
                    value: 'ALL',
                    label: 'Tất cả',
                  },
                  {
                    value: 'INSTALLED',
                    label: 'Ngày đăng ký Flexpay',
                  },
                  {
                    value: 'REGISTER_SALARY_ADVANCE',
                    label: 'Ngày đăng ký dịch vụ ứng lương',
                  },
                  {
                    value: 'CREATED_AT',
                    label: 'Ngày khảo sát',
                  },
                  {
                    value: 'FIRST_SALARY_ADVANCE',
                    label: 'Ngày ứng lương lần đầu',
                  },
                ]}
                size="large"
                showClear={false}
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
          /> */}
          <Button
            icon={<IconFilter />}
            theme="solid"
            type="secondary"
            htmlType="submit"
            className="mt-7"
          >
            Tìm kiếm
          </Button>
        </div>
      </form>
    </>
  );
};
