import { Select } from '@douyinfe/semi-ui';
import { ArrayHelper } from '@helpers/array.helper';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { CampaignService } from '@services/campaigns';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

export const CampaignCodeSelect = (props: any) => {
  const {
    onChange,
    value,
    multiple = false,
    filter,
    disabled = false,
    campaignCode,
    idTypeNotification,
    setExpiredCampaign,
  } = props;
  const [option, setOption] = useState([]);
  const { data, isLoading } = useQuery(
    ['campaign-code-select'],
    () =>
      CampaignService.getAll({
        name: '',
        page: '',
        size: '',
        status: 'ACTIVE',
        sort: ['createdAt,desc'],
      }),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  useEffect(() => {
    const expiredCampaign = {
      label: campaignCode,
      value: idTypeNotification,
    };

    const getOptions = () => {
      if (!data?.content) return [];

      return data?.content?.map((x: any, idx: any) => {
        return {
          label: `${x.code}`,
          value: x.id,
        };
      });
    };
    setOption(getOptions());
    setExpiredCampaign(
      getOptions().some((item: any) =>
        ArrayHelper.shallowEqualityCheck(item, expiredCampaign)
      )
    );
  }, [data?.content]);
  return (
    <>
      <Select
        filter={FunctionBase.customSelectFilterOption}
        loading={isLoading}
        disabled={disabled}
        optionList={option}
        value={value}
        placeholder="Chọn mã chiến dịch"
        onChange={(e: any) => onChange(e)}
        multiple={multiple}
        max={100}
        // size="large"
      />
    </>
  );
};
