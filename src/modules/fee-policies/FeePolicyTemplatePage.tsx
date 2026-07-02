import { GeneralSubPath } from '@constants/index';
import { useRouter } from 'next/router';
import { FeePolicyTemplateDetail } from './FeePolicyTemplateDetail';
import { FeePolicyTemplateActionForm } from './form';

export enum PageActionEnum {
  FPTemplateList,
  FPTemplateCreate,
  FPTemplateDetail,
  FPTemplateEdit,
}

export const FeePolicyTemplate = (props: any) => {
  const { setCheckData } = props;

  const router = useRouter();
  const slug = (router.query.slug as string[]) || ['home'];

  const originalRoute = `/fee-policies/templates`;
  const feePolicyTemplateId = router.query.feePolicyTemplateId;
  const getCurrentSlug = (): PageActionEnum => {
    switch (slug[0]) {
      case 'edit':
        return PageActionEnum.FPTemplateEdit;
      // case 'create':
      //   return PageActionEnum.FPTemplateCreate;
      default:
        return PageActionEnum.FPTemplateDetail;
    }
  };
  const currentPageAction = getCurrentSlug();

  return (
    <>
      {/* {currentPageAction == PageActionEnum.FPTemplateList && (
        <FeePolicyTemplateList />
      )} */}

      {currentPageAction == PageActionEnum.FPTemplateDetail && (
        <FeePolicyTemplateDetail
          feePolicyId={feePolicyTemplateId}
          onEdit={() =>
            router.push(`${originalRoute}/${feePolicyTemplateId}/edit`)
          }
          onCancel={() => router.push(`${originalRoute}`)}
          setCheckData={setCheckData}
        />
      )}
      {(currentPageAction == PageActionEnum.FPTemplateCreate ||
        currentPageAction == PageActionEnum.FPTemplateEdit) && (
        <FeePolicyTemplateActionForm
          feePolicyId={feePolicyTemplateId}
          isNew={currentPageAction == PageActionEnum.FPTemplateCreate}
          onCancel={() => router.push(`${originalRoute}`)}
          setCheckData={setCheckData}
        />
      )}
    </>
  );
};
