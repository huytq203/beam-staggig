import { PrimaryLayout } from '@components/widgets/Layouts';
import { CreateEstablishNotificationsForm } from '@modules/notifications/establish-notifications';

import { NextPage } from 'next';

import { useRouter } from 'next/router';
import { useState } from 'react';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {
      // companyData: companyData.data,
      // currentProfile: companyCurrentProfile,
    },
  };
}

const EditNotificationPage: NextPage = (props: any) => {
  const router = useRouter();
  const baseRoute = `/notifications/establish`;

  const notificationId = router.query.notificationsEstablishId;

  return (
    <PrimaryLayout breadcrumbs={['Chi tiết thông báo thiết lập']}>
      <CreateEstablishNotificationsForm
        notificationId={notificationId}
        isNew={false}
        onClickCancel={() => router.push(baseRoute)}
      />
    </PrimaryLayout>
  );
};

export default EditNotificationPage;
