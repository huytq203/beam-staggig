import { PrimaryLayout } from '@components/widgets/Layouts';
import { ProgramList } from '@modules/invite-friends/invitaion-list/listProgramInvitaion/ListProgram';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ListProgramPage() {
  return (
    <PrimaryLayout>
      <ProgramList/>
    </PrimaryLayout>
  );
}
