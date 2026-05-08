import { PrimaryLayout } from '@components/widgets';
import { BonusTab } from '@modules/lucky-box/bonus/BonusTab';
import { CashList } from '@modules/lucky-box/bonus/cash/CashList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function BonusCashPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTab activeItem="cash" />
      </div>
      <CashList />
    </PrimaryLayout>
  );
}
