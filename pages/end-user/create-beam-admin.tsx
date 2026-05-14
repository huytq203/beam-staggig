import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { UserRole } from '@constants/auth.constants';
import { CreateBeamAdminForm } from '@modules/end-user/form';
import { useAuth } from '@contexts/authentication';
import { NextPage } from 'next';

import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;
  return {
    props: {},
  };
}

const CreateBeamAdminPage: NextPage = (props: any) => {
  const router = useRouter();
  const { authCheckByRole } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]);
  const baseRoute = `/end-user/beam-admin`;
  return (
    <PrimaryLayout>
      <ContentWrapper pageTitle="Thêm mới quản trị viên">
        <CreateBeamAdminForm
          isNew={true}
          onClickCancel={() => router.push(baseRoute)}
        />
      </ContentWrapper>
    </PrimaryLayout>
  );
};

export default CreateBeamAdminPage;
