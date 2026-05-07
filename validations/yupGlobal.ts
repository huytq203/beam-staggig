import * as yup from 'yup';

const REGEX_PASSWORD = /^[A-Za-z0-9!@#$%^&*()]+$/;
const REGEX_ONLY_NUMBER = /^\d+$/;
const REGEX_ROLL_NUMBER = /^[a-zA-Z0-9]*$/;
const REGEX_PHONE_NUMBER = /^\+?(\([0-9]{1,3}\))?([0-9]{4,16})$/;
const REGEX_URL =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?%#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
const REGEX_NO_ALPHACHARACTER = /.*[A-Za-z].*/;
const REGEX_FUNCTION_NAME = /^[a-zA-Z{1}][a-zA-Z0-9_]+$/;

//Validate function name
yup.addMethod(yup.string, 'functionName', function (message) {
  return this.matches(REGEX_FUNCTION_NAME, {
    message,
    excludeEmptyString: true,
  });
});

yup.addMethod(yup.string, 'password', function (message) {
  return this.matches(REGEX_PASSWORD, {
    message,
    excludeEmptyString: true,
  });
});

yup.addMethod(yup.string, 'phoneNumber', function (message) {
  return this.matches(REGEX_PHONE_NUMBER, {
    message,
    excludeEmptyString: true,
  });
});

//Valid url website
yup.addMethod(yup.string, 'validUrl', function (message) {
  return this.matches(REGEX_URL, {
    message,
    excludeEmptyString: true,
  });
});

//Number only
yup.addMethod(yup.string, 'onlyNumber', function (message) {
  return this.matches(REGEX_ONLY_NUMBER, {
    message,
    excludeEmptyString: true,
  });
});

//Check empty object
yup.addMethod(yup.mixed, 'emptyObject', function (message) {
  return this.test({
    name: 'length',
    message: message,
    test: (value: any) => {
      const hasNoProperty = Object.keys(value).length === 0;
      if (hasNoProperty) {
        return false;
      }
      return true;
    },
  });
});

//Range number (Ex: from 1 to 10)
yup.addMethod(yup.mixed, 'inRangeNumber', function (min, max, message) {
  return this.test({
    name: 'length',
    message: message,
    test: (value: any) => {
      if (value.includes('e')) return false;
      if (parseInt(value) < min || parseInt(value) > max) {
        return false;
      } else {
        return true;
      }
    },
  });
});

//In range of a string length
yup.addMethod(
  yup.mixed,
  'inRangeString',
  function (isRequire = false, min, max, message) {
    return this.test({
      name: 'length',
      message: message,
      test: (value: any) => {
        if (isRequire) {
          if (value.length < min || value.length > max) {
            return false;
          } else {
            return true;
          }
        } else {
          if ((value.length < min || value.length > max) && value.length > 0) {
            return false;
          } else {
            return true;
          }
        }
      },
    });
  }
);

//File size validate
yup.addMethod(
  yup.mixed,
  'fileSizeMax',
  function (size = 10, message = 'File size can not exceed ' + size + 'MB') {
    return this.test({
      name: 'length',
      message: message,
      test: (file: any) => {
        let isValid = true;
        let _file = file[Object.keys(file)[0]];
        if (typeof _file != 'undefined' && _file != null) {
          isValid = _file.size <= 1024 * size * 1000;
        }
        return isValid;
      },
    });
  }
);

//File size validate
yup.addMethod(
  yup.mixed,
  'fileSizeZero',
  function (
    message = 'Uploaded file size is too small or invalid, please check again'
  ) {
    return this.test({
      name: 'length',
      message: message,
      test: (file: any) => {
        let isValid = true;
        let _file = file[Object.keys(file)[0]];
        if (typeof _file != 'undefined' && _file != null) {
          isValid = _file.size != 0;
        }
        return isValid;
      },
    });
  }
);

//File name validate
yup.addMethod(
  yup.mixed,
  'fileNameMax',
  function (
    max = 100,
    message = 'File name can not exceed ' + max + ' characters'
  ) {
    return this.test({
      name: 'length',
      message: message,
      test: (file: any) => {
        let isValid = true;
        let _file = file[Object.keys(file)[0]];
        if (typeof _file != 'undefined' && _file != null) {
          isValid = _file.name.length <= max;
        }
        return isValid;
      },
    });
  }
);

//Roll number
yup.addMethod(yup.string, 'checkRollNumber', function (message) {
  return this.matches(REGEX_ROLL_NUMBER, {
    message,
    excludeEmptyString: true,
  });
});

//Validate tags array
yup.addMethod(yup.mixed, 'validateTags', function (message) {
  return this.test({
    name: 'length',
    message: message,
    test: (arr: any) => {
      let isValid = true;
      if (arr != null) {
        if (arr.length > 0) {
          for (const item of arr) {
            if (item.length > 20) {
              isValid = false;
              break;
            }
          }
        }
      }
      return isValid;
    },
  });
});

yup.addMethod(
  yup.mixed,
  'validateTagsElementRangeLength',
  function (
    min,
    max,
    message = `Tag item must be greater than ${min} and smaller than ${max} characters`
  ) {
    return this.test({
      name: 'length',
      message: message,
      test: (arr: any) => {
        let isValid = true;
        if (arr != null) {
          if (arr.length > 0) {
            for (const item of arr) {
              if (item.trim().length < min || item.trim().length > max) {
                isValid = false;
                break;
              }
            }
          }
        }
        return isValid;
      },
    });
  }
);

yup.addMethod(yup.mixed, 'validateTotalTags', function (message) {
  return this.test({
    name: 'length',
    message: message,
    test: (arr: any) => {
      if (arr != null) {
        if (arr.length > 5) {
          return false;
        }
      }
      return true;
    },
  });
});

//Disable null
yup.addMethod(yup.mixed, 'disableNull', function (message) {
  return this.test({
    name: 'length',
    message: message,
    test: (param: any) => {
      return param ?? false;
    },
  });
});

yup.addMethod(
  yup.mixed,
  'uniqueStrings',
  function (message, mapper = (a: any) => a.trim()) {
    return this.test('uniqueStrings', message, function (list: any) {
      return list.length === new Set(list.map(mapper)).size;
    });
  }
);

yup.addMethod(
  yup.mixed,
  'applyLowerUpperFee',
  function (message = 'Cần nhập ít nhất 1 giá trị (tối đa hoặc tối thiểu)') {
    return this.test({
      name: 'length',
      message: message,
      test: function (value: any) {
        const { applyUpperFeeLimit, lowerFeeLimit, upperFeeLimit } =
          this.parent;
        if (applyUpperFeeLimit) {
          return lowerFeeLimit || upperFeeLimit;
        }
        return true;
      },
    });
  }
);

yup.addMethod(
  yup.mixed,
  'validateApplyFeeValue',
  function (message = 'Vui lòng nhập giá trị') {
    return this.test({
      name: 'length',
      message: message,
      test: function (value: any) {
        const { feeValue } = this.parent;
        // debugger;
        // for(let i = 0; i < f)
        return true;
      },
    });
  }
);

yup.addMethod(
  yup.mixed,
  'validateRangeValueRow',
  function (message = 'Vui lòng nhập giá trị') {
    return this.test({
      name: 'length',
      message: message,
      test: function (value: any) {
        const fields = ['fee', 'feeType'];
        for (const field of fields) {
          // debugger;
          if (typeof value[field] !== 'number') return false;
        }
        return true;
      },
    });
  }
);

export default yup;
