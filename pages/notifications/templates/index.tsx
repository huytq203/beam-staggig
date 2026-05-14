import { PrimaryLayout } from '@components/widgets/Layouts';
import { NotificationList } from '@modules/notifications/template-notifications/NotificationList';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {},
  };
}

const ListNotificationPage: NextPage = (props: any) => {
  const router = useRouter();

  const baseRoute = `/notifications/templates`;

  const onClickViewAccountDetail = (rowData: any) => {
    router.push(`${baseRoute}/${rowData.id}/edit`);
  };

  return (
    <PrimaryLayout>
      <NotificationList
        basePath={baseRoute}
        onClickViewDetail={onClickViewAccountDetail}
      />
    </PrimaryLayout>
  );
};

export default ListNotificationPage;
