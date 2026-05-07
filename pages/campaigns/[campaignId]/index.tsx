import { ContentWrapper } from '@components/widgets'
import { ProtectedWrapper } from '@components/widgets/Auth'
import { PrimaryLayout } from '@components/widgets/Layouts'
import { UserRole } from '@constants/auth.constants'
import { GeneralSubPath } from '@constants/page-action.constants'
import { TabPane, Tabs } from '@douyinfe/semi-ui'
import { CreateCampaignForm } from '@modules/campaigns'
import { CampaignDetail } from '@modules/campaigns/CampaignDetail'
import { FormActionButton } from "@components/widgets";

import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

export async function getServerSideProps(props: any) {
  const { campaignId } = props.params;

  
  return {
    props: {
      campaignId,
    },
  }
}

enum PageActionEnum {
  Null,
  CampaignDetail,
  CreateCampaignForm,

}

const EditCompanyPage: NextPage = (props: any) => {
  const router = useRouter();
  const [checkData, setCheckData] = useState(true);
  const { campaignId } = props

  const slug = (router.query.slug as string[]) || ['home'];
  const baseRoute = `/campaigns`;
  const originalRoute = `/campaigns/${campaignId}`;


  const getCurrentSlug = (): PageActionEnum => {
    switch (slug[0]) {
      case 'home':
        return PageActionEnum.CampaignDetail;
      case GeneralSubPath.EDIT:
        return PageActionEnum.CreateCampaignForm;
      default:
        return PageActionEnum.Null;
    }
  };

  const currentPageAction = getCurrentSlug();
  

  const tabActivation = [
    {
      key: 'general',
      includes: [PageActionEnum.CampaignDetail],
      defaultUrl: '/',
    },
    {
      key: 'applied-companies',
      includes: [PageActionEnum.CreateCampaignForm],
      defaultUrl: '/edit',
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

  return (
    <PrimaryLayout breadcrumbs={['Chi tiết chiến dịch']}>
      
      <ContentWrapper pageTitle="Thông tin chiến dịch" 
      extra={<FormActionButton
          onSubmit={() => router.push(`${originalRoute}/edit`)}
          submitButtonText="Chỉnh sửa"
          onCancel={() => router.push(baseRoute)}
          cancelText="Quay lại"
        />}> 
       
      <ProtectedWrapper
          allowedRoles={[
            UserRole.BEAM_ADMIN,
            UserRole.SUPER_ADMIN,
            UserRole.SALE,
            UserRole.RECONCILER,
            UserRole.CUSTOMER_SERVICE,
            UserRole.CONTROLLER,
          ]} >
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
              {currentPageAction == PageActionEnum.CampaignDetail && (
                <CampaignDetail
                  campaignId={campaignId}
                  onEdit={() => router.push(`${originalRoute}/edit`)}
                  onCancel={() => router.push(baseRoute)}
                  setCheckData={setCheckData}
                />
              )}
            </TabPane>
          </Tabs>
        </ProtectedWrapper>
      </ContentWrapper>
    </PrimaryLayout>
  )
}

export default EditCompanyPage
