export const ObjectHelper = {
  getParamsFilter(data: any) {
    const obj = {
      ...data,
    };

    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    });
    const params = new URLSearchParams(obj).toString();
    return params;
  },

  getParamsFilterExceptFields(data: any, exArr: any[]) {
    const obj = {
      ...data,
    };

    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === undefined || exArr.includes(key)) {
        delete obj[key];
      }
    });
    const params = new URLSearchParams(obj).toString();
    return params;
  },
  isObjectEmpty(objectName: object) {
    return Object.keys(objectName).length === 0;
  },
  handleMessage(object: object, field: any) {
    if (!object[field as keyof typeof object]) return field;
    return object[field as keyof typeof object];
  },
};
