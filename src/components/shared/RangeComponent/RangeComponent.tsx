import { IconArrowRight } from '@douyinfe/semi-icons';
import { RangeHelper } from '@helpers/range.helper';
import { StringHelper } from '@helpers/string.helper';

export const FeeValue = (type: any, value: any) => {
  return (
    <span>
      {type.type == 0 ? StringHelper.formatVND(type.value) : type.value}
    </span>
  );
};

export const FeeSuffix = (type: any) => {
  return <span>{type.type == 0 ? '' : ' %'}</span>;
};

export const RangeComponent = (props: any) => {
  const { feeRange, feeRangeType, feeValue } = props;

  return (
    <div className="w-full justify-center flex flex-col gap-4 border border-gray-200 border-solid p-2">
      {RangeHelper.getDataInRange(feeRange, feeRangeType, feeValue).map(
        (x: any, idx: any) => (
          <div className="grid grid-cols-6 items-center">
            <div>{StringHelper.formatVND(x.from)}</div>
            <IconArrowRight size="small" />
            <div>{RangeHelper.checkInfinityRange(x.to)}</div>
            <div>=</div>
            <div>
              <FeeValue type={x.feeType} value={x.feeValue} />
              <FeeSuffix type={x.feeType} />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export const WithoutFeeValue = (props: any) => {
  const { feeRange, feeRangeType, feeValue } = props;

  return (
    <div className="w-full justify-center flex flex-col gap-4 border border-gray-200 border-solid p-2">
      {RangeHelper.getDataInRange(feeRange, feeRangeType, feeValue).map(
        (x: any, idx: any) => (
          <div className="grid grid-cols-6 items-center">
            <div>{StringHelper.formatVND(x.from)}</div>
            <IconArrowRight size="small" />
            <div>{RangeHelper.checkInfinityRange(x.to)}</div>
          </div>
        )
      )}
    </div>
  );
};

export const WithoutRange = (props: any) => {
  const { feeRange, feeRangeType, feeValue } = props;
  return (
    <div className="w-full justify-center flex flex-col gap-4 border border-gray-200 border-solid p-2">
      {RangeHelper.getDataInRange(feeRange, feeRangeType, feeValue).map(
        (x: any, idx: any) => {
          return (
            <div className="grid grid-cols-6 items-center">
              <div>
                <FeeValue type={x.feeType} value={x.feeValue} />
                <FeeSuffix type={x.feeType} />
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};
