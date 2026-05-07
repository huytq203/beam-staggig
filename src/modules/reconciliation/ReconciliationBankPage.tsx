import React from 'react';
import { useRouter } from 'next/router';
import { TabPane, Tabs } from '@douyinfe/semi-ui';
import ReconciliationBankTransaction from './ReconciliationBankTransaction';
import ReconciliationBankUpdate from './ReconciliationBankUpdate';
import ReconciliationBankList from './ReconciliationBankList';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
enum PageActionEnum {
  Null,
  RBList,
  RBTransactionList,
  RBUpdateTransition,
}
export const ReconciliationBank = (props: any) => {
  const { bank } = props;
  const originalRoute = `/reconciliation/${bank}`;
  const { profile, authCheckByRole } = useAuth();

  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CONTROLLER,
    UserRole.RECONCILER,
    UserRole.ACCOUNTANT,
  ]);

  const router = useRouter();
  const slug = (router.query.slug as string[]) || ['home'];
  const getCurrentSlug = (): PageActionEnum => {
    switch (slug[0]) {
      case 'home':
        return PageActionEnum.RBList;
      case 'transaction':
        return PageActionEnum.RBTransactionList;
      case 'update-transition':
        return PageActionEnum.RBUpdateTransition;

      default:
        return PageActionEnum.RBList;
    }
  };
  const currentPageAction = getCurrentSlug();
  const tabActivation = [
    {
      key: 'bank',
      includes: [PageActionEnum.RBList],
      defaultUrl: '/',
    },
    {
      key: 'transaction',
      includes: [PageActionEnum.RBTransactionList],
      defaultUrl: '/transaction',
    },
    {
      key: 'update-transition',
      includes: [PageActionEnum.RBUpdateTransition],
      defaultUrl: '/update-transition',
    },
  ];

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

  return (
    <>
      <Tabs
        type="button"
        keepDOM={false}
        activeKey={currentActiveTab.key}
        onChange={(tabKey: any) => {
          const tabData = getTabItem(tabKey);
          router.push(originalRoute + tabData.defaultUrl);
        }}
      >
        <TabPane tab="Đối soát" itemKey="bank">
          {currentPageAction == PageActionEnum.RBList && (
            <ReconciliationBankList bank={bank} />
          )}
        </TabPane>
        {(profile?.roles[0] === UserRole.BEAM_ADMIN ||
          profile?.roles[0] === UserRole.SUPER_ADMIN ||
          profile?.roles[0] === UserRole.CONTROLLER ||
          profile?.roles[0] === UserRole.RECONCILER) && (
          <TabPane tab="Xử lý giao dịch lệch" itemKey="transaction">
            <div className="overflow-auto">
              {currentPageAction == PageActionEnum.RBTransactionList && (
                <ReconciliationBankTransaction bank={bank} />
              )}
            </div>
          </TabPane>
        )}
        {(profile?.roles[0] === UserRole.BEAM_ADMIN ||
          profile?.roles[0] === UserRole.SUPER_ADMIN ||
          profile?.roles[0] === UserRole.CONTROLLER) && (
          <TabPane
            tab="Cập nhật thông tin giao dịch"
            itemKey="update-transition"
          >
            <div className="overflow-auto">
              {currentPageAction == PageActionEnum.RBUpdateTransition && (
                <ReconciliationBankUpdate bank={bank} />
              )}
            </div>
          </TabPane>
        )}
      </Tabs>
    </>
  );
};
