import { PrimaryLayout } from '@components/widgets';
import { BonusTab } from '@modules/lucky-box/bonus/BonusTab';
import { VoucherShoppingList } from '@modules/lucky-box/bonus/voucher-shopping/VoucherShoppingList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function BonusVoucherShoppingPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTab activeItem="voucher-shopping" />
      </div>
      <VoucherShoppingList />
    </PrimaryLayout>
  );
}
