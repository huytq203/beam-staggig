import { ContentWrapper, PrimaryLayout } from '@components/widgets';
import { BonusTab } from '@modules/lucky-box/bonus/BonusTab';
import ImportCash from '@modules/lucky-box/bonus/cash/ImportCash';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ImportBonusPhoneCardPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTab activeItem="cash" />
      </div>
      <ContentWrapper pageTitle="Tải lên danh sách chi thưởng">
        <ImportCash />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
