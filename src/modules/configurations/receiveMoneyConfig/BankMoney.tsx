import { GeneralSubPath } from '@constants/page-action.constants';
import { Button, TabPane, Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import { IconPlus } from '@douyinfe/semi-icons';
import { ReceiveMoneyByCitad } from './bank/ReceiveMoneyByCitad';
import ReceiveMoneyByNapas from './bank/ReceiveMoneyByNapas';
import ReciveMoneyTransferFee from './bank/ReciveMoneyTransferFee';
import { CreateTranferFeeForm } from '../form/CreateTranferFeeForm';

enum PageActionEnum {
  Null,
  ReceiveMoneyNapasList,
  ReceiveMoneyCitadList,
  ReceiveMoneyTransferFeeCreate,
  ReceiveMoneyTransferFeeEdit,
  ReceiveMoneyTransferFeeList,
}

export const BankMoney = (props: any) => {
  const { setCheckData } = props;
  const router = useRouter();
  const slug = (router.query.slug as string[]) || ['home'];

  const originalRoute = `/configurations/receive-money`;
  const originalTransferFeeRoute = `/configurations/receive-money/transfer-fee`;
  const getCurrentSlug = (): PageActionEnum => {
    switch (slug[1]) {
      case 'napas':
        return PageActionEnum.ReceiveMoneyNapasList;
      case 'citad':
        return PageActionEnum.ReceiveMoneyCitadList;
      case 'transfer-fee':
        if (slug[2] == GeneralSubPath.CREATE) {
          return PageActionEnum.ReceiveMoneyTransferFeeCreate;
        } else if (slug[1]) {
          if (slug[3] == GeneralSubPath.EDIT) {
            return PageActionEnum.ReceiveMoneyTransferFeeEdit;
          }
        }
        return PageActionEnum.ReceiveMoneyTransferFeeList;
      default:
        return PageActionEnum.Null;
    }
  };
  const currentPageAction = getCurrentSlug();
  const tabActivation = [
    {
      key: 'napas',
      includes: [PageActionEnum.ReceiveMoneyNapasList],
      defaultUrl: '/napas',
    },
    {
      key: 'citad',
      includes: [PageActionEnum.ReceiveMoneyCitadList],
      defaultUrl: '/citad',
    },
    {
      key: 'transfer-fee',
      includes: [
        PageActionEnum.ReceiveMoneyTransferFeeList,
        PageActionEnum.ReceiveMoneyTransferFeeCreate,
        PageActionEnum.ReceiveMoneyTransferFeeEdit,
      ],
      defaultUrl: '/transfer-fee',
    },
  ];
  const ExtraButton = () => {
    switch (currentPageAction) {
      case PageActionEnum.ReceiveMoneyTransferFeeList:
        return (
          <>
            <Button
              size="small"
              theme="solid"
              onClick={() =>
                router.push(
                  `${originalTransferFeeRoute}/${GeneralSubPath.CREATE}`
                )
              }
              icon={<IconPlus />}
            >
              Thêm mới phí chuyển tiền
            </Button>
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
  return (
    <div className="mt-3">
      <Tabs
        type="line"
        keepDOM={false}
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
        <TabPane tab="Napas" itemKey="napas">
          <div className="mt-4">
            {currentPageAction == PageActionEnum.ReceiveMoneyNapasList && (
              <ReceiveMoneyByNapas />
            )}
          </div>
        </TabPane>
        <TabPane tab="Citad" itemKey="citad">
          <div className="mt-4">
            {currentPageAction == PageActionEnum.ReceiveMoneyCitadList && (
              <ReceiveMoneyByCitad />
            )}
          </div>
        </TabPane>
        <TabPane tab="Phí chuyển tiền" itemKey="transfer-fee">
          <div className="mt-4">
            {(currentPageAction ==
              PageActionEnum.ReceiveMoneyTransferFeeCreate ||
              currentPageAction ==
                PageActionEnum.ReceiveMoneyTransferFeeEdit) && (
              <CreateTranferFeeForm
                transferFeeId={slug[2]}
                onCancel={() => router.push(originalTransferFeeRoute)}
                isNew={
                  currentPageAction ==
                  PageActionEnum.ReceiveMoneyTransferFeeCreate
                }
                setCheckData={setCheckData}
              />
            )}
            {currentPageAction ==
              PageActionEnum.ReceiveMoneyTransferFeeList && (
              <ReciveMoneyTransferFee />
            )}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
