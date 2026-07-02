import { InputWrapper } from '@components/shared';
import { FeePolicyRangeList } from '@modules/fee-policies';
import { useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { FPFixedValue } from './FPFixedValue';
import { FPRangeLimitSection } from './FPRangeLimitSection';

export const FPValueSection = (props: any) => {
  const {
    errors,
    control,
    watch,
    getValues,
    showAddMoreButton = true,
    showRemoveButton = true,
    setValue,
  } = props;

  const { fields, append, prepend, swap, move, insert, remove } = useFieldArray(
    {
      control,
      name: 'rangeList',
    } as any
  );

  const onAddMoreRange = () => {
    const rangeList: any = getValues('rangeList');
    const dataSize = rangeList.length;

    if (dataSize == 0) {
      append({
        uuid: uuidv4(),
        from: 0,
        type: 0,
        fee: 0,
        feeType: 0,
      });
    } else {
      append({
        uuid: uuidv4(),
        from: rangeList[dataSize - 1].to + 1,
        type: 0,
        fee: 0,
        feeType: 0,
      });
    }
  };

  const getFeeRangeData = () => {
    return getValues('rangeList');
  };

  const onRemoveRangeValue = (data: any, index: any) => {
    remove(index);
  };

  return (
    <>
      {watch('feeType') == 0 && (
        <>
          <InputWrapper
            field="feeValue"
            component={(props: any) => (
              <FPFixedValue
                watch={watch}
                control={control}
                errors={errors}
                setValue={setValue}
              />
            )}
            errors={errors}
            control={control}
          />
        </>
      )}

      {watch('feeType') !== 0 && (
        <>
          <InputWrapper
            required
            field="rangeList"
            label="Khoảng tiền"
            component={(props: any) => (
              <FeePolicyRangeList
                control={control}
                errors={errors}
                watch={watch}
                onClickAddMoreRange={onAddMoreRange}
                data={getFeeRangeData()}
                onRemoveRangeValue={onRemoveRangeValue}
                showAddMoreButton={showAddMoreButton}
                showRemoveButton={showRemoveButton}
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />
        </>
      )}

      {(watch('feeRangeType.0') == 1 || watch('feeType') == 1) && (
        <FPRangeLimitSection
          control={control}
          errors={errors}
          watch={watch}
          showLowerValue={watch('feeType') == 0}
        />
      )}
    </>
  );
};
