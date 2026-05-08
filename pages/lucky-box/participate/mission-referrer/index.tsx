import { PrimaryLayout } from '@components/widgets';
import { MissionReferrerList } from '@modules/lucky-box/participate/mission-referrer/MissionReferrerList';
import { MissionSalaryAdvanceList } from '@modules/lucky-box/participate/mission-salary-advance/MissionSalaryAdvanceList';
import { ParticipateTab } from '@modules/lucky-box/participate/ParticipateTab';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ParticipateMissionReferrerPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <ParticipateTab activeItem="mission-referrer" />
      </div>
      <MissionReferrerList />
    </PrimaryLayout>
  );
}
