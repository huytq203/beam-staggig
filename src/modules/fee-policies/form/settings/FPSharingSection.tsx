import { InputNumber, InputWrapper } from '@components/shared';
import { feeTypeOptions } from '@constants/select-options.constants';
import { Select } from '@douyinfe/semi-ui';

export const FPTSharingSection = (props: any) => {
  const { errors, control, watch, setValue } = props;
  return (
    <div className="grid grid-cols-2 gap-4">
      <InputWrapper
        required
        field="feeSharingType"
        label="Tỉ lệ chia sẻ phí"
        component={(props: any) => (
          <Select
            optionList={
              watch('feeRangeType.0') == 0
                ? feeTypeOptions
                : [...feeTypeOptions, { value: 2, label: 'Phí cố định theo %' }]
            }
            showClear={false}
            {...props}
          />
        )}
        errors={errors}
        control={control}
      />
      <div className="grid grid-cols-2 gap-4">
        <InputWrapper
          required
          field="feeSharingValue"
          label="Doanh nghiệp"
          component={(props: any) => (
            <InputNumber
              format={watch('feeSharingType') == 0 ? 'thousands' : null}
              max={
                watch('feeSharingType') == 1
                  ? 100
                  : watch('feeSharingType') == 2
                  ? watch('feeValue.0')
                  : Infinity
              }
              min={0}
              suffix={watch('feeSharingType') !== 0 ? '%' : 'VNĐ'}
              showClear
              {...props}
            />
          )}
          errors={errors}
          control={control}
        />
        {watch('feeSharingType') !== 0 && (
          <InputWrapper
            field="feeSharingEmployee"
            label="Người lao động"
            component={(props: any) => (
              <InputNumber
                suffix="%"
                disabled={true}
                value={
                  watch('feeType') == 0 && watch('feeSharingType') == 2
                    ? (watch('feeValue.0') * 10 -
                        watch('feeSharingValue') * 10) /
                      10
                    : 100 - watch('feeSharingValue')
                }
                // value={100 - watch('feeSharingValue')}
              />
            )}
            errors={errors}
            control={control}
          />
        )}
      </div>
    </div>
  );
};
