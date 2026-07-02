import { ContentWrapper } from '@components/widgets';
import { useRouter } from 'next/router';
import ReconciliationConcernList from './ReconciliationConcernList';
export enum PageActionEnum {
  RCList,
  // FPTemplateCreate,
  // FPTemplateDetail,
  // FPTemplateEdit,
}
export const ReconciliationConcern = (props: any) => {
  const { companyData } = props;
  const router = useRouter();
  const slug = (router.query.slug as string[]) || ['home'];
  const getCurrentSlug = (): PageActionEnum => {
    switch (slug[0]) {
      case 'home':
        return PageActionEnum.RCList;
      default:
        return PageActionEnum.RCList;
    }
  };
  const currentPageAction = getCurrentSlug();
  return (
    <>
      {currentPageAction == PageActionEnum.RCList && (
        <ReconciliationConcernList companyData={companyData} />
      )}
    </>
  );
};
