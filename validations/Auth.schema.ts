import yup from './yupGlobal';

export const ResetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu.')
    .min(10, 'Mật khẩu phải chứ ít nhất 10 ký tự.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,})/,
      'Mật khẩu phải gồm ít nhất 10 ký tự trong đó phải bao gồm cả chữ viết thường, chữ viết hoa, chữ cái số và ký tự đặc biệt'
    )
    .typeError('Vui lòng nhập mật khẩu.'),
  confirmPassword: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
    .typeError('Mật khẩu không khớp'),
});

export const ChangePasswordSchema = yup.object({
  oldPassword: yup
    .string()
    .trim()
    .required('Vui lòng nhập mật khẩu cũ')
    .typeError('Vui lòng nhập mật khẩu cũ'),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu.')
    .min(10, 'Mật khẩu phải chứ ít nhất 10 ký tự.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,})/,
      'Mật khẩu phải gồm ít nhất 10 ký tự trong đó phải bao gồm cả chữ viết thường, chữ viết hoa, chữ cái số và ký tự đặc biệt'
    )
    .typeError('Vui lòng nhập mật khẩu.'),
  confirmPassword: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu không khớp')
    .typeError('Mật khẩu không khớp'),
});

export const ForgotPasswordSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required('Vui lòng nhập tên đăng nhập')
    .typeError('Vui lòng nhập tên đăng nhập'),
  // .min(5, 'Username be 5 chars minimum.'),
});
export const LoginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required('Vui lòng nhập tên đăng nhập')
    .typeError('Vui lòng nhập tên đăng nhập'),
  password: yup
    .string()
    .trim()
    .required('Vui lòng nhập mật khẩu')
    .typeError('Vui lòng nhập mật khẩu'),
});
