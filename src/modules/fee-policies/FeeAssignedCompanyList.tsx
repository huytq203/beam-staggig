import { IconMinus, IconPlus } from '@douyinfe/semi-icons';
import { Button, Collapse, Notification } from '@douyinfe/semi-ui';
import { CompanyFeePolicyService } from '@services/company-fee';
import { FeePolicyService } from '@services/fee-policy';
import { useQuery } from 'react-query';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { useEffect } from 'react';
import { ProtectedWrapper } from '@components/widgets/Auth';
export const FeeAssignedCompanyList = (props: any) => {
  const { feePolicyId, onRemoveCompany, setCheckData } = props;
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.ACCOUNTANT,
    UserRole.SALE,
    UserRole.RECONCILER,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
  ]);
  const { data, isLoading, refetch } = useQuery(
    ['users', feePolicyId],
    () => FeePolicyService.getListAssignedCompany(feePolicyId),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const { data: detailDataFP } = useQuery(
    `fee_policy_detail_${feePolicyId}`,
    () => FeePolicyService.getFeePolicy(feePolicyId),
    {
      // enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const onRemoveCompanyFromFeePolicy = (companyId: any, feePolicyId: any) => {
    CompanyFeePolicyService.removeCompanyFromFeePolicy({
      feePolicyId: feePolicyId,
      companyIds: [companyId],
    }).then((x: any) => {
      if (x) {
        Notification.success({
          content: `Xóa thành công doanh nghiệp khỏi chính sách phí!`,
          theme: 'light',
        });
        refetch();
      }
    });
  };

  useEffect(() => {
    if (!data && !isLoading) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (isLoading) return <></>;

  return (
    <>
      <div>
        <Collapse expandIcon={<IconPlus />} collapseIcon={<IconMinus />}>
          {data?.map((company: any, index: number) => (
            <Collapse.Panel
              header={
                <div className="flex gap-4">
                  <div className="w-8">#{index + 1}</div>
                  <div className="col-span-2">{company?.name}</div>
                </div>
              }
              key={company.id}
              itemKey={company.id}
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2">
                  <span>Tên doanh nghiệp:</span>
                  <span className="font-bold">{company.name}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span>Email:</span>
                  <span className="font-bold">{company.email}</span>
                </div>
              </div>
              {detailDataFP?.status != 3 && (
                <div className="flex justify-end py-2">
                  <ProtectedWrapper
                    allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
                  >
                    <Button
                      onClick={() =>
                        onRemoveCompanyFromFeePolicy(company.id, feePolicyId)
                      }
                    >
                      Xoá
                    </Button>
                  </ProtectedWrapper>
                </div>
              )}
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </>
  );
};
