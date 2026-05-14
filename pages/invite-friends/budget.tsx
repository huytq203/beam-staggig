import { PrimaryLayout } from '@components/widgets/Layouts';
import { BudgetList } from '@modules/invite-friends/budget/BudgetList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function BudgetPage() {
  return (
    <PrimaryLayout>
      <BudgetList />
    </PrimaryLayout>
  );
}
