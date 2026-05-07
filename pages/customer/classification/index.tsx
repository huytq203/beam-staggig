import { PrimaryLayout } from '@components/widgets/Layouts';
import { CustomerClassificationList } from '@modules/customer/customer-classification/CustomerClassificationList';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {},
  };
}

const ListCustomerPage: NextPage = (props: any) => {
  const router = useRouter();

  const baseRoute = `/customer/classification`;

  const onClickViewAccountDetail = (rowData: any) => {
    router.push(`${baseRoute}/${rowData.id}/edit`);
  };

  return (
    <PrimaryLayout>
      <CustomerClassificationList
        basePath={baseRoute}
        onClickViewDetail={onClickViewAccountDetail}
      />
    </PrimaryLayout>
  );
};

export default ListCustomerPage;
