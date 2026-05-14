import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { ReconciliationConcern } from '@modules/reconciliation';
import { CompanyService } from '@services/companies';
import { useQuery } from 'react-query';
export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ReconciliationConcernPage() {
  const {
    data: companyData,
    isLoading: isLoadingCompanyData,
    isFetching: isFetchingCompanyData,
    refetch: reFetchCompanyData,
  } = useQuery(
    ['company-data'],
    async () => {
      const response = await CompanyService.getAllCompaniesDropdown({});
      return response;
    },
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const isLoading = isLoadingCompanyData || isFetchingCompanyData;
  if (isLoadingCompanyData) return <></>;
  return (
    <PrimaryLayout>
      <ReconciliationConcern companyData={companyData} />
    </PrimaryLayout>
  );
}
