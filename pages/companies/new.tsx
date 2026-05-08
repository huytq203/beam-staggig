import { PrimaryLayout } from '@components/widgets/Layouts';
import { useAuth } from '@contexts/authentication';
import { ContentWrapper } from '@components/widgets';
import { CreateCompanyForm } from '@modules/companies/form/CreateCompanyForm';
import { useRouter } from 'next/router';
import { UserRole } from '@constants/auth.constants';
export async function getServerSideProps(props: any) {
  return {
    props: {
      // Will be passed to the page component as props
    },
  };
}

export default function CreateCompanyPage() {
  const router = useRouter();
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CUSTOMER_SERVICE,
  ]);
  return (
    <div>
      <PrimaryLayout breadcrumbs={['Tạo mới doanh nghiệp']}>
        <CreateCompanyForm onClickCancel={() => router.push('/companies')} />
      </PrimaryLayout>
    </div>
  );
}
