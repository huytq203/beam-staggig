import { InputWrapper } from '@components/shared';
import { IconDelete } from '@douyinfe/semi-icons';
import { Button, Select } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { feePolicyTypeOptions } from './constants';
import { FeePolicyPickerModal } from './modal';

interface SelectFeePolicyTemplateProps {
  control: any;
  errors: any;
  templateType: number;
  onSelect: any;
  onClear: any;
  isNew: any;
}

export const SelectFeePolicyTemplate = (
  props: SelectFeePolicyTemplateProps
) => {
  const { control, errors, templateType, onSelect, onClear, isNew } = props;

  const [isOpenPicker, setIsOpenPicker] = useState(false);

  const onClickSelect = (e: any) => {
    onSelect && onSelect(e);
    setIsOpenPicker(false);
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <InputWrapper
          required
          field="feeType"
          label="Chọn Chính sách phí"
          component={(props: any) => (
            <Select
              optionList={feePolicyTypeOptions}
              {...props}
              disabled={!isNew}
            />
          )}
          errors={errors}
          control={control}
        />
        {isNew && (
          <InputWrapper
            required
            field="picker"
            label="Chọn Mẫu"
            component={(props: any) => (
              <div className="flex gap-4 items-center">
                <Button
                  size="small"
                  theme="solid"
                  className="flex-grow"
                  onClick={() => setIsOpenPicker(true)}
                  disabled={!isNew}
                >
                  Chọn mẫu
                </Button>
                <Button onClick={onClear} size="small" disabled={!isNew}>
                  <IconDelete />
                </Button>
              </div>
            )}
            errors={errors}
            control={control}
          />
        )}
      </div>

      <FeePolicyPickerModal
        templateType={templateType}
        isOpen={isOpenPicker}
        onSubmit={onClickSelect}
        onCancel={() => setIsOpenPicker(false)}
      />
    </>
  );
};
