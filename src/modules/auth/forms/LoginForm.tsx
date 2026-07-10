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
import { AuthCard /*, VerifyOTP */ } from "../components";
import { IconUnlock } from "@douyinfe/semi-icons";
import { ForgotPassword } from "../components/ForgotPassword";
import { isProduction } from "@helpers/common.helper";
import { useGoogleReCaptcha } from "@helpers/recapcha";
// import { AuthServices, OtpServices } from "@services/auth";

// OTP 2FA flow — implemented, disabled until the backend exposes a real
// OTP send/verify API. See src/modules/auth/components/VerifyOTP.tsx and
// src/services/auth/otp.services.ts. Re-enable by uncommenting the blocks
// marked "OTP:" below and restoring the imports above.
// interface PendingCredentials {
//   username: string;
//   password: string;
//   callbackUrl: string;
//   recaptchaToken: string;
// }

export const LoginForm = (props: any) => {
  const { profile } = useAuth();
  const router = useRouter();
  const { Text } = Typography;
  const { signIn, state: ContextState } = useAuth();
  const { isLoginPending, isLoggedIn, loginError } = ContextState;
  const { executeRecaptcha } = useGoogleReCaptcha();

  // OTP: const [step, setStep] = useState<"credentials" | "otp">("credentials");
  // OTP: const [otpDestination, setOtpDestination] = useState("");
  // OTP: const [pendingCredentials, setPendingCredentials] =
  // OTP:   useState<PendingCredentials | null>(null);
  // OTP: const [awaitingSignInResult, setAwaitingSignInResult] = useState(false);
  // OTP: const [isCheckingCredentials, setIsCheckingCredentials] = useState(false);

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

  // OTP: useEffect(() => {
  // OTP:   if (awaitingSignInResult && loginError) {
  // OTP:     Notification.error({
  // OTP:       content: loginError?.message || "Đăng nhập thất bại, vui lòng thử lại!",
  // OTP:       theme: "light",
  // OTP:       position: "top",
  // OTP:     });
  // OTP:     setAwaitingSignInResult(false);
  // OTP:     setStep("credentials");
  // OTP:     setPendingCredentials(null);
  // OTP:   }
  // OTP: }, [loginError, awaitingSignInResult]);

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
    signIn("credential", {
      username: username.trim(),
      password: password.trim(),
      callbackUrl: getCallbackUrl(),
      recaptchaToken,
    });

    // OTP: const trimmedUsername = username.trim();
    // OTP: const trimmedPassword = password.trim();
    // OTP: const callbackUrl = getCallbackUrl();
    // OTP:
    // OTP: setIsCheckingCredentials(true);
    // OTP: let loginResponse: any;
    // OTP: try {
    // OTP:   loginResponse = await AuthServices.login({
    // OTP:     username: trimmedUsername,
    // OTP:     password: trimmedPassword,
    // OTP:     callbackUrl,
    // OTP:     recaptchaToken,
    // OTP:   });
    // OTP: } catch (error) {
    // OTP:   setIsCheckingCredentials(false);
    // OTP:   return;
    // OTP: }
    // OTP: setIsCheckingCredentials(false);
    // OTP:
    // OTP: const isValidCredentials = loginResponse?.data?.data != null;
    // OTP: if (!isValidCredentials) {
    // OTP:   // axiosInstance's response interceptor already shows the backend's
    // OTP:   // error notification (e.g. "Người dùng không tồn tại") — nothing else
    // OTP:   // to do here besides staying on the credentials form.
    // OTP:   return;
    // OTP: }
    // OTP:
    // OTP: try {
    // OTP:   const { maskedDestination } = await OtpServices.sendOtp(
    // OTP:     trimmedUsername
    // OTP:   );
    // OTP:   setPendingCredentials({
    // OTP:     username: trimmedUsername,
    // OTP:     password: trimmedPassword,
    // OTP:     callbackUrl,
    // OTP:     recaptchaToken,
    // OTP:   });
    // OTP:   setOtpDestination(maskedDestination);
    // OTP:   setStep("otp");
    // OTP: } catch (error) {
    // OTP:   Notification.error({
    // OTP:     content: "Không gửi được mã OTP, vui lòng thử lại!",
    // OTP:     theme: "light",
    // OTP:     position: "top",
    // OTP:   });
    // OTP: }
  };

  // OTP: const handleVerifyOtp = async (otp: string) => {
  // OTP:   if (!pendingCredentials) return;
  // OTP:   await OtpServices.verifyOtp({
  // OTP:     identifier: pendingCredentials.username,
  // OTP:     otp,
  // OTP:     purpose: "login",
  // OTP:   });
  // OTP:   setAwaitingSignInResult(true);
  // OTP:   signIn("credential", pendingCredentials);
  // OTP: };
  // OTP:
  // OTP: const handleResendOtp = async () => {
  // OTP:   if (!pendingCredentials) return;
  // OTP:   const { maskedDestination } = await OtpServices.sendOtp(
  // OTP:     pendingCredentials.username
  // OTP:   );
  // OTP:   setOtpDestination(maskedDestination);
  // OTP: };
  // OTP:
  // OTP: const handleBackToCredentials = () => {
  // OTP:   setStep("credentials");
  // OTP:   setPendingCredentials(null);
  // OTP: };

  if (profile) return <></>;

  // OTP: if (step === "otp") {
  // OTP:   return (
  // OTP:     <VerifyOTP
  // OTP:       maskedDestination={otpDestination}
  // OTP:       onVerify={handleVerifyOtp}
  // OTP:       onResend={handleResendOtp}
  // OTP:       onBack={handleBackToCredentials}
  // OTP:     />
  // OTP:   );
  // OTP: }

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
