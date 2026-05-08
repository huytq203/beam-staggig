import { AuthLayout, AuthLayoutLeft, AuthLayoutRight } from '@components/widgets/Layouts/Layout/AuthLayout'
import { LoginForm } from '@modules/auth'

export async function getStaticProps({ locale }: any) {
  return {
    props: {},
  }
}

export default function LoginPage() {
  return (
    <AuthLayout>
      1123123
      <AuthLayoutLeft>
        <LoginForm error={true} />
      </AuthLayoutLeft>
      <AuthLayoutRight></AuthLayoutRight>
    </AuthLayout>
  )
}
