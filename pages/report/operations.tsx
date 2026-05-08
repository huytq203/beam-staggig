import { PrimaryLayout } from '@components/widgets/Layouts';
import { ReportOperations } from '@modules/report/operations/ReportOperations';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {},
  };
}

export default function ReportOperationsPage() {
  return (
    <PrimaryLayout>
      <ReportOperations />
    </PrimaryLayout>
  );
}
