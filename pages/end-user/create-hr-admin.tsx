import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { UserRole } from '@constants/auth.constants';
import { CreateHRAdminForm } from '@modules/end-user/form/CreateHRAdminForm';
import { useAuth } from '@contexts/authentication';
import { NextPage } from 'next';

import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;
  return {
    props: {},
  };
}

const CreateHRAdminPage: NextPage = (props: any) => {
  const router = useRouter();
  const { authCheckByRole } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]);
  const baseRoute = `/end-user/hr-admin`;
  return (
    <PrimaryLayout>
      <ContentWrapper pageTitle="Thêm mới HR Admin">
        <CreateHRAdminForm
          onClickCancel={() => router.push(baseRoute)}
          companyId={router.query.companyId}
        />
      </ContentWrapper>
    </PrimaryLayout>
  );
};

export default CreateHRAdminPage;
