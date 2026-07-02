import { Divider } from '@douyinfe/semi-ui';
import { FPTSharingSection } from './FPSharingSection';
import { FPValueSection } from './FPValueSection';

export const FPMainSetting = (props: any) => {
  const { control, errors, watch, getValues, data, setValue } = props;

  return (
    <>
      <Divider dashed />
      <FPValueSection
        control={control}
        errors={errors}
        watch={watch}
        getValues={getValues}
        setValue={setValue}
      />
      <Divider dashed />
      <FPTSharingSection
        control={control}
        errors={errors}
        watch={watch}
        data={data}
        setValue={setValue}
      />

      <Divider dashed />
    </>
  );
};
