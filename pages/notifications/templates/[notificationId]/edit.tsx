import { PrimaryLayout } from '@components/widgets/Layouts';
import { CreateNotificationForm } from '@modules/notifications/template-notifications';

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
  const baseRoute = `/notifications/templates`;

  const notificationId = router.query.notificationId;

  return (
    <PrimaryLayout breadcrumbs={['Chi tiết thông báo tự động']}>
      <CreateNotificationForm
        notificationId={notificationId}
        isNew={false}
        onClickCancel={() => router.push(baseRoute)}
      />
    </PrimaryLayout>
  );
};

export default EditNotificationPage;
