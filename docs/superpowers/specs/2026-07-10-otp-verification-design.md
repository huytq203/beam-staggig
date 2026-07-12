# OTP Verification — Design Spec

Date: 2026-07-10

## Mục tiêu

Xây dựng màn hình / component xác thực OTP dùng chung cho hai luồng:

1. Xác thực 2 lớp (2FA) ngay sau khi đăng nhập thành công bằng tài khoản/mật khẩu.
2. Luồng quên mật khẩu — thay thế hoàn toàn cơ chế gửi link reset qua email hiện tại bằng xác thực OTP, sau đó cho phép đặt mật khẩu mới trực tiếp.

Backend hiện **chưa có API gửi/xác thực OTP**. Trước mắt sẽ mock ở tầng service, nhưng cấu trúc code phải cho phép thay mock bằng API thật sau này mà không cần sửa component hay các form gọi nó.

## Kiến trúc & vị trí file

- `src/modules/auth/components/VerifyOTP.tsx` — component **thuần trình bày** (presentational). Chỉ nhận props và callback, không tự gọi API, không biết logic nghiệp vụ của luồng gọi nó. Nhờ vậy dùng lại được cho cả 2FA lẫn quên mật khẩu (và các luồng OTP khác trong tương lai nếu có).
- `src/services/auth/otp.services.ts` (mới) — `OtpServices.sendOtp()` / `OtpServices.verifyOtp()`. Hiện triển khai bằng mock (`setTimeout` giả lập độ trễ mạng), có comment `// TODO: thay bằng API thật khi backend sẵn sàng`, và giữ đúng shape response dự kiến (`{ maskedDestination }` cho sendOtp, `{ userId, reset_token }` cho verifyOtp khi dùng trong luồng reset) để việc swap sang API thật sau này không cần đổi interface.
- `LoginForm.tsx` và `ForgotPasswordForm.tsx`: mỗi form tự thêm state bước cục bộ (`step: 'credentials' | 'otp'` hoặc tương đương), tự gọi `OtpServices`, và truyền `onVerify` / `onResend` xuống `VerifyOTP`. `AuthenticationProvider` và `ResetForm` giữ nguyên, không sửa đổi.

## Component `VerifyOTP`

Props:

```ts
interface VerifyOTPProps {
  maskedDestination: string;       // vd: "090***78" — hiển thị "Mã đã gửi tới 090***78"
  length?: number;                 // default 6
  resendCooldownSeconds?: number;  // default 60
  onVerify: (otp: string) => Promise<void>;  // reject với Error(message) nếu sai/hết hạn
  onResend: () => Promise<void>;
  onBack?: () => void;             // "Quay lại" — đổi tài khoản/số khác
}
```

Hành vi:

- 6 ô nhập số riêng biệt (mặc định), tự nhảy sang ô kế khi gõ, Backspace lùi về ô trước, hỗ trợ paste toàn bộ mã cùng lúc.
- Tự động gọi `onVerify` khi nhập đủ số ô quy định (không bắt buộc bấm nút), đồng thời vẫn có nút "Xác nhận" với trạng thái loading khi đang chờ `onVerify` resolve.
- Đếm ngược hiển thị "Gửi lại mã sau Ns"; khi về 0, đổi thành link "Gửi lại mã" gọi `onResend` rồi reset lại đếm ngược.
- Dựng trên `AuthCard` để đồng bộ giao diện với `LoginForm`, `ForgotPasswordForm`.

## Luồng dữ liệu

### 2FA sau đăng nhập (`LoginForm`)

1. Người dùng submit tài khoản/mật khẩu → `executeRecaptcha` như hiện tại (không đổi).
2. Thay vì gọi `signIn` ngay, gọi `OtpServices.sendOtp(username)` → nhận `maskedDestination` → chuyển `step` sang `'otp'`, render `VerifyOTP`.
3. `VerifyOTP.onVerify(otp)` gọi `OtpServices.verifyOtp({ identifier: username, otp, purpose: 'login' })`.
4. Nếu thành công: gọi `signIn('credential', { username, password, callbackUrl, recaptchaToken })` — đúng như code hiện tại — để `AuthenticationProvider` set cookie và redirect. `AuthenticationProvider.signIn` không đổi.
5. Nếu thất bại: `VerifyOTP` tự hiển thị lỗi, không rời màn OTP.
6. `onBack` đưa người dùng quay lại form nhập tài khoản/mật khẩu (reset `step` về `'credentials'`).

### Quên mật khẩu (`ForgotPasswordForm`)

1. Người dùng nhập tài khoản → thay vì gọi `AuthServices.resetPassword(username)` (gửi email) như hiện tại, gọi `OtpServices.sendOtp(username)` → chuyển sang `step: 'otp'`.
2. `VerifyOTP.onVerify(otp)` gọi `OtpServices.verifyOtp({ identifier: username, otp, purpose: 'reset-password' })`, mock trả về `{ userId, reset_token }` (đánh dấu rõ là dữ liệu giả).
3. Xác thực thành công → render `ResetForm` với `verifyResponse={{ userId, reset_token }}` — tái sử dụng nguyên vẹn `ResetForm` hiện có (không sửa file này).
4. Cơ chế gửi link email cũ (`AuthServices.resetPassword`) được thay thế hoàn toàn trong luồng UI này; hàm cũ trong `AuthServices` vẫn giữ nguyên trong code (không xoá) vì có thể còn dùng ở nơi khác — chỉ ngừng gọi từ `ForgotPasswordForm`.

## Lỗi & edge case

- Sai OTP hoặc hết hạn: `VerifyOTP` hiện text đỏ dưới các ô nhập, xoá toàn bộ input, focus lại ô đầu tiên.
- Bấm "Gửi lại mã" khi đang trong thời gian đếm ngược: không thể bấm được (disabled), không gọi `onResend`.
- Thêm 3 mã lỗi mới vào `GlobalResponseMessageCodes` trong `src/services/api/handlers.ts`, theo đúng pattern hiện có của enum này: `OTP_INVALID`, `OTP_EXPIRED`, `OTP_MAX_ATTEMPTS_EXCEEDED`. Mock service dùng trực tiếp các message này; khi nối API thật chỉ cần map response code sang enum có sẵn.

## Ngoài phạm vi (out of scope)

- Không sửa `AuthenticationProvider.signIn` hay cơ chế cookie/token hiện tại.
- Không sửa `ResetForm` — chỉ tái sử dụng nguyên trạng.
- Không xoá `AuthServices.resetPassword` — chỉ ngừng gọi nó từ `ForgotPasswordForm`.
- Không xây API thật ở backend — chỉ mock ở tầng FE, có TODO rõ ràng để nối sau.

## Kiểm thử

Dự án hiện không có test runner (không có jest/vitest trong `package.json`). Xác minh bằng cách chạy dev server và thao tác trực tiếp trên trình duyệt:

- Nhập sai mã OTP → thấy lỗi, input bị xoá.
- Đợi hết đếm ngược → nút "Gửi lại mã" khả dụng, bấm gửi lại → đếm ngược reset.
- Nhập đúng mã ở luồng 2FA → tự động hoàn tất đăng nhập, redirect vào dashboard.
- Nhập đúng mã ở luồng quên mật khẩu → chuyển sang `ResetForm`, đặt mật khẩu mới thành công.
- Bấm "Quay lại" ở cả hai luồng → quay về đúng bước trước đó.
