import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { AccountTabs } from '@modules/accounts/AccountTabs';
import { EditAccountPasswordForm } from '@modules/accounts/form/EditAccountPasswordForm';

import { NextPage } from 'next';

import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {
      
    },
  };
}

const EditAccountPage: NextPage = (props: any) => {
  const router = useRouter();

  const baseRoute = `/dashboard`;

  return (
    <PrimaryLayout>
      <div className='pt-6 px-6 flex flex-col gap-4'>
        <AccountTabs activeKey='edit-password' />
      </div>
      <ContentWrapper pageTitle='Đặt lại mật khẩu'>
        <EditAccountPasswordForm onClickCancel={() => router.push(baseRoute)} />
      </ContentWrapper>
    </PrimaryLayout>
  );
};

export default EditAccountPage;
