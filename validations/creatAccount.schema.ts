import yup from "./yupGlobal";
const phoneRegExp = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b|(02[0-9]{1,2})+([0-9]{8})\b/;
// SĐT VN khớp backend identity AccountManagerValidator (StringHelper.isVietnamesePhoneNumber)
const vnPhoneRegExp = /^0[35789]\d{8}$/;
const vnPhoneMsg = "Số điện thoại không hợp lệ (định dạng VN: 0 và [3,5,7,8,9] rồi 8 chữ số)";
export const CreateAccount = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không hợp lệ")
    .typeError("Email không hợp lệ")
    .nullable()
    .trim(),
  phone: yup.string().trim().required("Vui lòng nhập số điện thoại").matches(vnPhoneRegExp, vnPhoneMsg),
  // fullName: yup.string().trim().required('Vui lòng nhập họ và tên').nullable(),
  username: yup.string().trim().required("Vui lòng nhập tên đăng nhập nhân viên").nullable(),
  role: yup.mixed().required("Vui lòng chọn quyền").nullable(),
  password: yup
    .string()
    .nullable()
    .when("passwordType", (val, schema) => {
      if (val === 1) {
        return yup
          .string()
          .nullable()
          .required("Vui lòng nhập mật khẩu")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Mật khẩu phải gồm ít nhất 10 ký tự trong đó phải bao gồm cả chữ viết thường, chữ viết hoa, chữ cái số và ký tự đặc biệt",
          )
          .min(8, "Mật khẩu phải có ít nhất 10 ký tự");
      } else {
        return yup.string().nullable().notRequired();
      }
    }),
  reWritePassword: yup
    .string()
    .nullable()
    .when("passwordType", (val, schema) => {
      if (val === 1) {
        return yup.string().nullable().required("Vui lòng nhập lại mật khẩu");
      } else {
        return yup.string().nullable().notRequired();
      }
    })
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp"),
  // code: yup.string().trim().required('Vui lòng nhập mã nhân viên'),
});

export const CreateHRAdminAccount = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không hợp lệ")
    .typeError("Email không hợp lệ")
    .nullable()
    .trim(),
  phone: yup.string().trim().required("Vui lòng nhập số điện thoại").matches(vnPhoneRegExp, vnPhoneMsg),
  // fullName: yup.string().trim().required('Vui lòng nhập họ và tên').nullable(),
  username: yup.string().trim().required("Vui lòng nhập tên đăng nhập nhân viên").nullable(),
  companyIds: yup.array().required("Vui lòng chọn doanh nghiệp").nullable(),
  eligibleCompaniesSwitch: yup.boolean(),
  eligibleCompanies: yup
    .array()
    .when("eligibleCompaniesSwitch", (val, schema) => {
      if (val === true) {
        return yup
          .array()
          .min(1, "Vui lòng chọn doanh nghiệp đối soát")
          .required("Vui lòng chọn doanh nghiệp đối soát")
          .typeError("Vui lòng chọn doanh nghiệp đối soát");
      } else {
        return yup.array().nullable().notRequired();
      }
    })
    .nullable(),
  password: yup
    .string()
    .nullable()
    .when("passwordType", (val, schema) => {
      if (val === 1) {
        return yup
          .string()
          .nullable()
          .required("Vui lòng nhập mật khẩu")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,})/,
            "Mật khẩu phải gồm ít nhất 10 ký tự trong đó phải bao gồm cả chữ viết thường, chữ viết hoa, chữ cái số và ký tự đặc biệt",
          )
          .min(10, "Mật khẩu phải có ít nhất 10 ký tự");
      } else {
        return yup.string().nullable().notRequired();
      }
    }),
  reWritePassword: yup
    .string()
    .nullable()
    .when("passwordType", (val, schema) => {
      if (val === 1) {
        return yup.string().nullable().required("Vui lòng nhập lại mật khẩu");
      } else {
        return yup.string().nullable().notRequired();
      }
    })
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp"),
  // code: yup.string().trim().required('Vui lòng nhập mã nhân viên'),
});
export const EditHRAdminAccount = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không hợp lệ")
    .typeError("Email không hợp lệ")
    .nullable()
    .trim(),
  // phone: yup.string().trim().required("Vui lòng nhập số điện thoại").matches(vnPhoneRegExp, vnPhoneMsg),
  // fullName: yup.string().trim().required('Vui lòng nhập họ và tên').nullable(),
  username: yup.string().trim().required("Vui lòng nhập tên đăng nhập nhân viên").nullable(),
  companyIds: yup.array().min(1, "Vui lòng chọn doanh nghiệp").required("Vui lòng chọn doanh nghiệp").nullable(),
  eligibleCompaniesSwitch: yup.boolean(),
  eligibleCompanies: yup
    .array()
    .when("eligibleCompaniesSwitch", (val, schema) => {
      if (val === true) {
        return yup
          .array()
          .min(1, "Vui lòng chọn doanh nghiệp đối soát")
          .required("Vui lòng chọn doanh nghiệp đối soát")
          .typeError("Vui lòng chọn doanh nghiệp đối soát");
      } else {
        return yup.array().nullable().notRequired();
      }
    })
    .nullable(),
});
export const EditAccount = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không hợp lệ")
    .typeError("Email không hợp lệ")
    .nullable()
    .trim(),
  // phone: yup.string().trim().required("Vui lòng nhập số điện thoại").matches(vnPhoneRegExp, vnPhoneMsg),
  // fullName: yup.string().trim().required('Vui lòng nhập họ và tên').nullable(),
  username: yup.string().trim().required("Vui lòng nhập tên đăng nhập nhân viên").nullable(),
  // code: yup.string().trim().required('Vui lòng nhập mã nhân viên'),
});
export const CreateUserAccount = yup.object({
  email: yup.string().email("Email không hợp lệ").notRequired().typeError("Email không hợp lệ").trim(),
  // phoneNumber: yup.string().required('Vui lòng nhập số điện thoại'),
  // fullName: yup.string().trim().required('Vui lòng nhập họ và tên').nullable(),
  username: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên đăng nhập là số điện thoại")
    .matches(phoneRegExp, "Tên đăng nhập không hợp lệ"),
  // password: yup
  //   .string()
  //   .transform((value, originalValue) => (originalValue.trim() === '' ? null : value)) // convert empty string to null
  //   .nullable(true) // allow null values
  //   .test('password-length', 'Mật khẩu phải có ít nhất 6 số', function (value) {
  //     // only validate non-null values
  //     if (value !== undefined && typeof value === 'string') {
  //       return value?.length >= 6;
  //     }
  //     return true; // null values are always valid
  //   })
  //   .matches(/^\d+$/, 'Vui lòng chỉ nhập số'),
  // reWritePassword: yup.string().when('password', (val, schema) => {
  //   if (val?.length > 0) {
  //     return yup
  //       .string()
  //       .nullable()
  //       .required('Vui lòng nhập lại mật khẩu')
  //       .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp');
  //   } else {
  //     return yup.string().nullable().notRequired();
  //   }
  // }),
  password: yup
    .string()
    .nullable()
    .when("passwordType", (val, schema) => {
      if (val === 1) {
        return yup
          .string()
          .nullable()
          .required("Vui lòng nhập mật khẩu")
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
          .matches(/^\d+$/, "Vui lòng chỉ nhập số");
      } else {
        return yup.string().nullable().notRequired();
      }
    }),
  reWritePassword: yup
    .string()
    .nullable()
    .when("passwordType", (val, schema) => {
      if (val === 1) {
        return yup
          .string()
          .nullable()
          .required("Vui lòng nhập lại mật khẩu")
          .oneOf([yup.ref("password"), null], "Mật khẩu không khớp");
      } else {
        return yup.string().nullable().notRequired();
      }
    }),
  // code: yup.string().trim().required('Vui lòng nhập mã nhân viên'),
});

export const CreatePassword = yup.object({
  password: yup
    .string()
    .nullable()
    .when("passwordType", (val, schema) => {
      if (val === 1) {
        return yup
          .string()
          .nullable()
          .required("Vui lòng nhập mật khẩu")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Mật khẩu phải gồm ít nhất 10 ký tự trong đó phải bao gồm cả chữ viết thường, chữ viết hoa, chữ cái số và ký tự đặc biệt",
          )
          .min(8, "Mật khẩu phải có ít nhất 10 ký tự");
      } else {
        return yup.string().nullable().notRequired();
      }
    }),
  reWritePassword: yup
    .string()
    .nullable()
    .when("passwordType", (val, schema) => {
      if (val === 1) {
        return yup.string().nullable().required("Vui lòng nhập lại mật khẩu");
      } else {
        return yup.string().nullable().notRequired();
      }
    })
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp"),
  // code: yup.string().trim().required('Vui lòng nhập mã nhân viên'),
});

export const CreateUserPassword = yup.object({
  password: yup
    .string()
    .transform((value, originalValue) => (originalValue.trim() === "" ? null : value)) // convert empty string to null
    .nullable(true) // allow null values
    .test("password-length", "Mật khẩu phải có ít nhất 6 số", function (value) {
      // only validate non-null values
      if (value !== undefined && typeof value === "string") {
        return value?.length >= 6;
      }
      return true; // null values are always valid
    })
    .matches(/^\d+$/, "Vui lòng chỉ nhập số"),
  reWritePassword: yup.string().when("password", (val, schema) => {
    if (val?.length > 0) {
      return yup
        .string()
        .nullable()
        .required("Vui lòng nhập lại mật khẩu")
        .oneOf([yup.ref("password"), null], "Mật khẩu không khớp");
    } else {
      return yup.string().nullable().notRequired();
    }
  }),
});
