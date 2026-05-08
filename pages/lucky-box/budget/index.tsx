import { PrimaryLayout } from '@components/widgets';
import { BonusTab } from '@modules/lucky-box/bonus/BonusTab';
import { VoucherShoppingList } from '@modules/lucky-box/bonus/voucher-shopping/VoucherShoppingList';
import { BugetList } from '@modules/lucky-box/buget/BugetList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function BonusVoucherShoppingPage() {
  return (
    <PrimaryLayout>
      <BugetList />
    </PrimaryLayout>
  );
}
