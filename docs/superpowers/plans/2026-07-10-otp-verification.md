# OTP Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable `VerifyOTP` component and wire it into both the post-login 2FA step and the forgot-password flow, backed by a mocked OTP service that can be swapped for a real backend later without touching the component or the forms.

**Architecture:** `VerifyOTP` is a presentational component (props in, callbacks out) that lives in `src/modules/auth/components/`. A new `OtpServices` mock in `src/services/auth/otp.services.ts` simulates network latency and validates against a fixed test code. `LoginForm` and `ForgotPasswordForm` each own a local `step` state machine that calls `OtpServices` and renders `VerifyOTP` between their existing steps. `AuthenticationProvider` and `ResetForm` are not modified.

**Tech Stack:** Next.js (pages router), React (hooks, no class components), `@douyinfe/semi-ui` component library, `react-hook-form` + `yup` for the existing forms, TypeScript, Tailwind utility classes for layout.

## Global Constraints

- Backend has no OTP endpoints yet. `OtpServices` must be a drop-in mock — every method returns a `Promise` with the same shape a real API call would (so swapping the internals later requires no caller changes).
- Do not modify `src/contexts/authentication/AuthenticationProvider.tsx` or `src/modules/auth/forms/ResetForm.tsx`.
- Do not delete `AuthServices.resetPassword` — only stop calling it from `ForgotPasswordForm`.
- The project has no test runner configured (no jest/vitest in `package.json`). Verification for each task is: (a) `npx tsc --noEmit -p tsconfig.json` must exit clean, and (b) manual verification in the browser via `npm run dev`, as specified per task.
- Mock valid OTP code for manual testing: `123456` (any other 6-digit value must be rejected as invalid).
- All new user-facing strings are in Vietnamese, matching the existing forms in `src/modules/auth/`.

---

### Task 1: Add OTP error messages to `GlobalResponseMessageCodes`

**Files:**
- Modify: `src/services/api/handlers.ts:1-4`

**Interfaces:**
- Produces: `GlobalResponseMessageCodes.OTP_INVALID`, `GlobalResponseMessageCodes.OTP_EXPIRED`, `GlobalResponseMessageCodes.OTP_MAX_ATTEMPTS_EXCEEDED` — string enum members consumed by `OtpServices` in Task 2.

- [ ] **Step 1: Add the three new enum members**

Open `src/services/api/handlers.ts`. The file starts with:

```ts
export enum GlobalResponseMessageCodes {
  EMPTY_RECAPTCHA_TOKEN="Captcha chưa được xác thực!",
  RECAPTCHA_VERIFICATION_FAILED='Captcha không hợp lệ!',
  INTERNAL_ERROR = 'Vui lòng thử lại sau hoặc liên hệ quản trị viên để biết thêm thông tin',
```

Insert three new members right after `RECAPTCHA_VERIFICATION_FAILED`, so the top of the enum reads:

```ts
export enum GlobalResponseMessageCodes {
  EMPTY_RECAPTCHA_TOKEN="Captcha chưa được xác thực!",
  RECAPTCHA_VERIFICATION_FAILED='Captcha không hợp lệ!',
  OTP_INVALID = 'Mã OTP không đúng, vui lòng thử lại!',
  OTP_EXPIRED = 'Mã OTP đã hết hạn, vui lòng gửi lại mã!',
  OTP_MAX_ATTEMPTS_EXCEEDED = 'Bạn đã nhập sai quá số lần cho phép, vui lòng gửi lại mã!',
  INTERNAL_ERROR = 'Vui lòng thử lại sau hoặc liên hệ quản trị viên để biết thêm thông tin',
```

Leave the rest of the file untouched.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exits with no output (clean).

- [ ] **Step 3: Commit**

```bash
git add src/services/api/handlers.ts
git commit -m "feat(auth): add OTP error message codes"
```

---

### Task 2: Create the mock `OtpServices`

**Files:**
- Create: `src/services/auth/otp.services.ts`
- Modify: `src/services/auth/index.ts`

**Interfaces:**
- Consumes: `GlobalResponseMessageCodes.OTP_INVALID` from Task 1 (`../api/handlers`).
- Produces:
  - `OtpServices.sendOtp(identifier: string): Promise<{ maskedDestination: string }>`
  - `OtpServices.verifyOtp(params: { identifier: string; otp: string; purpose: 'login' | 'reset-password' }): Promise<{ userId?: string; reset_token?: string }>`
  - Both consumed by `LoginForm` (Task 4) and `ForgotPasswordForm` (Task 5).

- [ ] **Step 1: Create `src/services/auth/otp.services.ts`**

```ts
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
```

- [ ] **Step 2: Export it from the services barrel**

Open `src/services/auth/index.ts`, currently:

```ts
export * from './apis'
export * from './auth.services'
export * from './auth.session'
```

Change to:

```ts
export * from './apis'
export * from './auth.services'
export * from './auth.session'
export * from './otp.services'
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exits with no output (clean).

- [ ] **Step 4: Commit**

```bash
git add src/services/auth/otp.services.ts src/services/auth/index.ts
git commit -m "feat(auth): add mocked OtpServices for send/verify OTP"
```

---

### Task 3: Build the `VerifyOTP` component

**Files:**
- Modify: `src/modules/auth/components/VerifyOTP.tsx` (currently an empty tracked-but-untracked file — populate it)
- Modify: `src/modules/auth/components/index.ts`

**Interfaces:**
- Consumes: `AuthCard` from `./AuthCard` (same directory).
- Produces: `VerifyOTP` React component with props:
  ```ts
  interface VerifyOTPProps {
    maskedDestination: string;
    length?: number;                 // default 6
    resendCooldownSeconds?: number;  // default 60
    onVerify: (otp: string) => Promise<void>;
    onResend: () => Promise<void>;
    onBack?: () => void;
  }
  ```
  Consumed by `LoginForm` (Task 4) and `ForgotPasswordForm` (Task 5).

- [ ] **Step 1: Write `src/modules/auth/components/VerifyOTP.tsx`**

```tsx
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
```

- [ ] **Step 2: Export it from the components barrel**

Open `src/modules/auth/components/index.ts`, currently:

```ts
export * from "./AuthCard"
export * from "./BackToLogin"
```

Change to:

```ts
export * from "./AuthCard"
export * from "./BackToLogin"
export * from "./VerifyOTP"
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exits with no output (clean).

- [ ] **Step 4: Commit**

```bash
git add src/modules/auth/components/VerifyOTP.tsx src/modules/auth/components/index.ts
git commit -m "feat(auth): add reusable VerifyOTP component"
```

---

### Task 4: Integrate OTP into `LoginForm` (2FA after credentials)

**Files:**
- Modify: `src/modules/auth/forms/LoginForm.tsx` (full file rewrite)

**Interfaces:**
- Consumes: `OtpServices.sendOtp` / `OtpServices.verifyOtp` (Task 2), `VerifyOTP` (Task 3), existing `useAuth().signIn` (unchanged).

- [ ] **Step 1: Replace the full contents of `src/modules/auth/forms/LoginForm.tsx`**

```tsx
import { InputWrapper } from "@components/shared";
import { useAuth } from "@contexts/authentication";
import {
  Button,
  Input,
  Notification,
  Switch,
  Typography,
} from "@douyinfe/semi-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema } from "validations/Auth.schema";
import { AuthCard, VerifyOTP } from "../components";
import { IconUnlock } from "@douyinfe/semi-icons";
import { ForgotPassword } from "../components/ForgotPassword";
import { isProduction } from "@helpers/common.helper";
import { useGoogleReCaptcha } from "@helpers/recapcha";
import { OtpServices } from "@services/auth";

interface PendingCredentials {
  username: string;
  password: string;
  callbackUrl: string;
  recaptchaToken: string;
}

export const LoginForm = (props: any) => {
  const { profile } = useAuth();
  const router = useRouter();
  const { Text } = Typography;
  const { signIn, state: ContextState } = useAuth();
  const { isLoginPending, isLoggedIn, loginError } = ContextState;
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [otpDestination, setOtpDestination] = useState("");
  const [pendingCredentials, setPendingCredentials] =
    useState<PendingCredentials | null>(null);
  const [awaitingSignInResult, setAwaitingSignInResult] = useState(false);

  useEffect(() => {
    if (profile != null) {
      router.push("/dashboard");
    }
  }, [profile]);
  useEffect(() => {
    window.addEventListener("storage", handleLogin);
    function handleLogin() {
      let loginValue = JSON.parse(localStorage.getItem("isLogout") || "");
      if (loginValue === false) {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    }
    // return () => {
    //   window.removeEventListener('click', handleLogin);
    // };
  }, []);
  useEffect(() => {
    if (router.query.error) {
      Notification.error({
        content: `Thông tin đăng nhập chưa đúng, vui lòng kiểm tra lại!`,
        theme: "light",
        position: "top",
      });
    }
  }, [router.query.error]);

  useEffect(() => {
    if (awaitingSignInResult && loginError) {
      Notification.error({
        content: loginError?.message || "Đăng nhập thất bại, vui lòng thử lại!",
        theme: "light",
        position: "top",
      });
      setAwaitingSignInResult(false);
      setStep("credentials");
      setPendingCredentials(null);
    }
  }, [loginError, awaitingSignInResult]);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      username: null,
      password: null,
      isRememberPassword: false,
    },
  });

  const getCallbackUrl = () => {
    const { redirectUrl, startDate, endDate } = router.query;
    // const url: any = router.asPath;
    const url = `${redirectUrl}&startDate=${startDate}&endDate=${endDate}`;
    if (url && redirectUrl && startDate && endDate) {
      return url;
    } else if (redirectUrl && !startDate && !endDate) {
      return `${redirectUrl}`;
    } else {
      return "/dashboard";
    }
  };

  const handleSignIn = async (values: any) => {
    const { username, password } = values;
    let recaptchaToken = "";
    try {
      recaptchaToken = await executeRecaptcha("login");
    } catch (error) {
      Notification.error({
        content: "Không xác thực được reCAPTCHA, vui lòng thử lại!",
        theme: "light",
        position: "top",
      });
      return;
    }

    try {
      const { maskedDestination } = await OtpServices.sendOtp(
        username.trim()
      );
      setPendingCredentials({
        username: username.trim(),
        password: password.trim(),
        callbackUrl: getCallbackUrl(),
        recaptchaToken,
      });
      setOtpDestination(maskedDestination);
      setStep("otp");
    } catch (error) {
      Notification.error({
        content: "Không gửi được mã OTP, vui lòng thử lại!",
        theme: "light",
        position: "top",
      });
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!pendingCredentials) return;
    await OtpServices.verifyOtp({
      identifier: pendingCredentials.username,
      otp,
      purpose: "login",
    });
    setAwaitingSignInResult(true);
    signIn("credential", pendingCredentials);
  };

  const handleResendOtp = async () => {
    if (!pendingCredentials) return;
    const { maskedDestination } = await OtpServices.sendOtp(
      pendingCredentials.username
    );
    setOtpDestination(maskedDestination);
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setPendingCredentials(null);
  };

  if (profile) return <></>;

  if (step === "otp") {
    return (
      <VerifyOTP
        maskedDestination={otpDestination}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={handleBackToCredentials}
      />
    );
  }

  return (
    <>
      <AuthCard
        title="Xin chào bạn!"
        description="Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi ! Vui lòng đăng nhập để bắt đầu."
      >
        <form onSubmit={handleSubmit(handleSignIn)}>
          <div className="flex flex-col gap-4">
            <InputWrapper
              field="username"
              label="Tài khoản"
              component={(props: any) => (
                <Input
                  size="large"
                  placeholder="Nhập vào tài khoản"
                  type="text"
                  {...props}
                />
              )}
              control={control}
              errors={errors}
            />

            <InputWrapper
              field="password"
              label="Mật khẩu"
              component={(props: any) => (
                <Input
                  size="large"
                  placeholder="Password"
                  mode="password"
                  type="password"
                  {...props}
                />
              )}
              control={control}
              errors={errors}
            />

            <div className="text text-base">
              {/* {isLoginPending && <div>...</div>} */}
              {/* {isLoggedIn && <div>Success.</div>} */}
              {loginError && (
                <div className="text-red-500">{loginError?.message}</div>
              )}
            </div>

            <div className="flex justify-between">
              {/* <div className=" flex items-center gap-3">
                <InputWrapper
                  field="isRememberPassword"
                  component={(props: any) => <Switch {...props} />}
                  control={control}
                  errors={errors}
                />

                <div className="text-sm font-semibold">Lưu mật khẩu</div>
              </div> */}
              <div>
                <Text
                  link
                  onClick={() => router.push("/auth/forgot")}
                  icon={<IconUnlock />}
                >
                  Quên mật khẩu?
                </Text>
              </div>
            </div>
            <div className="pt-6">
              <Button
                loading={isLoginPending}
                className="w-full"
                htmlType="submit"
                size="large"
                type="primary"
                theme="solid"
                style={{
                  background: `${isProduction() ? "" : "#008000b0"}`,
                }}
              >
                Đăng nhập
              </Button>
            </div>
          </div>
        </form>
        {/* <ForgotPassword /> */}
      </AuthCard>
    </>
  );
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exits with no output (clean).

- [ ] **Step 3: Manual verification in the browser**

Run: `npm run dev`, open `/auth/signin`.

1. Enter a valid-looking username/password and submit. After the (mocked) reCAPTCHA resolves, the screen should switch to "Xác thực OTP" showing a masked destination string.
2. Type `000000` across the 6 boxes. Expect: red error text "Mã OTP không đúng, vui lòng thử lại!", boxes clear, focus returns to the first box.
3. Type `123456`. Expect: button shows loading briefly, then the browser navigates away (redirect triggered by `signIn`/`callbackUrl`) — i.e. login completes.
4. Repeat step 1, then on the OTP screen click "Quay lại". Expect: return to the username/password form with fields cleared per normal form state.
5. Repeat step 1, then wait for the countdown to reach 0 (or temporarily lower `resendCooldownSeconds` while testing). Expect: "Gửi lại mã" becomes clickable; clicking it resets the countdown and clears the boxes.

- [ ] **Step 4: Commit**

```bash
git add src/modules/auth/forms/LoginForm.tsx
git commit -m "feat(auth): require OTP verification after login credentials"
```

---

### Task 5: Integrate OTP into `ForgotPasswordForm` (replaces email-link flow)

**Files:**
- Modify: `src/modules/auth/forms/ForgotPasswordForm.tsx` (full file rewrite)

**Interfaces:**
- Consumes: `OtpServices.sendOtp` / `OtpServices.verifyOtp` (Task 2), `VerifyOTP` (Task 3), existing `ResetForm` (`@modules/auth`, unchanged — expects `verifyResponse: { userId, reset_token }`).

- [ ] **Step 1: Replace the full contents of `src/modules/auth/forms/ForgotPasswordForm.tsx`**

```tsx
import { Button, Input, Notification } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthCard, BackToLogin, ResetForm, VerifyOTP } from '@modules/auth';
import { OtpServices } from '@services/auth';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ForgotPasswordSchema } from 'validations/Auth.schema';

type Step = 'account' | 'otp' | 'reset';

interface ResetPayload {
  userId: string;
  reset_token: string;
}

export const ForgotPasswordForm = () => {
  const [step, setStep] = useState<Step>('account');
  const [username, setUsername] = useState('');
  const [otpDestination, setOtpDestination] = useState('');
  const [resetPayload, setResetPayload] = useState<ResetPayload | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues: {
      username: '',
    },
  });

  const onResetPassword = async (data: any) => {
    const trimmedUsername = data.username.trim();
    try {
      const { maskedDestination } = await OtpServices.sendOtp(
        trimmedUsername
      );
      setUsername(trimmedUsername);
      setOtpDestination(maskedDestination);
      setStep('otp');
    } catch (error) {
      Notification.error({
        content: 'Không gửi được mã OTP, vui lòng thử lại!',
        theme: 'light',
        position: 'top',
      });
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const result = await OtpServices.verifyOtp({
      identifier: username,
      otp,
      purpose: 'reset-password',
    });
    setResetPayload({
      userId: result.userId as string,
      reset_token: result.reset_token as string,
    });
    setStep('reset');
  };

  const handleResendOtp = async () => {
    const { maskedDestination } = await OtpServices.sendOtp(username);
    setOtpDestination(maskedDestination);
  };

  const handleBackToAccount = () => {
    setStep('account');
  };

  const errs: any = errors;

  if (step === 'otp') {
    return (
      <VerifyOTP
        maskedDestination={otpDestination}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={handleBackToAccount}
      />
    );
  }

  if (step === 'reset' && resetPayload) {
    return <ResetForm verifyResponse={resetPayload} />;
  }

  return (
    <AuthCard title='Quên mật khẩu?' description='Vui lòng nhập tên tài khoản để tiếp tục.'>
      <form onSubmit={handleSubmit(onResetPassword)}>
        <div className='py-4 flex flex-col gap-2'>
          <label className='font-semibold'>Tên tài khoản</label>
          <Controller
            name='username'
            control={control}
            render={({ field }) => (
              <>
                <Input
                  placeholder='Nhập tên tài khoản'
                  size='large'
                  validateStatus={errs['username']?.message.length ? 'error' : 'default'}
                  {...field}
                />
              </>
            )}
          />
          {errs?.username?.message?.length > 0 && (
            <span className='text-red-500 text-sm'>{errs?.username?.message}</span>
          )}
        </div>

        <Button className='w-full' htmlType='submit' type='primary' theme='solid'>
          Gửi thông tin
        </Button>
      </form>

      <div className='mt-4'>
        <BackToLogin />
      </div>
    </AuthCard>
  );
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exits with no output (clean).

- [ ] **Step 3: Manual verification in the browser**

Run: `npm run dev`, open `/auth/forgot`.

1. Enter any non-empty username and submit. Expect: screen switches to "Xác thực OTP" with a masked destination.
2. Type `000000`. Expect: red error text, boxes clear, focus returns to first box.
3. Type `123456`. Expect: screen switches to the existing `ResetForm` ("Set password" screen) with password/confirm-password fields.
4. Fill in matching passwords meeting the policy in `validations/Auth.schema.ts` (`ResetPasswordSchema`) and submit. Expect: existing `ResetForm` success/error banner behavior (calls `AuthServices.changeResetPassword` — this will hit the real backend with a mock `userId`/`reset_token`, so a backend error response is expected and acceptable here; the goal of this check is confirming the UI reaches `ResetForm` correctly, not that the mock token passes real backend validation).
5. From the OTP screen, click "Quay lại". Expect: return to the "Quên mật khẩu?" username form.

- [ ] **Step 4: Commit**

```bash
git add src/modules/auth/forms/ForgotPasswordForm.tsx
git commit -m "feat(auth): replace email-link reset flow with OTP verification"
```
