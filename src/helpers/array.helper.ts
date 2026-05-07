import { COMMON_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from './date-time.helper';
export const ArrayHelper = {
  convertStringNumberToArray(value: any) {
    return Array.from(String(value), Number);
  },

  removeEmlementNullOrUndefine(arr: any) {
    if (!Array.isArray(arr)) return [];
    const results = arr?.filter((element: any) => {
      return element !== null && element !== undefined;
    });
    return results;
  },

  convertDateFromArray(
    arr: any,
    fomartType: COMMON_FORMAT = COMMON_FORMAT.DATE
  ) {
    if (Array.isArray(arr) && arr.length < 6) {
      let hour;
      let minutes;
      if (arr[3]) {
        hour = arr[3];
        if (hour < 10) {
          hour = `0${hour}`;
        }
      }
      if (arr[4]) {
        minutes = arr[4];
        if (minutes < 10) {
          minutes = `0${minutes}`;
        }
      }
      let day = arr[2];
      if (day < 10) {
        day = `0${day}`;
      }
      let month = arr[1];
      if (month < 10) {
        month = `0${month}`;
      }
      const year = arr[0];

      const convertDate = arr[4]
        ? `${year}-${month}-${day}T${hour}:${minutes}:00`
        : !arr[4] && arr[3]
        ? `${year}-${month}-${day}T${hour}:00:00`
        : `${year}-${month}-${day}`;

      return DateTimeHelper.convertTimeZone(convertDate, fomartType);
    } else if (Array.isArray(arr) && arr.length >= 6) {
      let second = arr[5];
      if (second < 10) {
        second = `0${second}`;
      }
      let minutes = arr[4];
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      let hour = arr[3];
      if (hour < 10) {
        hour = `0${hour}`;
      }
      let day = arr[2];
      if (day < 10) {
        day = `0${day}`;
      }
      let month = arr[1];
      if (month < 10) {
        month = `0${month}`;
      }
      const year = arr[0];

      const convertDate = `${year}-${month}-${day}T${hour}:${minutes}:${second}`;
      return DateTimeHelper.convertTimeZone(convertDate, fomartType);
    }
    return arr;
  },
  convertEmptyArrayToNull: (arr: any) => {
    if (!arr || arr.length < 1) return null;
    return arr;
  },
  //Kiểm tra object có trong array object không
  shallowEqualityCheck: (obj1: any, obj2: any) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  },
  checkArrayElements(
    sourceArray: any[],
    checkArray: any[],
    idKey: string = 'id'
  ) {
    const sourceIds = new Set(sourceArray);
    const commonItems = checkArray.filter((item) =>
      sourceIds.has(item[idKey] || item)
    );
    return {
      hasCommon: commonItems.length > 0,
      commonItems,
      isSubset: commonItems.length === checkArray.length,
      invalidItems: checkArray.filter(
        (item) => !sourceIds.has(item[idKey] || item)
      ),
    };
  },
  compareArray(arr1: any[], arr2: any[] = []) {
    if (
      arr1.length === arr2.length &&
      arr1.every((el, index) => el === arr2[index])
    ) {
      return true;
    } else {
      return false;
    }
  },
};
