import { InputNumber } from '@components/shared';
import { InputWrapper } from '@components/shared/InputWrapper';
import { feeTypeOptions } from '@constants/index';
import { IconArrowRight } from '@douyinfe/semi-icons';
import { Button, Select } from '@douyinfe/semi-ui';

export const FeeRangeListRow = (props: any) => {
  const {
    data,
    noLimitUpper,
    errors,
    control,
    index,
    isFirst,
    watch,
    isLast,
    next,
    prev,
    onRemove,
    isRemovable,
    showRemoveButton,
    finalLimit,
  } = props;
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center w-full gap-4">
          <InputWrapper
            field={`rangeList.${index}.from`}
            component={(props: any) => (
              <InputNumber
                disabled={isFirst}
                suffix="VNĐ"
                className="flex-grow"
                format="thousands"
                min={watch(`rangeList.${index - 1}.from`) + 2}
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />
          <IconArrowRight size="small" />
          {isLast && (
            <InputNumber suffix="VNĐ" disabled={true} className={`flex-grow`} />
          )}
          {!isLast && (
            <div className="flex-grow">
              <InputNumber
                suffix="VNĐ"
                disabled={true}
                className="flex-grow"
                format="thousands"
                {...props}
                value={watch(`rangeList.${index + 1}.from`) - 1}
              />
            </div>
          )}
        </div>
        <div className="flex justify-between gap-4 items-center">
          <div className="flex-grow">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <InputWrapper
                  field={`rangeList.${index}.fee`}
                  component={(props: any) => (
                    <InputNumber
                      suffix={
                        watch(`rangeList.${index}.feeType`) == 0 ? 'VNĐ' : '%'
                      }
                      insetLabel="Phí"
                      className="w-full"
                      min={0}
                      max={
                        watch(`rangeList.${index}.feeType`) == 0
                          ? Infinity
                          : 100
                      }
                      format={
                        watch(`rangeList.${index}.feeType`) == 0
                          ? 'thousands'
                          : null
                      }
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              <InputWrapper
                field={`rangeList.${index}.feeType`}
                component={(props: any) => (
                  <Select
                    optionList={feeTypeOptions}
                    {...props}
                    showClear={false}
                  />
                )}
                errors={errors}
                control={control}
              />
            </div>
          </div>
          {showRemoveButton && (
            <div className="flex gap-4">
              <Button
                disabled={isRemovable}
                onClick={() => onRemove && onRemove(data, index)}
              >
                -
              </Button>
            </div>
          )}
        </div>
      </div>
      <InputWrapper
        field={`rangeList.${index}`}
        errors={errors}
        control={control}
        component={() => <></>}
      />
    </div>
  );
};
