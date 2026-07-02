import { InputWrapper } from '@components/shared';
import { Select } from '@douyinfe/semi-ui';
import { GroupsServices } from '@services/companies';
import { useQuery } from 'react-query';

export interface CampaignGroupSelectProps {
  field: any;
  title?: any;
  control: any;
  errors: any;
  companyId: any;
  disabled: any;
}

export const CampaignGroupSelect = (props: CampaignGroupSelectProps) => {
  const { field, control, errors, companyId, disabled } = props;

  const { data, isLoading } = useQuery(
    [`campaign-select`, companyId],
    () =>
      GroupsServices.getListGroupsInComany(
        {
          size: 100,
        },
        companyId
      ),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: companyId != null,
    }
  );

  const getData = () => {
    if (isLoading && data) return [];
    return data?.content.map((x: any) => {
      return {
        label: x.name,
        value: x.id,
      };
    });
  };

  return (
    <>
      <InputWrapper
        field={field}
        component={(props: any) => (
          <Select
            loading={isLoading}
            optionList={getData()}
            multiple
            disabled={disabled}
            {...props}
          />
        )}
        errors={errors}
        control={control}
      />
    </>
  );
};
