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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema } from "validations/Auth.schema";
import { AuthCard } from "../components";
import { IconUnlock } from "@douyinfe/semi-icons";
import { ForgotPassword } from "../components/ForgotPassword";
import { isProduction } from "@helpers/common.helper";
export const LoginForm = (props: any) => {
  const { profile } = useAuth();
  const router = useRouter();
  const { Text } = Typography;
  const { signIn, state: ContextState } = useAuth();
  const { isLoginPending, isLoggedIn, loginError } = ContextState;

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
  const handleSignIn = (values: any) => {
    const { username, password } = values;
    signIn("credential", {
      username: username.trim(),
      password: password.trim(),
      callbackUrl: getCallbackUrl(),
    });
  };
  if (profile) return <></>;

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
