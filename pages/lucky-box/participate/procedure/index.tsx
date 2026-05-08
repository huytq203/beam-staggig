import { PrimaryLayout } from '@components/widgets';
import { ParticipateTab } from '@modules/lucky-box/participate/ParticipateTab';
import { ProcedureList } from '@modules/lucky-box/participate/procedure/ProcedureList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ParticipateMissionSalaryAdvancePage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <ParticipateTab activeItem="procedure" />
      </div>
      <ProcedureList />
    </PrimaryLayout>
  );
}
