import { ContentWrapper } from '@components/widgets';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { PrimaryLayout } from '@components/widgets/Layouts';
import NotFound from '@components/widgets/Layouts/NotFound/NotFound';
import { UserRole } from '@constants/auth.constants';
import { GeneralSubPath } from '@constants/page-action.constants';
import { TabPane, Tabs } from '@douyinfe/semi-ui';
import {
  FeeAssignedCompanyList,
  FeeCompanyForm,
  FeePolicyDetail,
} from '@modules/fee-policies';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

export async function getServerSideProps(props: any) {
  const { locale } = props;
  const { feePolicyId } = props.params;

  return {
    props: {
      feePolicyId: feePolicyId,
    },
  };
}

enum PageActionEnum {
  Null,
  FeePolicyDetail,
  FeePolicyEdit,
  FeePolicyCreate,
  FeePolicyCompanyList,
  FeePolicyAssign,
}

const EditFeePolicyPage: NextPage = (props: any) => {
  const router = useRouter();
  const [checkData, setCheckData] = useState(true);
  const { feePolicyId } = props;

  const slug = (router.query.slug as string[]) || ['home'];

  const baseRoute = `/fee-policies/assign`;
  const originalRoute = `/fee-policies/assign/${feePolicyId}`;

  const getCurrentSlug = (): PageActionEnum => {
    switch (slug[0]) {
      case 'home':
        return PageActionEnum.FeePolicyDetail;
      case GeneralSubPath.EDIT:
        return PageActionEnum.FeePolicyEdit;
      case GeneralSubPath.ASSIGN:
        return PageActionEnum.FeePolicyAssign;
      case 'companies':
        return PageActionEnum.FeePolicyCompanyList;
      default:
        return PageActionEnum.Null;
    }
  };

  const currentPageAction = getCurrentSlug();

  const tabActivation = [
    {
      key: 'general',
      includes: [PageActionEnum.FeePolicyDetail],
      defaultUrl: '/',
    },
    {
      key: 'applied-companies',
      includes: [PageActionEnum.FeePolicyCompanyList],
      defaultUrl: '/companies',
    },
    {
      key: 'assign-to-company',
      includes: [PageActionEnum.FeePolicyAssign],
      defaultUrl: '/assign',
    },
  ];

  const getActiveTab = () => {
    const activeTab =
      tabActivation.find((x: any) =>
        x.includes.some((e: any) => e == currentPageAction)
      ) ?? tabActivation[0];
    return activeTab;
  };

  const getTabItem = (key: any) => {
    const tab =
      tabActivation.find((x: any) => x.key == key) ?? tabActivation[0];
    return tab;
  };

  const currentActiveTab = getActiveTab();

  // const ExtraButton = () => {
  //   switch (currentPageAction) {
  //     case PageActionEnum.FeePolicyCompanyList:
  //       return (
  //         <>
  //           <ProtectedWrapper allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}>
  //             <Button
  //               theme='solid'
  //               onClick={() => router.push(`${originalRoute}/${GeneralSubPath.ASSIGN}`)}
  //               icon={<IconPlus />}
  //             >
  //               Lựa chọn doanh nghiệp gán chính sách phí
  //             </Button>
  //           </ProtectedWrapper>
  //         </>
  //       );
  //     default:
  //       return <></>;
  //   }
  // };
  // if (!checkData) return <NotFound />;
  return (
    <PrimaryLayout breadcrumbs={['Chi tiết chính sách phí']}>
      <ContentWrapper pageTitle="Thông tin chính sách phí">
        <ProtectedWrapper
          allowedRoles={[
            UserRole.BEAM_ADMIN,
            UserRole.SUPER_ADMIN,
            UserRole.SALE,
            UserRole.RECONCILER,
            UserRole.CUSTOMER_SERVICE,
            UserRole.CONTROLLER,
          ]}
        >
          <Tabs
            type="line"
            keepDOM={false}
            activeKey={currentActiveTab.key}
            onChange={(tabKey: any) => {
              const tabData = getTabItem(tabKey);
              router.push(originalRoute + tabData.defaultUrl);
            }}
          >
            <TabPane tab="Thông tin chung" itemKey="general">
              {currentPageAction == PageActionEnum.FeePolicyDetail && (
                <FeePolicyDetail
                  feePolicyId={feePolicyId}
                  onEdit={() => router.push(`${originalRoute}/edit`)}
                  onCancel={() => router.push(baseRoute)}
                  setCheckData={setCheckData}
                />
              )}

              {currentPageAction == PageActionEnum.FeePolicyEdit && (
                <FeeCompanyForm
                  basePath={baseRoute}
                  //
                  feePolicyId={feePolicyId}
                  isNew={false}
                  onSave={() => router.push(originalRoute)}
                  onCancel={() => router.push(originalRoute)}
                  setCheckData={setCheckData}
                />
              )}
            </TabPane>
            {/* <TabPane tab='Gán chính sách phí' itemKey='assign-to-company'>
              <FeePolicyAssignForm feePolicyId={feePolicyId} onCancel={() => router.push(`${originalCompanyRoute}`)} />
            </TabPane> */}
            <TabPane tab="Doanh nghiệp đã áp dụng" itemKey="applied-companies">
              {currentPageAction == PageActionEnum.FeePolicyCompanyList && (
                <FeeAssignedCompanyList
                  feePolicyId={feePolicyId}
                  setCheckData={setCheckData}
                />
              )}
            </TabPane>
          </Tabs>
        </ProtectedWrapper>
        <ProtectedWrapper allowedRoles={[UserRole.ACCOUNTANT]}>
          <Tabs
            type="line"
            keepDOM={false}
            activeKey={currentActiveTab.key}
            onChange={(tabKey: any) => {
              const tabData = getTabItem(tabKey);
              router.push(originalRoute + tabData.defaultUrl);
            }}
          >
            <TabPane tab="Thông tin chung" itemKey="general">
              {currentPageAction == PageActionEnum.FeePolicyDetail && (
                <FeePolicyDetail
                  feePolicyId={feePolicyId}
                  onEdit={() => router.push(`${originalRoute}/edit`)}
                  onCancel={() => router.push(baseRoute)}
                  setCheckData={setCheckData}
                />
              )}

              {currentPageAction == PageActionEnum.FeePolicyEdit && (
                <FeeCompanyForm
                  basePath={baseRoute}
                  //
                  feePolicyId={feePolicyId}
                  isNew={false}
                  onSave={() => router.push(originalRoute)}
                  onCancel={() => router.push(originalRoute)}
                  setCheckData={setCheckData}
                />
              )}
            </TabPane>
            <TabPane tab="Doanh nghiệp đã áp dụng" itemKey="applied-companies">
              {currentPageAction == PageActionEnum.FeePolicyCompanyList && (
                <FeeAssignedCompanyList
                  feePolicyId={feePolicyId}
                  setCheckData={setCheckData}
                />
              )}
            </TabPane>
          </Tabs>
        </ProtectedWrapper>
        <ProtectedWrapper allowedRoles={[UserRole.HR_ADMIN]}>
          <Tabs
            type="line"
            keepDOM={false}
            activeKey={currentActiveTab.key}
            onChange={(tabKey: any) => {
              const tabData = getTabItem(tabKey);
              router.push(originalRoute + tabData.defaultUrl);
            }}
          >
            <TabPane tab="Thông tin chung" itemKey="general">
              {currentPageAction == PageActionEnum.FeePolicyDetail && (
                <FeePolicyDetail
                  feePolicyId={feePolicyId}
                  onEdit={() => router.push(`${originalRoute}/edit`)}
                  onCancel={() => router.push(baseRoute)}
                  setCheckData={setCheckData}
                />
              )}

              {currentPageAction == PageActionEnum.FeePolicyEdit && (
                <FeeCompanyForm
                  basePath={baseRoute}
                  //
                  feePolicyId={feePolicyId}
                  isNew={false}
                  onSave={() => router.push(originalRoute)}
                  onCancel={() => router.push(originalRoute)}
                  setCheckData={setCheckData}
                />
              )}
            </TabPane>
          </Tabs>
        </ProtectedWrapper>
      </ContentWrapper>
    </PrimaryLayout>
  );
};

export default EditFeePolicyPage;
