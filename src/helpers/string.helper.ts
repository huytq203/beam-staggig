export const StringHelper = {
  zeroPad(num: any, size: any = 2) {
    num = num.toString();
    while (num.length < size) num = '0' + num;
    return num;
  },
  formatVND(money: number, defaultValue: any = '') {
    const formated = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(money);
    return typeof money !== 'number' || !money ? defaultValue : formated;
  },
  formatVNDWithZeroNumber(money: number, defaultValue: any = 0) {
    const formated = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(money);
    return typeof money !== 'number' || !money ? defaultValue : formated;
  },
  formatValueByPayType(value: any, type: number) {
    if (type == 0 || value == null) {
      return '-';
    }
    return value + '%';
  },
  getStringFromSelect(value: any) {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    return value;
  },
  convertArrToNumber(value: any) {
    value?.map(function (x: any) {
      return parseInt(x, 10);
    });
  },

  removeVietnameseTones(str: any) {
    if (!str) return '';
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|{|}|\||\\/g,
      ' '
    );
    return str;
  },

  indexTable(filter: any, index: any) {
    return (filter - 1) * 10 + index + 1;
  },
  convertPhoneNumber(str: any) {
    const checknumber = str.slice(0, 3);
    if (checknumber.includes('+84')) {
      let a = str.substring(3);
      return `0${a}`;
    } else if (checknumber.startsWith('84')) {
      let a = str.substring(2);
      return `0${a}`;
    } else {
      return str;
    }
  },

  convertStringToArray(str: any, separator: string = '') {
    if (typeof str !== 'string' && str.length <= 0) return [];
    return str.split(separator);
  },
  checkCorrectType(value: any) {
    if (value !== null && value !== undefined && !Number.isNaN(value)) {
      return true;
    }
    return false;
  },

  extractNumberfromStringVoucherDiscount(input: any) {
    if (input !== null) {
      const splitInput = input.split('Tối đa');
      const match = splitInput[1].match(
        /(?:Tối đa\s+)?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/
      );
      if (match) {
        // Remove any non-digit characters and convert to number
        return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
      }
      return null;
    }
    return null; // Return null if no number is found
  },
};
