import { InputNumber, InputWrapper } from '@components/shared';
import { Switch } from '@douyinfe/semi-ui';

export const FPRangeLimitSection = (props: any) => {
  const { errors, control, watch, showLowerValue = true } = props;
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {showLowerValue && (
          <div className="flex gap-6">
            <div className="flex">
              <InputWrapper
                field="applyLowerFeeLimit"
                label="Thiết lập giá trị tối thiểu"
                component={(props: any) => (
                  <Switch checked={props.value} showClear {...props} />
                )}
                errors={errors}
                control={control}
              />
            </div>
            <div className="flex-grow">
              <InputWrapper
                required
                field="lowerFeeLimit"
                label="Giá trị tối thiểu"
                component={(props: any) => (
                  <InputNumber
                    disabled={watch('applyLowerFeeLimit') != true}
                    showClear
                    format="thousands"
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />
            </div>
          </div>
        )}

        <div className="flex gap-6">
          <div className="flex">
            <InputWrapper
              field="applyUpperFeeLimit"
              label="Thiết lập giá trị tối đa"
              component={(props: any) => (
                <Switch checked={props.value} showClear {...props} />
              )}
              errors={errors}
              control={control}
            />
          </div>
          <div className="flex-grow">
            <InputWrapper
              required
              field="upperFeeLimit"
              label="Giá trị tối đa"
              component={(props: any) => (
                <InputNumber
                  disabled={watch('applyUpperFeeLimit') != true}
                  showClear
                  format="thousands"
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
          </div>
        </div>
      </div>
    </>
  );
};
