import { BoxWrapper, ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { EndUserTabs } from '@modules/end-user';
import { HRAdminList } from '@modules/end-user/hr-admin';

import { useState } from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  return {
    props: {
      
    },
  };
}

export default function HRAdminPage() {
  const [filter, setFilter] = useState<any>(null);
  const router = useRouter();

  return (
    <PrimaryLayout>
      <div className='pt-6 px-6 flex flex-col gap-4'>
        <EndUserTabs activeKey='hr-admin' />
      </div>

      <ContentWrapper
        pageTitle='Danh sách tài khoản'
        primaryButtonText='Thêm mới HR Admin'
        onClickPrimaryButton={() => router.push('/end-user/create-hr-admin')}
      >
        <HRAdminList />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
