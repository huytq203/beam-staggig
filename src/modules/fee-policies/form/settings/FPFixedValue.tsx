import { InputNumber, InputWrapper } from '@components/shared';
import { feeTypeOptions } from '@constants/select-options.constants';
import { Select } from '@douyinfe/semi-ui';

export const FPFixedValue = (props: any) => {
  const { watch, control, errors, setValue } = props;
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <InputWrapper
          required
          field="feeValue.0"
          label="Giá trị"
          component={(props: any) => {
            const rangeTypeFirst = watch('feeRangeType.0');
            return (
              <InputNumber
                suffix={rangeTypeFirst == 0 ? 'VNĐ' : '%'}
                format={watch('feeRangeType.0') == 0 ? 'thousands' : null}
                showClear={false}
                max={rangeTypeFirst == 1 ? 100 : Infinity}
                min={0}
                {...props}
              />
            );
          }}
          errors={errors}
          control={control}
        />

        <InputWrapper
          required
          field="feeRangeType.0"
          label="Loại"
          component={(props: any) => (
            <Select optionList={feeTypeOptions} showClear={false} onSelect={(value: any) => {
              if (value == 0) {
                setValue('feeSharingType', 0);
              }
            }} {...props} />
          )}
          errors={errors}
          control={control}
        />
      </div>
    </>
  );
};
