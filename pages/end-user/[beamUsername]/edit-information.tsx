import { ContentWrapper, MainContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { BeamAdminTabs } from '@modules/end-user/beam-admin/BeamAdminTabs';
import { EditBeamAdminForm } from '@modules/end-user/form/EditBeamAdminForm';

import { NextPage } from 'next';

import { useRouter } from 'next/router';
import { useState } from 'react';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {},
  };
}

const EditBeamAdminPage: NextPage = (props: any) => {
  const [checkData, setCheckData] = useState(true);
  const router = useRouter();

  const baseRoute = `/end-user/beam-admin`;

  const beamUsername = router.query.beamUsername;

  return (
    <PrimaryLayout>
      <MainContentWrapper data={checkData}>
        <div className="pt-6 px-6 flex flex-col gap-4">
          <BeamAdminTabs
            activeKey="edit-information"
            beamUsername={beamUsername}
          />
        </div>
        <ContentWrapper pageTitle="Chỉnh sửa thông tin tài khoản">
          <EditBeamAdminForm
            beamUsername={beamUsername}
            isNew={false}
            onClickCancel={() => router.push(baseRoute)}
            setCheckData={setCheckData}
          />
        </ContentWrapper>
      </MainContentWrapper>
    </PrimaryLayout>
  );
};

export default EditBeamAdminPage;
