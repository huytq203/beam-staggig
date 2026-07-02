import { BoxWrapper } from '@components/widgets';
import { Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const BonusTab = (props: any) => {
  const { activeItem } = props;
  const router = useRouter();
  const baseRoute = '/lucky-box/bonus';
  const tabList = [
    { tab: 'Tổng hợp', itemKey: 'overview' },
    { tab: 'Thẻ điện thoại', itemKey: 'phone-card' },
    { tab: 'Voucher mua sắm', itemKey: 'voucher-shopping' },
    { tab: 'Voucher giảm giá', itemKey: 'voucher-discount' },
    { tab: 'Tiền mặt', itemKey: 'cash' },
  ];

  const onChangeRoute = (e: any) => {
    switch (e) {
      case 'overview':
        router.push(`${baseRoute}/overview`);
        break;
      case 'phone-card':
        router.push(`${baseRoute}/phone-card`);
        break;
      case 'voucher-shopping':
        router.push(`${baseRoute}/voucher-shopping`);
        break;
      case 'voucher-discount':
        router.push(`${baseRoute}/voucher-discount`);
        break;
      case 'cash':
        router.push(`${baseRoute}/cash`);
        break;
    }
  };

  return (
    <>
      <BoxWrapper padding={6}>
        <Tabs
          type="button"
          contentStyle={{
            display: 'none',
          }}
          tabList={tabList}
          activeKey={activeItem}
          onChange={onChangeRoute}
        />
      </BoxWrapper>
    </>
  );
};
