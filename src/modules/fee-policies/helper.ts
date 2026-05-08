import { COMMON_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { v4 as uuidv4 } from 'uuid';

export const getRangeList = (rangeList: any) => {
  let result = [];

  if (!rangeList?.feeRange) return [];

  const rangeSize = rangeList?.feeRange.length;
  if (!rangeSize) return [];
  for (var i = 1; i < rangeSize + 1; i++) {
    result.push({
      uuid: uuidv4(),
      from: rangeList?.feeRange[i - 1],
      feeType: rangeList?.feeRangeType[i - 1],
      fee: rangeList?.feeValue[i - 1],
    });
  }
  return result;
};

export const getDateList = (dateList: any) => {
  let result = [];

  if (!dateList?.contractExpiredDates) return [];

  const rangeSize = dateList?.contractExpiredDates.length;
  if (!rangeSize) return [];
  for (var i = 0; i < rangeSize; i++) {
    result.push({
      date: DateTimeHelper.convertTimeZone(
        dateList?.contractExpiredDates[i],
        COMMON_FORMAT.EMPTY_FORMAT
      ),
    });
  }
  return result;
};
