import { PrimaryLayout } from '@components/widgets/Layouts';
import { CreateEstablishNotificationsForm } from '@modules/notifications/establish-notifications';

import { NextPage } from 'next';

import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;
  return {
    props: {},
  };
}

const CreateNotificationPage: NextPage = (props: any) => {
  const router = useRouter();
  const baseRoute = `/notifications/establish`;
  return (
    <PrimaryLayout breadcrumbs={['Tạo mới thông báo thiết lập']}>
      <CreateEstablishNotificationsForm
        isNew={true}
        onClickCancel={() => router.push(baseRoute)}
      />
    </PrimaryLayout>
  );
};

export default CreateNotificationPage;
