import { PrimaryLayout } from '@components/widgets/Layouts';
import { EstablishNotificationsList } from '@modules/notifications/establish-notifications';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {},
  };
}

const ListNotificationEstablishPage: NextPage = (props: any) => {
  const router = useRouter();

  const baseRoute = `/notifications/establish`;

  const onClickViewAccountDetail = (rowData: any) => {
    router.push(`${baseRoute}/${rowData.id}/edit`);
  };

  return (
    <PrimaryLayout>
      <EstablishNotificationsList
        basePath={baseRoute}
        onClickViewDetail={onClickViewAccountDetail}
      />
    </PrimaryLayout>
  );
};

export default ListNotificationEstablishPage;
