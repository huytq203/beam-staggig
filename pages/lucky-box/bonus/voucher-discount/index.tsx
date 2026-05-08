import { PrimaryLayout } from '@components/widgets';
import { BonusTab } from '@modules/lucky-box/bonus/BonusTab';
import { VoucherDiscountList } from '@modules/lucky-box/bonus/voucher-discount/VoucherDiscountList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function BonusVoucherShoppingPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTab activeItem="voucher-discount" />
      </div>
      <VoucherDiscountList />
    </PrimaryLayout>
  );
}
