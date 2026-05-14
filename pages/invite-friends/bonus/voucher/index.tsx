import { PrimaryLayout } from '@components/widgets/Layouts';
import { VoucherList } from '@modules/invite-friends/bonus/voucher/VoucherList';
import { BonusTabs } from '@modules/invite-friends/bonus/BonusTab';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function VoucherPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTabs activeItem="voucher" />
      </div>
      <VoucherList />
    </PrimaryLayout>
  );
}
