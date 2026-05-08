import { BoxWrapper, ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { EndUserTabs } from '@modules/end-user';
import { UserList } from '@modules/end-user/user';

import { useState } from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  return {
    props: {
      
    },
  };
}

export default function UserPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<any>(null);

  return (
    <PrimaryLayout>
      <div className="pt-6 px-6 flex flex-col gap-4">
        <EndUserTabs activeKey="user" />
      </div>

      <ContentWrapper
        pageTitle="Danh sách tài khoản"
        // primaryButtonText='Thêm mới người dùng'
        // onClickPrimaryButton={() => router.push('/end-user/create-user')}
      >
        <UserList />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
