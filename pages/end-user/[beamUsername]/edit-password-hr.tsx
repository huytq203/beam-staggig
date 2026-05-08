import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { EditPasswordForm } from '@modules/end-user/form/EditPasswordForm';
import { HRAdminTabs } from '@modules/end-user/hr-admin/HRAdminTabs';

import { NextPage } from 'next';

import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {
      
    },
  };
}

const EditBeamAdminPage: NextPage = (props: any) => {
  const router = useRouter();

  const baseRoute = `/end-user/beam-admin`;

  const beamUsername = router.query.beamUsername;
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6 flex flex-col gap-4">
        <HRAdminTabs activeKey="edit-password-hr" beamUsername={beamUsername} />
      </div>
      <ContentWrapper pageTitle="Đặt lại mật khẩu">
        <EditPasswordForm
          beamUsername={beamUsername}
          onCancel={() => router.push(baseRoute)}
        />
      </ContentWrapper>
    </PrimaryLayout>
  );
};

export default EditBeamAdminPage;
