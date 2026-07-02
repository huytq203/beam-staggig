import { InputWrapper } from '@components/shared';
import { CustomMonthRangePicker } from '@components/shared/CustomMonthRangePicker';
import { COMMON_FORMAT } from '@constants/common-format';
import { listChallengeTypeName } from '@constants/listNameLuckyBox.constants';
import {
  listChallengeType,
  listRewardType,
} from '@constants/select-options.constants';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ExportOverViewButton } from './ExportOverview';
export const OverviewFilter = (props: any) => {
  const { onFilter, refetch, filter } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchKeyword: '',
      rewardType: '',
      challengeType: '',
      page: 1,
      size: 10,
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      searchKeyword: '',
      rewardType: '',
      challengeType: '',
    });
  }, []);

  const convertNameChallengeType = () => {
    const keyOfName = Object.keys(listChallengeTypeName);
    const valueOfName = Object.values(listChallengeTypeName);
    let nameChallengeType = [];
    nameChallengeType.push({ value: '', label: 'Tất cả' });
    const nameChallengeTypeList = keyOfName.map((key: any, index: number) => ({
      value: key,
      label: valueOfName[index],
    }));
    return nameChallengeType.concat(nameChallengeTypeList);
  };
  const onSubmitValues = (values: any) => {
    refetch();
    return onFilter({
      searchKeyword: values.searchKeyword.trim(),
      rewardType: values.rewardType,
      challengeType: values.challengeType,
      startTime: values.dateRanges
        ? DateTimeHelper.convertTimeZone(
            values.dateRanges[0],
            COMMON_FORMAT.LOCAL_DATE
          )
        : '',
      endTime: values.dateRanges
        ? DateTimeHelper.convertTimeZone(
            values.dateRanges[1],
            COMMON_FORMAT.LOCAL_DATE
          )
        : '',
      page: 1,
      size: 10,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            field="searchKeyword"
            label="Người tham gia"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Input
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="Số điện thoại"
                size="large"
                {...e}
              />
            )}
          />
          <InputWrapper
            required
            field="challengeType"
            label="Nhiệm vụ"
            component={(props: any) => (
              <Select
                optionList={convertNameChallengeType()}
                size="large"
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />
          <InputWrapper
            field="dateRanges"
            label="Thời gian hoàn thành"
            control={control}
            errors={errors}
            component={(e: any) => (
              <DatePicker
                className="w-full"
                placeholder="Nhập thời gian"
                size="large"
                type="dateRange"
                format="dd/MM/yyyy"
                {...e}
              />
            )}
          />
          <InputWrapper
            required
            field="rewardType"
            label="Phần quà"
            component={(props: any) => (
              <Select optionList={listRewardType} size="large" {...props} />
            )}
            errors={errors}
            control={control}
          />
          <Button
            icon={<IconFilter />}
            theme="solid"
            type="secondary"
            htmlType="submit"
            className="mt-7"
          >
            Tìm kiếm
          </Button>
          <ExportOverViewButton filterExport={filter} />
        </div>
      </form>
    </>
  );
};
