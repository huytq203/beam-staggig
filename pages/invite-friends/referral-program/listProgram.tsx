import { ContentWrapper } from "@components/widgets";
import { PrimaryLayout } from "@components/widgets/Layouts";
import { ProgramList } from "@modules/invite-friends/invitaion-list/listProgramInvitaion/ListProgram";

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ListProgramPage() {
  return (
    <PrimaryLayout>
      <ContentWrapper pageTitle="Quản lý chương trình giới thiệu bạn bè">
        <ProgramList basePath="/invite-friends/referral-program" />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
