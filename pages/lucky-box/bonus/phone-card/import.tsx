import { ContentWrapper, PrimaryLayout } from '@components/widgets';
import { BonusTab } from '@modules/lucky-box/bonus/BonusTab';
import ImportPhoneCard from '@modules/lucky-box/bonus/phone-card/ImportPhoneCard';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ImportBonusPhoneCardPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTab activeItem="phone-card" />
      </div>
      <ContentWrapper pageTitle="Tải lên danh sách chi thưởng">
        <ImportPhoneCard />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
