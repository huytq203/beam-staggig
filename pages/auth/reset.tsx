import {
  AuthLayout,
  AuthLayoutLeft,
  AuthLayoutRight,
} from "@components/widgets/Layouts/Layout/AuthLayout";
import { ResetLinkForm } from "@modules/auth/forms/ResetLinkForm";

import { useRouter } from "next/router";

export async function getServerSideProps(props: any) {
  const { locale } = props;
  const { users, token } = props.query;

  const userData = {
    userName: users,
    token: token,
  };

  return {
    props: {
      verifyResponse: userData,
    },
  };
}

export default function ForgetPasswordPage(props: any) {
  const router = useRouter();
  const { verifyResponse } = props;
  return (
    <AuthLayout>
      <AuthLayoutLeft>
        {/* {isValid ? (
          <ResetForm verifyResponse={verifyResponse} />
        ) : (
          <div className="px-24">
            <Banner
              fullMode={false}
              bordered
              icon={null}
              closeIcon={null}
              type="danger"
              description="Password reset link is invalid or expired. The link was sent more than 1 hour ago, so it's no longer valid for security reasons"
              className="my-4 font-bold"
            />
          </div>
        )} */}
        <ResetLinkForm verifyResponse={verifyResponse} />
      </AuthLayoutLeft>
      <AuthLayoutRight />
    </AuthLayout>
  );
}
