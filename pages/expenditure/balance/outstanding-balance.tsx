import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { Button } from '@douyinfe/semi-ui';
import OuststandingBalanceList from '@modules/expenditure/ouststanding-balance/OuststandingBalanceList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function OuststandingBalancePage() {
  return (
    <PrimaryLayout>
      <OuststandingBalanceList />
    </PrimaryLayout>
  );
}
