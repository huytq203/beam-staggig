import { Controller } from 'react-hook-form';
import { RequiredAsterisk } from '../RequiredAsterisk';

export interface InputWrapperProps {
  field?: string;
  control?: any;
  component: any;
  required?: boolean;
  label?: string;
  errors?: any;
  labelPosition?: 'top' | 'right' | 'left' | 'bottom';
  align?: 'center' | 'baseline';
}
export const InputWrapper = (props: InputWrapperProps) => {
  const {
    required = false,
    label,
    errors = [],
    field = '',
    control,
    component,
    labelPosition = 'top',
    align = 'baseline',
  } = props;

  const getLabelPosition = () => {
    if (labelPosition == 'left') return 'flex';
    if (labelPosition == 'right') return 'flex flex-row-reverse';
    if (labelPosition == 'bottom') return 'flex flex-col-reverse';
    return 'flex flex-col';
  };

  const labelPos = getLabelPosition();

  if (!field) {
    return (
      <div className={`${labelPos} ${align} ${label ? 'gap-2' : null}`}>
        <label>
          {label} {required && <RequiredAsterisk />}
        </label>
        <div className="flex flex-col">
          {component({
            validateStatus: errors[field] ? 'error' : 'default',
          })}

          {errors && errors[field] && (
            <div className="text-red-500 pt-2">{errors[field].message}</div>
          )}
        </div>
      </div>
    );
  }
  const getValueByKey = (path: any, obj = self, separator = '.') => {
    var properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev: any, curr: any) => prev?.[curr], obj);
  };
  const validatedObject: any = getValueByKey(field, errors);
  return (
    <>
      <div className={`${labelPos} ${align} ${label ? 'gap-2' : null}`}>
        <label>
          {label} {required && <RequiredAsterisk />}
        </label>
        <div className="flex flex-col">
          <Controller
            name={field}
            control={control}
            render={({ field: fieldProps }) => {
              return (
                <>
                  {component({
                    ...fieldProps,
                    validateStatus: validatedObject ? 'error' : 'default',
                  })}
                </>
              );
            }}
          />
          {errors && validatedObject && (
            <div className="text-red-500 pt-2">{validatedObject?.message}</div>
          )}
        </div>
      </div>
    </>
  );
};
