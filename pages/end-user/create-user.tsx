import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { CreateHRAdminForm } from '@modules/end-user/form/CreateHRAdminForm';
import { CreateUserForm } from '@modules/end-user/form/CreateUserForm';

import { NextPage } from 'next';

import { useRouter } from 'next/router';
import NotFound from 'pages/404';

export async function getServerSideProps(props: any) {
  const { locale } = props;
  return {
    props: {
      
    },
  };
}

const CreateUserPage: NextPage = (props: any) => {
  // const router = useRouter();
  // const baseRoute = `/end-user/user`;
  return (
    // <PrimaryLayout>
    //   <ContentWrapper pageTitle="Thêm mới người dùng">
    <NotFound />
    //    </ContentWrapper>
    // </PrimaryLayout>
  );
};

export default CreateUserPage;
