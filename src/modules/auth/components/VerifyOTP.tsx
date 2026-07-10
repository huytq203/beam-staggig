import { IconArrowLeft } from '@douyinfe/semi-icons';
import { Button, Typography } from '@douyinfe/semi-ui';
import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthCard } from './AuthCard';

const { Text } = Typography;

export interface VerifyOTPProps {
  maskedDestination: string;
  length?: number;
  resendCooldownSeconds?: number;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack?: () => void;
}

export const VerifyOTP = (props: VerifyOTPProps) => {
  const {
    maskedDestination,
    length = 6,
    resendCooldownSeconds = 60,
    onVerify,
    onResend,
    onBack,
  } = props;

  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(resendCooldownSeconds);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const submit = async (code: string) => {
    setIsVerifying(true);
    setError(null);
    try {
      await onVerify(code);
    } catch (err: any) {
      setError(err?.message ?? 'Xác thực OTP thất bại, vui lòng thử lại!');
      setDigits(Array(length).fill(''));
      focusInput(0);
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
    } catch (err: any) {
      setError(err?.message ?? 'Gửi lại mã OTP thất bại, vui lòng thử lại!');
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = digits.every((d) => d !== '');

  return (
    <AuthCard
      title="Xác thực OTP"
      description={`Vui lòng nhập mã OTP gồm ${length} chữ số đã được gửi tới ${maskedDestination}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className="w-12 h-12 text-center text-xl border rounded-md border-gray-300 focus:border-blue-500 focus:outline-none"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={isVerifying}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div>
          {secondsLeft > 0 ? (
            <Text type="tertiary">Gửi lại mã sau {secondsLeft}s</Text>
          ) : (
            <Text link onClick={handleResend} disabled={isResending}>
              {isResending ? 'Đang gửi lại...' : 'Gửi lại mã'}
            </Text>
          )}
        </div>

        <Button
          className="w-full"
          type="primary"
          theme="solid"
          size="large"
          loading={isVerifying}
          disabled={!isComplete}
          onClick={() => submit(digits.join(''))}
        >
          Xác nhận
        </Button>

        {onBack && (
          <div className="flex justify-center">
            <Text link onClick={onBack} icon={<IconArrowLeft />}>
              Quay lại
            </Text>
          </div>
        )}
      </div>
    </AuthCard>
  );
};
