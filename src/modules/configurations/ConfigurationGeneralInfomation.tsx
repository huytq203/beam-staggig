import React from 'react';
import { GeneralSubPath, NEXT_PUBLIC_API_CORE } from '@constants/index';
import { IconEdit, IconPlus } from '@douyinfe/semi-icons';
import { Button, Notification, TabPane, Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import BasicConfiguration from './BasicConfiguration';
import CampaignConfigurationList from './CampaignConfigurationList';
import { CreateCampaignTypeForm } from './form/CreateCampaignType';
import CompanyConfigurationList from './CompanyConfigurationList';
import CreateCompanyType from './form/CreateCompanyType';
import AdvanceConfiguration from './AdvanceConfiguration';
import ReceiveMoneyConfiguration from './ReceiveMoneyConfiguration';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
import ConfigurationTermForm from './termForm/ConfigurationTermForm';
import CreateTermForm from './termForm/CreateTermForm';
import { PayMoneyConfiguration } from './payMoneyConfig/PayMoneyConfiguration';
import { PayMoneySetUp } from './payMoneyConfig/PayMoneySetUp';

enum PageActionEnum {
  Null,
  BasicConfiguration,
  ConfigurationCampaignList,
  ConfigurationCampaignCreate,
  ConfigurationCampaignEdit,
  ConfigurationCompanyList,
  ConfigurationCompanyCreate,
  ConfigurationCompanyEdit,
  AdvanceConfiguration,
  ReceiveMoneyConfiguration,
  PayMoneyConfiguration,
  ConfigurationTermForm,
  CreateTermForm,
  EditTermForm,
  PayMoneySetUp,
  EditPayMoney,
}

export const ConfigurationGeneralInfomation = (props: any) => {
  const { setCheckData } = props;
  const { profile, authCheckByRole }: any = useAuth();
  const router = useRouter();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CONTROLLER,
    UserRole.CUSTOMER_SERVICE,
    UserRole.RECONCILER,
    UserRole.SALE,
    UserRole.ACCOUNTANT,
  ]);
  const slug = (router.query.slug as string[]) || ['home'];

  const originalRoute = `/configurations`;
  const originalCampaignRoute = `/configurations/campaign-type`;
  const originalCompanyRoute = `/configurations/company-type`;
  const originalTermFormRoute = `/configurations/term-form`;
  const originalPayMoneyRoute = `/configurations/pay-money`;

  const getCurrentSlug = (): PageActionEnum => {
    switch (slug[0]) {
      case 'basic':
        return PageActionEnum.BasicConfiguration;
      case 'advance':
        return PageActionEnum.AdvanceConfiguration;
      case 'company-type':
        if (slug[1] == GeneralSubPath.CREATE) {
          return PageActionEnum.ConfigurationCompanyCreate;
        } else if (slug[1]) {
          if (slug[2] == GeneralSubPath.EDIT) {
            return PageActionEnum.ConfigurationCompanyEdit;
          }
        }
        return PageActionEnum.ConfigurationCompanyList;
      case 'campaign-type':
        if (slug[1] == GeneralSubPath.CREATE) {
          return PageActionEnum.ConfigurationCampaignCreate;
        } else if (slug[1]) {
          if (slug[2] == GeneralSubPath.EDIT) {
            return PageActionEnum.ConfigurationCampaignEdit;
          }
        }
        return PageActionEnum.ConfigurationCampaignList;
      case 'receive-money':
        return PageActionEnum.ReceiveMoneyConfiguration;
      case 'pay-money':
        if (slug[1] === GeneralSubPath.CREATE) {
          return PageActionEnum.PayMoneySetUp;
        } else if (slug[1]) {
          if (slug[2] == GeneralSubPath.EDIT) {
            return PageActionEnum.EditPayMoney;
          }
        }
        return PageActionEnum.PayMoneyConfiguration;
      case 'term-form':
        if (slug[1] == GeneralSubPath.CREATE) {
          return PageActionEnum.CreateTermForm;
        } else if (slug[1]) {
          if (slug[2] == GeneralSubPath.EDIT) {
            return PageActionEnum.EditTermForm;
          }
        }
        return PageActionEnum.ConfigurationTermForm;
      default:
        return PageActionEnum.Null;
    }
  };

  const currentPageAction = getCurrentSlug();

  const tabActivation = [
    {
      key: 'basic',
      includes: [PageActionEnum.BasicConfiguration],
      defaultUrl: '/basic',
    },
    {
      key: 'advance',
      includes: [PageActionEnum.AdvanceConfiguration],
      defaultUrl: '/advance',
    },
    {
      key: 'campaign-type',
      includes: [
        PageActionEnum.ConfigurationCampaignList,
        PageActionEnum.ConfigurationCampaignCreate,
        PageActionEnum.ConfigurationCampaignEdit,
      ],
      defaultUrl: '/campaign-type',
    },
    {
      key: 'company-type',
      includes: [
        PageActionEnum.ConfigurationCompanyList,
        PageActionEnum.ConfigurationCompanyCreate,
        PageActionEnum.ConfigurationCompanyEdit,
      ],
      defaultUrl: '/company-type',
    },
    {
      key: 'receive-money',
      includes: [PageActionEnum.ReceiveMoneyConfiguration],
      defaultUrl: '/receive-money/napas',
    },
    {
      key: 'pay-money',
      includes: [
        PageActionEnum.PayMoneyConfiguration,
        PageActionEnum.PayMoneySetUp,
        PageActionEnum.EditPayMoney,
      ],
      defaultUrl: '/pay-money',
    },
    {
      key: 'term-form',
      includes: [
        PageActionEnum.ConfigurationTermForm,
        PageActionEnum.CreateTermForm,
        PageActionEnum.EditTermForm,
      ],

      defaultUrl: '/term-form',
    },
  ];
  const tabActivationSale = [
    {
      key: 'campaign-type',
      includes: [PageActionEnum.ConfigurationCampaignList],
      defaultUrl: '/campaign-type',
    },
    {
      key: 'company-type',
      includes: [PageActionEnum.ConfigurationCompanyList],
      defaultUrl: '/company-type',
    },
    {
      key: 'pay-money',
      includes: [PageActionEnum.ConfigurationCompanyList],
      defaultUrl: '/pay-money',
    },
  ];

  const ExtraButton = () => {
    switch (currentPageAction) {
      case PageActionEnum.ConfigurationCampaignList:
        return (
          <>
            <ProtectedWrapper
              allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
            >
              <Button
                size="small"
                theme="solid"
                onClick={() =>
                  router.push(
                    `${originalCampaignRoute}/${GeneralSubPath.CREATE}`
                  )
                }
                icon={<IconPlus />}
              >
                Thêm mới loại chiến dịch
              </Button>
            </ProtectedWrapper>
          </>
        );
      case PageActionEnum.ConfigurationCompanyList:
        return (
          <>
            <ProtectedWrapper
              allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
            >
              <Button
                theme="solid"
                size="small"
                onClick={() =>
                  router.push(
                    `${originalCompanyRoute}/${GeneralSubPath.CREATE}`
                  )
                }
                icon={<IconPlus />}
              >
                Thêm mới cấu hình doanh nghiệp
              </Button>
            </ProtectedWrapper>
          </>
        );
      case PageActionEnum.ConfigurationTermForm:
        return (
          <>
            <ProtectedWrapper
              allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
            >
              <Button
                theme="solid"
                size="small"
                onClick={() =>
                  router.push(
                    `${originalTermFormRoute}/${GeneralSubPath.CREATE}`
                  )
                }
                icon={<IconPlus />}
              >
                Thêm mới biểu mẫu điều khoản
              </Button>
            </ProtectedWrapper>
          </>
        );

      default:
        return <></>;
    }
  };

  const getActiveTab = () => {
    const activeTab =
      tabActivation.find((x: any) =>
        x.includes.some((e: any) => e == currentPageAction)
      ) ?? tabActivation[0];
    return activeTab;
  };

  const currentActiveTab = getActiveTab();

  const getTabItem = (key: any) => {
    const tab =
      tabActivation.find((x: any) => x.key == key) ?? tabActivation[0];
    return tab;
  };

  const tabListFull = [
    { tab: 'Cài đặt cơ bản', itemKey: 'basic' },
    { tab: 'Cài đặt nâng cao', itemKey: 'advance' },
    { tab: 'Cấu hình doanh nghiệp', itemKey: 'company-type' },
    { tab: 'Loại chiến dịch', itemKey: 'campaign-type' },
    { tab: 'Phương thức nhận tiền', itemKey: 'receive-money' },
    { tab: 'Phương thức đi tiền', itemKey: 'pay-money' },
    { tab: 'Biểu mẫu điều khoản sử dụng', itemKey: 'term-form' },
  ];

  const tabListLite = [
    { tab: 'Cấu hình doanh nghiệp', itemKey: 'company-type' },
    { tab: 'Loại chiến dịch', itemKey: 'campaign-type' },
    { tab: 'Phương thức đi tiền', itemKey: 'pay-money' },
  ];

  const getTabList = () => {
    if ([UserRole.ACCOUNTANT].includes(profile?.roles[0])) {
      return tabListLite.filter(
        (x: any) => x.itemKey === 'campaign-type' || x.itemKey === 'pay-money'
      );
    } else if ([UserRole.RECONCILER].includes(profile?.roles[0])) {
      return tabListLite.filter((x: any) => x.itemKey == 'company-type'|| x.itemKey === 'pay-money');
    } else if (
      [UserRole.CUSTOMER_SERVICE, UserRole.SALE, UserRole.CONTROLLER].includes(
        profile?.roles[0]
      )
    ) {
      return tabListLite;
    }
    return tabListFull;
  };
  return (
    <div>
      <Tabs
        tabPosition="left"
        type="line"
        keepDOM={false}
        tabList={getTabList()}
        activeKey={currentActiveTab.key}
        onChange={(tabKey: any) => {
          const tabData = getTabItem(tabKey);
          router.push(originalRoute + tabData.defaultUrl);
        }}
        contentStyle={{
          width: '100%',
          overflow: 'auto',
        }}
        tabBarExtraContent={<ExtraButton />}
      >
        <div className="mt-4">
          {currentPageAction == PageActionEnum.BasicConfiguration && (
            <BasicConfiguration />
          )}
          {currentPageAction == PageActionEnum.AdvanceConfiguration && (
            <AdvanceConfiguration />
          )}

          <>
            {(currentPageAction == PageActionEnum.ConfigurationCompanyCreate ||
              currentPageAction == PageActionEnum.ConfigurationCompanyEdit) && (
              <CreateCompanyType
                companyTypeId={slug[1]}
                onCancel={() => router.push(originalCompanyRoute)}
                isNew={
                  currentPageAction == PageActionEnum.ConfigurationCompanyCreate
                }
                setCheckData={setCheckData}
              />
            )}
            {currentPageAction == PageActionEnum.ConfigurationCompanyList && (
              <CompanyConfigurationList />
            )}
          </>
          <>
            {(currentPageAction == PageActionEnum.ConfigurationCampaignCreate ||
              currentPageAction ==
                PageActionEnum.ConfigurationCampaignEdit) && (
              <CreateCampaignTypeForm
                campaignTypeId={slug[1]}
                onCancel={() => router.push(originalCampaignRoute)}
                isNew={
                  currentPageAction ==
                  PageActionEnum.ConfigurationCampaignCreate
                }
                setCheckData={setCheckData}
              />
            )}
            {currentPageAction == PageActionEnum.ConfigurationCampaignList && (
              <CampaignConfigurationList />
            )}
          </>

          {currentPageAction == PageActionEnum.ReceiveMoneyConfiguration && (
            <ReceiveMoneyConfiguration setCheckData={setCheckData} />
          )}
          <>
            {(currentPageAction == PageActionEnum.CreateTermForm ||
              currentPageAction == PageActionEnum.EditTermForm) && (
              <CreateTermForm
                termformId={slug[1]}
                onCancel={() => router.push(originalTermFormRoute)}
                isNew={currentPageAction == PageActionEnum.CreateTermForm}
                setCheckData={setCheckData}
              />
            )}
            {currentPageAction == PageActionEnum.ConfigurationTermForm && (
              <ConfigurationTermForm />
            )}
          </>
          {currentPageAction == PageActionEnum.PayMoneyConfiguration && (
            <PayMoneyConfiguration />
          )}
          {(currentPageAction == PageActionEnum.PayMoneySetUp ||
            currentPageAction == PageActionEnum.EditPayMoney) && (
            <PayMoneySetUp
              payMoneyId={slug[1]}
              onCancel={() => router.push(originalPayMoneyRoute)}
              isNew={currentPageAction == PageActionEnum.PayMoneySetUp}
              setCheckData={setCheckData}
            />
          )}
        </div>
      </Tabs>
    </div>
  );
};
