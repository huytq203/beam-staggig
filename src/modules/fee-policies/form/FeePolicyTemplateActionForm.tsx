import { FeePolicyTemplateService } from '@services/fee-policy-templates';
import { useQuery } from 'react-query';
import { getRangeList } from '../helper';
import { FeePolicyTemplateForm } from './FeePolicyTemplateForm';
import { useEffect } from 'react';

export const FeePolicyTemplateActionForm = (props: any) => {
  const {
    onCancel,
    onSave,
    company = false,
    isNew,
    feePolicyId,
    setCheckData,
  } = props;

  const { data, isFetching, isLoading, error, isError } = useQuery(
    [`fee_policy_detail_${feePolicyId}`, feePolicyId],
    () => FeePolicyTemplateService.getFeePolicy(feePolicyId),
    {
      enabled: !isNew,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  useEffect(() => {
    if (isNew) return;
    if (!data && !isLoading) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (!isNew && isLoading) return <>Loading Form...</>;

  const getInitialData = () => {
    return {
      ...data,
      rangeList: getRangeList(data),
      noLimitUpper: true,
    };
  };

  return (
    <FeePolicyTemplateForm
      onCancel={onCancel}
      onSave={onSave}
      data={getInitialData()}
      isNew={isNew}
    />
  );
};
