import { ContentWrapper, PrimaryLayout } from '@components/widgets';
import { BonusTab } from '@modules/lucky-box/bonus/BonusTab';
import ImportVoucherShopping from '@modules/lucky-box/bonus/voucher-shopping/ImportVoucherShopping';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ImportBonusVoucherShoppingPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTab activeItem="voucher-shopping" />
      </div>
      <ContentWrapper pageTitle="Tải lên danh sách chi thưởng">
        <ImportVoucherShopping />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
