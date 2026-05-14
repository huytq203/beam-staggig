import {
  AuthLayout,
  AuthLayoutLeft,
  AuthLayoutRight,
} from '@components/widgets/Layouts/Layout/AuthLayout'
import { ForgotPasswordForm } from '@modules/auth'

export async function getStaticProps({ locale }: any) {
  return {
    props: {},
  }
}

export default function ForgetPasswordPage() {
  return (
    <AuthLayout>
      <AuthLayoutLeft>
        <ForgotPasswordForm />
      </AuthLayoutLeft>
      <AuthLayoutRight></AuthLayoutRight>
    </AuthLayout>
  )
}
