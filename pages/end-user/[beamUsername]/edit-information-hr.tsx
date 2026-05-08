import { ContentWrapper, MainContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { EditHRAdminForm } from '@modules/end-user/form/EditHRAdminForm';
import { HRAdminTabs } from '@modules/end-user/hr-admin/HRAdminTabs';
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

  const baseRoute = `/end-user/hr-admin`;

  const beamUsername = router.query.beamUsername;
  return (
    <PrimaryLayout>
      <MainContentWrapper data={checkData}>
        <div className="pt-6 px-6 flex flex-col gap-4">
          <HRAdminTabs
            activeKey="edit-information-hr"
            beamUsername={beamUsername}
          />
        </div>
        <ContentWrapper pageTitle="Chỉnh sửa thông tin tài khoản">
          <EditHRAdminForm
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
