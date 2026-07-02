import { Select } from '@douyinfe/semi-ui';
import { CampaignService } from '@services/campaigns';
import { forwardRef } from 'react';
import { useQuery } from 'react-query';

export const SelectCampaignType = forwardRef((props: any, ref: any) => {
  const { isAll = false, size } = props;
  const { data, isLoading, refetch } = useQuery(
    ['campaign-type-enabled-list'],
    () => CampaignService.getCampaignTypesEnabled({}),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const getSelectOptions = () => {
    if (isLoading || !data) return [];
    let dataConvert = data?.map((x: any) => {
      return {
        value: x.id,
        label: x.name,
      };
    });
    if (isAll) {
      return [
        {
          value: '',
          label: 'Tất cả',
        },
        ...dataConvert,
      ];
    }
    return dataConvert;
  };
  return (
    <Select ref={ref} optionList={getSelectOptions()} size={size} {...props} />
  );
});

SelectCampaignType.displayName = 'SelectCampaignType';
