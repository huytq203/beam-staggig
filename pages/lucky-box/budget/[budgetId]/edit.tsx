import { PrimaryLayout } from '@components/widgets';
import { CreateBudgetForm } from '@modules/lucky-box/buget/CreateBugetForm';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

const EditBudgetPage: NextPage = (props: any) => {
  const router = useRouter();

  const baseRoute = `/luckybox/budget`;

  const budgetId = router.query.budgetId;

  return (
    <PrimaryLayout breadcrumbs={['Cập nhật phần thưởng']}>
      <CreateBudgetForm
        isNew={false}
        budgetId={budgetId}
        onClickCancel={() => router.push(baseRoute)}
      />
    </PrimaryLayout>
  );
};

export default EditBudgetPage;
