import { ContentWrapper } from "@components/widgets";
import { PrimaryLayout } from "@components/widgets/Layouts";
import { InvitaionTabs } from "@modules/invite-friends/invitaion-list/InvitaionTabs";
import { FriendInvitationVoucherList } from "@modules/invite-friends/invitaion-list/voucher-list/FriendInvitationVoucherList";

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ListVoucherProgramPage() {
  return (
    <PrimaryLayout>
      <InvitaionTabs activeItem="voucher" />
      <ContentWrapper pageTitle="Quản lý voucher">
        <FriendInvitationVoucherList basePath="/invite-friends/referral-program" />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
