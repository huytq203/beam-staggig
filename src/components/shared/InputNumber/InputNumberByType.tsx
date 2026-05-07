import { CustomInputNumberProps, InputNumber } from '.';

export interface InputNumberByTypeProps extends CustomInputNumberProps {
  displayType: number;
}

export const InputNumberByType = (props: InputNumberByTypeProps) => {
  const { displayType, disabled } = props;
  const elementProps: CustomInputNumberProps =
    displayType == 0
      ? {
          showClear: true,
          autoComplete: 'off',
          format: 'thousands',
          suffix: 'VNĐ',
          placeholder: 'Nhập vào giá trị',
          min: 0,
        }
      : {
          showClear: true,
          autoComplete: 'off',
          placeholder: 'Nhập vào giá trị',
          suffix: '%',
          min: 0,
          max: 100,
        };
  return <InputNumber {...elementProps} {...props} />;
};
