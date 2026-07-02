import { DatePicker } from '@douyinfe/semi-ui';
import moment from 'moment';
import { forwardRef } from 'react';

const getInitData = () => {
  const now = new Date();
  const temp = new Date(now.getTime());
  const next = temp.setFullYear(temp.getFullYear() + 4);
  return [now, next];
};
export const CustomMonthRangePicker = forwardRef<any, any>((props, ref) => {
  const {
    value = [null, null],
    onChange,
    type,
    placeholder,
    format,
    size,
  } = props;

  const onChangeDate = (date: any, isStart: any) => {
    const [now, next] = value;
    let newNow = now;
    let newNext = next;
    if (isStart) {
      newNow = date;
    } else {
      newNext = date;
    }
    onChange([newNow, newNext]);
  };

  return (
    <div ref={ref} className="flex gap-2">
      <DatePicker
        placeholder={`${placeholder} bắt đầu`}
        value={value[0]}
        type={type}
        onChange={(date: any) => onChangeDate(date, true)}
        format={format}
        size={size}
        disabledDate={(current: any) => {
          return value[1]
            ? moment(value[1]) <= moment(current).add(-1, 'months')
            : false;
        }}
      />{' '}
      <span className="mt-2">~</span>
      <DatePicker
        placeholder={`${placeholder} kết thúc`}
        defaultValue={getInitData()}
        value={value[1]}
        type={type}
        onChange={(date: any) => onChangeDate(date, false)}
        disabledDate={(current: any) => {
          return value[0] ? moment(value[0]).add(-1, 'days') >= current : false;
        }}
        format={format}
        size={size}
      />
    </div>
  );
});
CustomMonthRangePicker.displayName = 'CustomMonthRangePicker';
