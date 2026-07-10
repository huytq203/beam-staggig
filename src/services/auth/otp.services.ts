import { GlobalResponseMessageCodes } from '../api/handlers';

export type OtpPurpose = 'login' | 'reset-password';

export interface SendOtpResult {
  maskedDestination: string;
}

export interface VerifyOtpParams {
  identifier: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface VerifyOtpResult {
  userId?: string;
  reset_token?: string;
}

// TODO: thay bằng gọi axiosInstance tới API thật khi backend có endpoint OTP
// (vd: POST /account/otp/send, POST /account/otp/verify). Giữ nguyên
// signature và shape response của 2 hàm dưới đây để LoginForm/ForgotPasswordForm
// không cần sửa khi swap sang API thật.
const MOCK_NETWORK_DELAY_MS = 800;
const MOCK_VALID_OTP = '123456';

function maskIdentifier(identifier: string): string {
  const visible = identifier.slice(-2);
  const hiddenLength = Math.max(identifier.length - 2, 3);
  return `${'*'.repeat(hiddenLength)}${visible}`;
}

export class OtpServices {
  static sendOtp(identifier: string): Promise<SendOtpResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ maskedDestination: maskIdentifier(identifier) });
      }, MOCK_NETWORK_DELAY_MS);
    });
  }

  static verifyOtp(params: VerifyOtpParams): Promise<VerifyOtpResult> {
    const { identifier, otp, purpose } = params;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp !== MOCK_VALID_OTP) {
          reject(new Error(GlobalResponseMessageCodes.OTP_INVALID));
          return;
        }
        if (purpose === 'reset-password') {
          resolve({
            userId: identifier,
            reset_token: `mock-reset-token-${identifier}`,
          });
          return;
        }
        resolve({});
      }, MOCK_NETWORK_DELAY_MS);
    });
  }
}
