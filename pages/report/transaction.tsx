import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { ReportTransaction } from '@modules/report/transaction/ReportTransaction';
import { axiosInstance } from '@services/api';
import { CompanyAPIs, CompanyService } from '@services/companies';
import cookie from 'cookie';
import { useQuery } from 'react-query';

export default function ReportTransactionPage(props: any) {
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

  return (
    <PrimaryLayout>
      <ContentWrapper pageTitle="Báo cáo theo giao dịch">
        <ReportTransaction companyData={companyData} />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
