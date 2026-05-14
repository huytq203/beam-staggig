import { ContentWrapper, MainContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { EditUserForm } from '@modules/end-user/form/EditUserForm';
import { UserTabs } from '@modules/end-user/user/UserTabs';

import { NextPage } from 'next';

import { useRouter } from 'next/router';
import { useState } from 'react';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {},
  };
}

const EditUserPage: NextPage = (props: any) => {
  const [checkData, setCheckData] = useState(true);
  const router = useRouter();

  const baseRoute = `/end-user/user`;

  const beamUsername = router.query.beamUsername;

  return (
    <PrimaryLayout>
      <EditUserForm
        beamUsername={beamUsername}
        isNew={false}
        onClickCancel={() => router.push(baseRoute)}
        setCheckData={setCheckData}
      />
    </PrimaryLayout>
  );
};

export default EditUserPage;
