import {
  AuthLayout,
  AuthLayoutLeft,
  AuthLayoutRight,
} from '@components/widgets/Layouts/Layout/AuthLayout'
import { LoginForm } from '@modules/auth'

export default function SignIn() {
  return (
    <>
      <AuthLayout>
        <AuthLayoutLeft>
          <LoginForm />
        </AuthLayoutLeft>
        <AuthLayoutRight></AuthLayoutRight>
      </AuthLayout>
    </>
  )
}

export async function getServerSideProps(context: any) {
  return {
    props: {},
  }
}
