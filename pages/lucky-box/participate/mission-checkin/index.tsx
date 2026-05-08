import { PrimaryLayout } from '@components/widgets';
import { MissionCheckinList } from '@modules/lucky-box/participate/mission-checkin/MissionCheckinList';
import { ParticipateTab } from '@modules/lucky-box/participate/ParticipateTab';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ParticipateMissionCheckinPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <ParticipateTab activeItem="mission-checkin" />
      </div>
      <MissionCheckinList />
    </PrimaryLayout>
  );
}
