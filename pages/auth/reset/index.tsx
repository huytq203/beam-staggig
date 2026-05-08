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
        <ResetLinkForm verifyResponse={verifyResponse} />
      </AuthLayoutLeft>
      <AuthLayoutRight />
    </AuthLayout>
  );
}
