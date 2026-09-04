import { InputWrapper } from "@components/shared";
import { useAuth } from "@contexts/authentication";
import { Button, Input, Notification, Typography } from "@douyinfe/semi-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema } from "validations/Auth.schema";
import { AuthCard, VerifyOTP } from "../components";
import { IconUnlock } from "@douyinfe/semi-icons";
import { isProduction } from "@helpers/common.helper";
import { useGoogleReCaptcha } from "@helpers/recapcha";

// Admin login 2 bước (2FA-OTP):
//   B1 /account/login          -> BE verify mật khẩu + GỬI OTP SMS, trả { requireOtp, phoneHint }
//   B2 /account/login/verify-otp -> nhập OTP -> nhận token -> tạo session
interface PendingCredentials {
  username: string;
  password: string;
  callbackUrl: string;
}

export const LoginForm = (props: any) => {
  const { profile } = useAuth();
  const router = useRouter();
  const { Text } = Typography;
  const { requestLoginOtp, verifyLoginOtp, state: ContextState } = useAuth();
  const { isLoginPending, loginError } = ContextState;
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [phoneHint, setPhoneHint] = useState("");
  const [pendingCredentials, setPendingCredentials] =
    useState<PendingCredentials | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const reason = router.query.reason;
    if (!reason) {
      return;
    }

    // Nội dung khác nhau vì hai lý do này khác nhau với user: một cái do họ để
    // máy không dùng, một cái do phiên đã sống hết đời.
    const messages: Record<string, string> = {
      idle:
        "Phiên làm việc đã hết hạn do không có thao tác trong 15 phút. Vui lòng đăng nhập lại!",
      expired: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
    };
    const content = messages[String(reason)];
    if (!content) {
      return;
    }

    Notification.warning({
      content,
      theme: "light",
      position: "top",
      duration: 8,
    });
  }, [router.query.reason]);

  const {
    control,
    handleSubmit,
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
    const url = `${redirectUrl}&startDate=${startDate}&endDate=${endDate}`;
    if (url && redirectUrl && startDate && endDate) {
      return url;
    } else if (redirectUrl && !startDate && !endDate) {
      return `${redirectUrl}`;
    } else {
      return "/dashboard";
    }
  };

  // Lấy recaptcha token mới cho MỖI lần gọi /account/login (token v3 dùng 1 lần).
  const getRecaptchaToken = async (): Promise<string | null> => {
    try {
      return await executeRecaptcha("login");
    } catch (error) {
      Notification.error({
        content: "Không xác thực được reCAPTCHA, vui lòng thử lại!",
        theme: "light",
        position: "top",
      });
      return null;
    }
  };

  const handleSignIn = async (values: any) => {
    if (isSubmitting) return;
    const username = values.username.trim();
    const password = values.password.trim();
    const callbackUrl = getCallbackUrl();

    setIsSubmitting(true);
    const recaptchaToken = await getRecaptchaToken();
    if (recaptchaToken == null) {
      setIsSubmitting(false);
      return;
    }

    const data = await requestLoginOtp({
      username,
      password,
      callbackUrl,
      recaptchaToken,
    });
    setIsSubmitting(false);

    if (data?.loggedIn) {
      // BE không bật OTP: đã đăng nhập & redirect trong context.
      return;
    }
    if (data?.requireOtp) {
      setPendingCredentials({ username, password, callbackUrl });
      setPhoneHint(data.phoneHint || "");
      setStep("otp");
    }
    // data == null: interceptor đã hiện thông báo lỗi (sai mật khẩu, khoá tài khoản...).
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!pendingCredentials) return;
    // Ném lỗi -> VerifyOTP tự hiển thị lỗi và cho nhập lại.
    await verifyLoginOtp(pendingCredentials, otp);
  };

  const handleResendOtp = async () => {
    if (!pendingCredentials) return;
    const recaptchaToken = await getRecaptchaToken();
    if (recaptchaToken == null) {
      throw new Error("Không xác thực được reCAPTCHA, vui lòng thử lại!");
    }
    const data = await requestLoginOtp({
      ...pendingCredentials,
      recaptchaToken,
    });
    if (!data?.requireOtp) {
      throw new Error("Không gửi lại được mã, vui lòng thử lại sau giây lát!");
    }
    setPhoneHint(data.phoneHint || phoneHint);
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setPendingCredentials(null);
  };

  if (profile) return <></>;

  if (step === "otp") {
    return (
      <VerifyOTP
        maskedDestination={phoneHint}
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
              {loginError && (
                <div className="text-red-500">{loginError?.message}</div>
              )}
            </div>

            <div className="flex justify-between">
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
                loading={isLoginPending || isSubmitting}
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
      </AuthCard>
    </>
  );
};
