import { ContentWrapper, PrimaryLayout } from '@components/widgets';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { CreateBudgetForm } from '@modules/lucky-box/buget/CreateBugetForm';
export async function getServerSideProps(props: any) {
  const { locale } = props;
  return {
    props: {},
  };
}

const CreateBudgetPage: NextPage = (props: any) => {
  const router = useRouter();
  const baseRoute = `/luckybox/budget`;
  return (
    <PrimaryLayout breadcrumbs={['Thêm mới phần thưởng']}>
      <CreateBudgetForm
        isNew={true}
        onClickCancel={() => router.push(baseRoute)}
      />
    </PrimaryLayout>
  );
};

export default CreateBudgetPage;
