import { PrimaryLayout } from '@components/widgets';
import { BonusTab } from '@modules/lucky-box/bonus/BonusTab';
import { PhoneCardList } from '@modules/lucky-box/bonus/phone-card/PhoneCardList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function BonusPhoneCardPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTab activeItem="phone-card" />
      </div>
      <PhoneCardList />
    </PrimaryLayout>
  );
}
