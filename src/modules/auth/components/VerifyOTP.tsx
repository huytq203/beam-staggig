import { IconArrowLeft } from '@douyinfe/semi-icons';
import { Button, Typography } from '@douyinfe/semi-ui';
import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { AuthCard } from './AuthCard';

const { Text } = Typography;

export interface VerifyOTPHandle {
  /** Focus ô nhập đầu tiên. Dùng khi màn OTP xuất hiện sau một hiệu ứng chuyển cảnh:
   *  focus lúc mount sẽ kéo container cuộn theo phần tử còn nằm ngoài khung nhìn. */
  focusFirst: () => void;
}

export interface VerifyOTPProps {
  maskedDestination: string;
  length?: number;
  resendCooldownSeconds?: number;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack?: () => void;
  /**
   * 'page'     – màn đăng nhập full trang (mặc định, giữ nguyên bố cục cũ).
   * 'embedded' – nhúng trong modal: bỏ khoảng đệm của AuthCard, hàng nút nằm ngang
   *              căn phải để khớp với form đứng ngay trước nó.
   */
  variant?: 'page' | 'embedded';
  title?: string;
  description?: string;
  confirmLabel?: string;
  backLabel?: string;
}

export const VerifyOTP = forwardRef<VerifyOTPHandle, VerifyOTPProps>(
  (props, ref) => {
    const {
      maskedDestination,
      length = 6,
      resendCooldownSeconds = 120,
      onVerify,
      onResend,
      onBack,
      variant = 'page',
      title = 'Xác thực OTP',
      description,
      confirmLabel = 'Xác nhận',
      backLabel = 'Quay lại',
    } = props;

    const isEmbedded = variant === 'embedded';

    const [digits, setDigits] = useState<string[]>(() =>
      Array(length).fill('')
    );
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(resendCooldownSeconds);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    // Khoá đồng bộ chống gọi submit trùng. Phải là ref, không phải state: setState
    // là bất đồng bộ nên hai lần gọi sát nhau đều đọc được isVerifying === false.
    const submitLockRef = useRef(false);

    useEffect(() => {
      if (secondsLeft <= 0) return;
      const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    }, [secondsLeft]);

    const focusInput = (index: number) => {
      inputRefs.current[index]?.focus();
    };

    useImperativeHandle(ref, () => ({
      // preventScroll: ô nhập nằm trong một khung overflow-hidden khi được nhúng,
      // để trình duyệt tự "cuộn tới" sẽ làm lệch băng trượt vừa dừng đúng vị trí.
      focusFirst: () => inputRefs.current[0]?.focus({ preventScroll: true }),
    }));

    // Có 3 đường cùng gọi hàm này: tự động khi gõ đủ số, khi paste, và nút xác nhận.
    // OTP chỉ dùng được MỘT lần — verify xong là backend tiêu huỷ mã ngay. Nếu để gọi
    // lần hai với mã đã dùng, backend từ chối (OTP_EXPIRED) và người dùng thấy báo lỗi
    // dù thực ra đã đăng nhập thành công ở lần gọi đầu.
    const submit = async (code: string) => {
      if (submitLockRef.current) return;
      submitLockRef.current = true;
      setIsVerifying(true);
      setError(null);
      try {
        await onVerify(code);
        // Khoá vĩnh viễn sau khi thành công: mã đã bị tiêu huỷ, gọi lại chỉ sinh lỗi giả.
        setIsVerified(true);
      } catch (err: any) {
        setError(err?.message ?? 'Xác thực OTP thất bại, vui lòng thử lại!');
        setDigits(Array(length).fill(''));
        focusInput(0);
        // Chỉ mở khoá khi thất bại, để người dùng nhập lại.
        submitLockRef.current = false;
      } finally {
        setIsVerifying(false);
      }
    };

    const handleChange =
      (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (!value) {
          setDigits((prev) => {
            const next = [...prev];
            next[index] = '';
            return next;
          });
          return;
        }
        const nextDigits = [...digits];
        nextDigits[index] = value[value.length - 1];
        setDigits(nextDigits);

        if (index < length - 1) {
          focusInput(index + 1);
        }

        if (nextDigits.every((d) => d !== '')) {
          submit(nextDigits.join(''));
        }
      };

    const handleKeyDown =
      (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
          focusInput(index - 1);
        }
        if (e.key === 'ArrowLeft' && index > 0) {
          e.preventDefault();
          focusInput(index - 1);
        }
        if (e.key === 'ArrowRight' && index < length - 1) {
          e.preventDefault();
          focusInput(index + 1);
        }
      };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData
        .getData('text')
        .replace(/[^0-9]/g, '')
        .slice(0, length);
      if (!pasted) return;
      e.preventDefault();
      const nextDigits = Array(length).fill('');
      for (let i = 0; i < pasted.length; i++) {
        nextDigits[i] = pasted[i];
      }
      setDigits(nextDigits);
      const lastIndex = Math.min(pasted.length, length) - 1;
      focusInput(lastIndex >= 0 ? lastIndex : 0);
      if (nextDigits.every((d) => d !== '')) {
        submit(nextDigits.join(''));
      }
    };

    const handleResend = async () => {
      setIsResending(true);
      setError(null);
      try {
        await onResend();
        setDigits(Array(length).fill(''));
        setSecondsLeft(resendCooldownSeconds);
        focusInput(0);
        // Mã mới đã được gửi -> cho phép submit lại.
        submitLockRef.current = false;
        setIsVerified(false);
      } catch (err: any) {
        setError(err?.message ?? 'Gửi lại mã OTP thất bại, vui lòng thử lại!');
      } finally {
        setIsResending(false);
      }
    };

    const isComplete = digits.every((d) => d !== '');
    const isLocked = isVerifying || isVerified;

    const defaultDescription = maskedDestination
      ? `Mã gồm ${length} chữ số vừa được gửi tới số điện thoại ${maskedDestination}.`
      : `Vui lòng nhập mã OTP gồm ${length} chữ số đã được gửi tới số điện thoại của bạn, hãy kiểm tra hộp thư!`;

    const boxSizeClass = isEmbedded ? 'w-12 h-14 text-2xl' : 'w-12 h-12 text-xl';

    const body = (
      <div className={`flex flex-col ${isEmbedded ? 'gap-5' : 'gap-4'}`}>
        <div
          className={`flex items-center gap-2 justify-center`}
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={`${boxSizeClass} text-center font-semibold rounded-md border border-solid bg-white outline-none transition-colors duration-150 disabled:bg-gray-50 disabled:text-gray-400 ${
                error
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 focus:border-primary'
              }`}
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label={`Chữ số thứ ${index + 1} của mã OTP`}
              aria-invalid={error ? true : undefined}
              maxLength={1}
              value={digit}
              disabled={isLocked}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {error && (
          <div className="text-red-600 text-sm" role="alert">
            {error}
          </div>
        )}

        <div>
          {secondsLeft > 0 ? (
            <Text type="tertiary">Gửi lại mã sau {secondsLeft}s</Text>
          ) : (
            <Text link onClick={handleResend} disabled={isResending}>
              {isResending ? 'Đang gửi lại...' : 'Gửi lại mã'}
            </Text>
          )}
        </div>

        {isEmbedded ? (
          <div className="mt-2 text-right">
            <Button
              className="ml-5"
              type="primary"
              theme="solid"
              loading={isVerifying}
              disabled={!isComplete || isLocked}
              onClick={() => submit(digits.join(''))}
            >
              {confirmLabel}
            </Button>
          </div>
        ) : (
          <>
            <Button
              className="w-full"
              type="primary"
              theme="solid"
              size="large"
              loading={isVerifying}
              disabled={!isComplete || isLocked}
              onClick={() => submit(digits.join(''))}
            >
              {confirmLabel}
            </Button>

            {onBack && (
              <div className="flex justify-center">
                <Button
                  className="w-full !hover:bg-primary-500"
                  onClick={onBack}
                  icon={<IconArrowLeft />}
                >
                  {backLabel}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );

    if (isEmbedded) {
      return (
        <div className="w-full">
          <div className="text-xl font-bold text-main">{title}</div>
          <div className="mt-2 mb-6 text-subtext">
            {description ?? defaultDescription}
          </div>
          {body}
        </div>
      );
    }

    return (
      <AuthCard
        title={title}
        description={
          description ??
          `Vui lòng nhập mã OTP gồm ${length} chữ số đã được gửi tới số điện thoại của bạn, hãy kiểm tra hộp thư!`
        }
      >
        {body}
      </AuthCard>
    );
  }
);

VerifyOTP.displayName = 'VerifyOTP';
