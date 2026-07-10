import { Notification } from '@douyinfe/semi-ui';
import moment from 'moment';
import { StringHelper } from './string.helper';
// import { useRouter } from 'next/router';
export const FunctionBase = {
  sortByField: (arr: any, propertyField: string) => {
    let sortedArr = [...arr];
    return sortedArr.sort((a: any, b: any) =>
      a[propertyField].toString().localeCompare(b[propertyField], 'es', {
        sensitivity: 'base',
        numeric: true,
      })
    );
  },
  /**
   * Add a leading zero to a number
   * @param num numnber value want to leading
   * @param totalLength total length of string you want
   * @returns string
   */
  addLeadingZeros: function (num: number, totalLength: number) {
    return String(num).padStart(totalLength, '0');
  },
  getSelectOptionsFromListObject: (
    arr: any[],
    keyValue: string = 'id',
    labelValue: string = 'name'
  ) => {
    if (!arr) return [];
    return arr.map((x: any) => {
      return { value: x[keyValue], label: x[labelValue] };
    });
  },

  removeUndefinedObjectProperty: (data: any) => {
    const obj = { ...data };
    Object.keys(obj).forEach(function (key) {
      if (typeof obj[key] === 'undefined') {
        delete obj[key];
      }
    });
    return obj;
  },

  checkTypeofVal(val: any, type: string) {
    return typeof val === type;
  },
  hrefBlank(url: any) {
    let currentHostname: any;
    let currentProtocol: any;
    if (typeof window !== 'undefined') {
      currentHostname = window.location.hostname;
      currentProtocol = window.location.protocol;
    }
    let a = document.createElement('a');
    a.target = '_blank';
    a.href = `${currentProtocol}//${currentHostname}/${url}`;
    a.click();
  },
  customSelectFilterOption(sugInput: any, option: any) {
    let label = StringHelper.removeVietnameseTones(option.label).toUpperCase();
    let sug = StringHelper.removeVietnameseTones(sugInput).toUpperCase().trim();
    return label.includes(sug);
  },
  // checkInvalidData: async (data: any, isLoading: any) => {
  //   const router = useRouter();
  //   if (!data && !isLoading) return router.push('/404');
  // },

  formNotification(data: any) {
    if (data.response?.code === 200 && data.response?.message === 'OK') {
      Notification.success({
        title: 'Thành công',
        content: `${data.content} thành công`,
        theme: 'light',
      });
      data.loading;
      data.cancel();
      // data?.refetch();
    } else {
      Notification.error({
        title: 'Thất bại',
        content: `${data.content} thất bại!`,
        duration: 3,
        theme: 'light',
      });
      data.loading;
    }
  },

  CheckInvalidDate(dateString: any) {
    return moment(dateString).isValid();
  },

  getFieldProperty(fieldName: any, commonFields: any) {
    const fieldValue = commonFields.find((x: any) => x.field == fieldName);
    if (!fieldValue)
      return {
        field: fieldName,
        text: fieldName,
      };
    return fieldValue;
  },

  getDataProperty(fieldName: any, commonFields: any, data: any) {
    const fieldValue = commonFields.find((x: any) => x.field == fieldName);
    if (fieldValue?.hasOwnProperty('convertData')) {
      return {
        convertData: fieldValue?.convertData,
      };
    }
    return {
      convertData: (value: any) => value,
    };
  },

  scrollToErrorField: (errors: any, setFocus: any) => {
    const firstError = Object.keys(errors)[0];
    setFocus(firstError as any);

    // Scroll đến element có error
    const errorElement = document.getElementsByName(firstError)[0];
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
};
