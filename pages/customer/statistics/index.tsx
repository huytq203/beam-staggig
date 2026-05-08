import { PrimaryLayout } from '@components/widgets/Layouts';
import { CustomerStatisticsList } from '@modules/customer/customer-statistic/CustomerStatisticsList';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {},
  };
}

const ListCustomerStatisticPage: NextPage = (props: any) => {
  const router = useRouter();

  const baseRoute = `/customer/statistics`;

  const onClickViewAccountDetail = (rowData: any) => {
    router.push(`${baseRoute}/${rowData.id}/edit`);
  };

  return (
    <PrimaryLayout>
      <CustomerStatisticsList
        basePath={baseRoute}
        onClickViewDetail={onClickViewAccountDetail}
      />
    </PrimaryLayout>
  );
};

export default ListCustomerStatisticPage;
