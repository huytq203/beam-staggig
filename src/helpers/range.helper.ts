import { StringHelper } from './string.helper';

export const RangeHelper = {
  getDataInRange: (feeRange: [], feeRangeType: [], feeValue: []) => {
    const rangeSize = feeRange.length;
    if (!rangeSize || rangeSize < 2) return [];
    let result = [];
    for (var i = 1; i < rangeSize + 1; i++) {
      result.push({
        from: feeRange[i - 1],
        to: feeRange[i],
        feeType: feeRangeType[i - 1],
        feeValue: feeValue[i - 1],
      });
    }
    return result;
  },

  checkInfinityRange: (end: any) => {
    return Number.isNaN(end) || end === undefined
      ? 'Không giới hạn'
      : StringHelper.formatVND(end - 1);
  },
};
