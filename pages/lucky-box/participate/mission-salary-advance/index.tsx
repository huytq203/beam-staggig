import { PrimaryLayout } from '@components/widgets';
import { MissionSalaryAdvanceList } from '@modules/lucky-box/participate/mission-salary-advance/MissionSalaryAdvanceList';
import { ParticipateTab } from '@modules/lucky-box/participate/ParticipateTab';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ParticipateMissionSalaryAdvancePage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <ParticipateTab activeItem="mission-salary-advance" />
      </div>
      <MissionSalaryAdvanceList />
    </PrimaryLayout>
  );
}
