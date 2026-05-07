import { InputNumber as SemiInputNumber } from '@douyinfe/semi-ui';
import { InputNumberProps } from '@douyinfe/semi-ui/lib/es/inputNumber';

export interface CustomInputNumberProps extends InputNumberProps {
  format?: 'thousands';
}
export const InputNumber = (props: CustomInputNumberProps) => {
  const { format } = props;
  if (format === 'thousands') {
    return (
      <SemiInputNumber
        suffix="VNĐ"
        step={10000}
        className="flex-grow"
        precision={0}
        onNumberChange={(values: any) => {
          if (values === '') return (values = 0);
        }}
        formatter={(value) =>
          `${value}`
            // .replace(/[^\d.]/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
        parser={(value) => value.replace(/\￥\s?|(,*)/g, '')}
        {...props}
      />
    );
  }
  return (
    <SemiInputNumber
      {...props}
      formatter={(value) =>
        `${value}`.replace(/[^\d.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      parser={(value) =>
        value.replace(
          /\￥\s?|(,*)|^[a-zA-Z!@#$%^&*()_+=-`~{}[\]|\\:;\"'<>?]/g,
          ''
        )
      }
    />
  );
};
