import { PrimaryLayout } from '@components/widgets/Layouts';
import { CreateNotificationForm } from '@modules/notifications/template-notifications';

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
  const baseRoute = `/notifications/templates`;
  return (
    <PrimaryLayout breadcrumbs={['Tạo mới thông báo']}>
      <CreateNotificationForm
        isNew={true}
        onClickCancel={() => router.push(baseRoute)}
      />
    </PrimaryLayout>
  );
};

export default CreateNotificationPage;
