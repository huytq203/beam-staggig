import { PrimaryLayout } from '@components/widgets/Layouts';
import { CompanyGeneralInformation } from '@modules/companies';
import { CompanyService } from '@services/companies';
import { NextPage } from 'next';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { TicketService } from '@services/ticket-management';
export async function getServerSideProps(props: any) {
  const { locale } = props;
  const { companyId } = props.params;
  return {
    props: {
      companyId: companyId,
    },
  };
}

const EditCompanyPage: NextPage = (props: any) => {
  const { companyId } = props;
  const [checkData, setCheckData] = useState(true);
  const {
    data: currentCompanyProfile,
    isLoading: isLoadingCurrentCompanyProfile,
    isFetching: isFetchingCurrentCompanyProfile,
    refetch: reFetchProfileData,
  } = useQuery(
    ['current-company-profile-data', companyId],
    async () => {
      const response = await CompanyService.getCurrentProfile(companyId);
      return response;
    },
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const {
    data: companyData,
    isLoading: isLoadingCompanyData,
    isFetching: isFetchingCompanyData,
    refetch: reFetchCompanyData,
  } = useQuery(
    ['company-data', companyId],
    async () => {
      const response = await CompanyService.getCompany(companyId);
      return response;
    },
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const {
    data: isShowTicket,
    isLoading: isLoadingTicket,
    isFetching: isFetchingTicket,
    refetch: reFetchTicket,
  } = useQuery(
    ['show-ticket', companyId],
    async () => {
      const response = await TicketService.checkHideFeatureTicket(companyId);
      return response;
    },
    {
      enabled: companyId !== undefined && companyId !== null,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const isLoading =
    isLoadingCompanyData ||
    isFetchingCompanyData ||
    isLoadingCurrentCompanyProfile ||
    isFetchingCurrentCompanyProfile;

  return (
    <PrimaryLayout breadcrumbs={['Chi tiết doanh nghiệp']}>
      {/* <MainContentWrapper data={checkData}> */}
      {/* {!isLoading && companyData ? ( */}
      <CompanyGeneralInformation
        currentProfile={currentCompanyProfile}
        companyData={companyData}
        reFetchCompanyData={reFetchCompanyData}
        reFetchProfileData={reFetchProfileData}
        setCheckData={setCheckData}
        isLoadingCompanyData={isLoadingCompanyData}
        isShowTicket={isShowTicket}
      />
      {/* ) : (
          <Skeleton active />
        )} */}
      {/* </MainContentWrapper> */}
    </PrimaryLayout>
  );
};

export default EditCompanyPage;
