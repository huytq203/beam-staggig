import {
  ContentWrapper,
  FormActionButton,
  MainContentWrapper,
} from '@components/widgets';
import { Button, Card, Divider } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { GroupsServices } from '@services/companies/groups/groups.service';
import { useQuery } from 'react-query';
import { ListAccountFromGroup } from './ListAccountFromGroup';
import { IconEdit, IconHistory } from '@douyinfe/semi-icons';
import { useEffect } from 'react';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { useRouter } from 'next/router';
export const GroupDetail = (props: any) => {
  const { groupId, onCancel, companyId, basePath, originalGroupRoute } = props;
  const router = useRouter();
  const { data, isFetching, isLoading, error, isError } = useQuery(
    'group_detail',
    () => GroupsServices.getGroup(groupId),
    {
      // enabled: !companyId,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const fieldData = [
    {
      label: 'Tên nhóm',
      field: 'name',
    },
    {
      label: 'Mã nhóm',
      field: 'code',
    },
    {
      label: 'Mô tả',
      field: 'description',
    },
    {
      label: 'Ghi chú',
      field: 'note',
    },
  ];
  if (isLoading) return <></>;
  // if (!data && !isLoading) return <NotFound />;

  return (
    <MainContentWrapper data={data} isLoading={isLoading}>
      <ContentWrapper
        pageTitle="Chi tiết nhóm"
        extra={
          <>
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.SUPER_ADMIN,
                UserRole.HR_ADMIN,
                UserRole.CUSTOMER_SERVICE,
              ]}
            >
              <Button
                onClick={() =>
                  router.push(`${originalGroupRoute}/${groupId}/edit`)
                }
                icon={<IconEdit />}
                theme="solid"
              >
                Chỉnh sửa nhóm
              </Button>
            </ProtectedWrapper>
            <Button onClick={() => router.push(originalGroupRoute)}>
              Quay lại
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4 mt-4">
          {fieldData.map((x: any) => (
            <div className="grid grid-cols-2">
              <div>{x.label}</div>
              <div className="font-bold">{data?.[x?.field] ?? ''}</div>
            </div>
          ))}

          <div className="grid grid-cols-2">
            <div>Quy tắc ứng</div>
            <div className="font-bold">
              {data?.payLimitType == 0 ? 'Cố định' : 'Theo phần trăm'}
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div>Giá trị</div>
            <div className="font-bold">
              {StringHelper.formatValueByPayType(
                data?.payLimitSalary,
                data?.payLimitType
              )}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>Phê duyệt ứng lương từng lần</div>
            <div className="font-bold">
              {data?.manageSalaryAdvanceRequest == true ? 'Có' : 'Không'}
            </div>
          </div>
          <Divider dashed />
          <div className="flex flex-col gap-4">
            <div className="font-bold">Người lao động thuộc nhóm</div>
            <Card className="border-none">
              <ListAccountFromGroup
                basePath={basePath}
                companyId={companyId}
                groupId={groupId}
              />
            </Card>
          </div>

          <FormActionButton
            showSubmitButton={false}
            position="start"
            onCancel={onCancel}
          />
        </div>
      </ContentWrapper>
    </MainContentWrapper>
  );
};
