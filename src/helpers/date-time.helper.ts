import { COMMON_FORMAT, TIMEZONE_FORMAT } from '@constants/common-format';
import moment from 'moment-timezone';

export const DateTimeHelper = {
  formatDateTime: (
    date: any,
    formatType: COMMON_FORMAT = COMMON_FORMAT.TIME_DATE
  ) => {
    if (!date) return '';
    return moment(new Date(date)).format(formatType);
  },
  timeCompare: (a: any, b: any) => {
    let _ATime = moment.utc(a).valueOf();
    let _BTime = moment.utc(b).valueOf();

    var diff = _ATime - _BTime;

    if (diff == 0) return diff;
    if (diff < 0) return -1;
    if (diff > 0) return 1;
  },

  //Compare fromDate > toDate

  isAfter: (fromDate: any, toDate: any = new Date(), typeCompare: any) => {
    return moment(
      DateTimeHelper.formatDateTime(
        fromDate,
        COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
      )
    ).isAfter(
      DateTimeHelper.formatDateTime(
        toDate,
        COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
      ),
      typeCompare
    );
  },

  //Compare fromDate < toDate

  isBefore: (fromDate: any, toDate: any = new Date(), typeCompare: any) => {
    return moment(
      DateTimeHelper.formatDateTime(
        fromDate,
        COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
      )
    ).isBefore(
      DateTimeHelper.formatDateTime(
        toDate,
        COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
      ),
      typeCompare
    );
  },

  convertTimeZone: (
    date: any,
    formatType: COMMON_FORMAT = COMMON_FORMAT.TIME_DATE,
    gmtFormat: string = TIMEZONE_FORMAT.GMT0
  ) => {
    if (!date) return '';
    const convertDate = DateTimeHelper.formatDateTime(
      date,
      COMMON_FORMAT.DATE_TIMEZONE
    );
    return moment
      .tz(convertDate, gmtFormat)
      .tz(moment.tz.guess())
      .format(formatType);
  },

  setEndTime: (date: any, gmtFormat: string = TIMEZONE_FORMAT.GMT0) => {
    let endTime = moment(date).tz(gmtFormat);
    return endTime.set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
  },
  setStartTime: (date: any, gmtFormat: string = TIMEZONE_FORMAT.GMT0) => {
    let startTime = moment(date).tz(gmtFormat);
    return startTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  },

  getCurrentTime: (type: string = 'fullTimeString', padStart: any = 2) => {
    let today = new Date();
    let HH = String(today.getHours()).padStart(padStart, '0');
    let mm = String(today.getMinutes()).padStart(padStart, '0');
    let dd = String(today.getDate()).padStart(padStart, '0');
    let MM = String(today.getMonth() + 1).padStart(padStart, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let currentTime = yyyy + '-' + MM + '-' + dd + 'T' + HH + ':' + mm + ':00';

    let timeRange: any = {
      hour: HH,
      minute: mm,
      day: dd,
      month: MM,
      year: yyyy,
    };
    if (type == 'fullTimeString') {
      return currentTime;
    } else if (type == 'fullTimeObject') {
      return timeRange;
    }
  },

  getCurrentDate: (type: string = 'fullDateString', padStart: any = 2) => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(padStart, '0');
    let mm = String(today.getMonth() + 1).padStart(padStart, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let currentDate = yyyy + '/' + mm + '/' + dd;

    let dateRange: any = {
      day: dd,
      month: mm,
      year: yyyy,
    };
    if (type == 'fullDateString') {
      return currentDate;
    } else if (type == 'fullDateObject') {
      return dateRange;
    }
  },
  getStartandEndMonth: () => {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );
    return { startOfMonth, endOfMonth };
  },
  //add number of days to date ex: 14/01/2023 + 1 = 15/01/2023
  addDays: (date: any, days: any) => {
    if (date) {
      let result = new Date(date);
      result.setDate(result.getDate() + days);
      return new Date(result);
    }
  },

  addMonth: (date: any, months: any) => {
    date.setMonth(date.getMonth() + months);
    return date;
  },

  checkMonthRange: (type: any) => {
    return {
      type: type == 0 ? 'monthRange' : 'dateRange',
      format: type == 0 ? 'MM/yyyy' : 'dd/MM/yyyy',
    };
  },
  disabledPastDatePicker: (currentDate: any, addDate: any, type: any) => {
    return moment().add(addDate, type) >= currentDate;
  },
  disabledFutureDatePicker: (currentDate: any, addDate: any, type: any) => {
    return moment().add(addDate, type) <= currentDate;
  },

  fomartDateRangeSubmit: (date: any, timeZone: any = TIMEZONE_FORMAT.GMT0) => {
    return date ? moment(date).tz(timeZone).format() : '';
  },

  hideCurrentPeriod: (
    startDate: any,
    endDate: any,
    hasCurrentPeriod: boolean,
    companyId: any
  ) => {
    const curentDate = new Date();
    const endDateAddDay = new Date(endDate);
    const exceptCompanyIdArr = [
      'e8c16d90-3c72-4f3f-804a-666212dd86bc',
      'a059dfdf-4489-4bc7-a691-d563f0a38f02',
      '723e2673-de1f-4103-96d0-0a94b9057b6c',
      '56d01a72-938f-4577-b1ba-bc2ff5248322',
    ];
    const exceptCompanyId = exceptCompanyIdArr.includes(companyId);
    endDateAddDay.setDate(endDateAddDay.getDate() + 1);
    if (!hasCurrentPeriod && !exceptCompanyId) {
      if (
        !(
          curentDate > new Date(startDate) &&
          curentDate < new Date(endDateAddDay)
        )
      ) {
        return {
          label: `${DateTimeHelper.formatDateTime(
            startDate,
            COMMON_FORMAT.DATE
          )} - ${DateTimeHelper.formatDateTime(endDate, COMMON_FORMAT.DATE)}`,
          value: `${startDate}|${endDate}`,
        };
      }
    } else {
      return {
        label: `${DateTimeHelper.formatDateTime(
          startDate,
          COMMON_FORMAT.DATE
        )} - ${DateTimeHelper.formatDateTime(endDate, COMMON_FORMAT.DATE)}`,
        value: `${startDate}|${endDate}`,
      };
    }
  },
};
