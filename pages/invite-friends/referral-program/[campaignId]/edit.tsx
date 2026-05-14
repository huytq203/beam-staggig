import { PrimaryLayout } from "@components/widgets";
import { CreateProgram } from "@modules/invite-friends/invitaion-list/listProgramInvitaion/CreateProgram";
import { NextPage } from "next";

import { useRouter } from "next/router";

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {
      // companyData: companyData.data,
      // currentProfile: companyCurrentProfile,
    },
  };
}

const EditInvitationCampaginPage: NextPage = (props: any) => {
  const router = useRouter();

  const baseRoute = `/invite-friends/referral-program/listProgram`;

  const campaignId = router.query.campaignId;


  return (
    <PrimaryLayout breadcrumbs={["Chi tiết chiến dịch"]}>
      <CreateProgram
        campaignId={campaignId}
        isNew={false}
        onClickCancel={() => router.push(baseRoute)}
      />
    </PrimaryLayout>
  );
};

export default EditInvitationCampaginPage;
