import { ContentWrapper, PrimaryLayout } from '@components/widgets';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { CreateBudgetForm } from '@modules/lucky-box/buget/CreateBugetForm';
import { CreateProgram } from '@modules/invite-friends/invitaion-list/listProgramInvitaion/CreateProgram';
export async function getServerSideProps(props: any) {
  const { locale } = props;
  return {
    props: {},
  };
}

const CreateProgramPage: NextPage = (props: any) => {
  const router = useRouter();
  const baseRoute = `/referral-program/create-program-invitation`;
  return (
    <PrimaryLayout breadcrumbs={['Thêm mới chương trình giới thiệu bạn bè']}>
      <CreateProgram
        isNew={true}
        onClickCancel={() => router.push(baseRoute)}
      />
    </PrimaryLayout>
  );
};

export default CreateProgramPage;
