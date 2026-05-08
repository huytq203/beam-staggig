import { Divider } from '@douyinfe/semi-ui';
import { FPTSharingSection } from './FPSharingSection';
import { FPValueSection } from './FPValueSection';

export const FPCompanyMainSetting = (props: any) => {
  const { getValues, control, errors, watch, setValue } = props;
  return (
    <>
      {/* {watch('feeType') == 0 && (
        <FPFixedValue watch={watch} control={control} errors={errors} />
      )} */}

      <>
        <FPValueSection
          control={control}
          errors={errors}
          watch={watch}
          getValues={getValues}
          showAddMoreButton={false}
          showRemoveButton={false}
          setValue={setValue}
        />
      </>

      <Divider dashed />
      <FPTSharingSection control={control} errors={errors} watch={watch} />
      <Divider dashed />
    </>
  );
};
