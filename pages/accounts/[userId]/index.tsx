import { ContentWrapper } from '@components/widgets'
import { PrimaryLayout } from '@components/widgets/Layouts'
import { CreateAccountForm } from '@modules/accounts'
import { UserSevice } from '@services/users'
import { NextPage } from 'next'

export async function getServerSideProps(props: any) {
  const { locale } = props
  const { userId } = props.params

  const userData = await UserSevice.getUser(userId)
  return {
    props: {
      userData: userData.data,
    },
  }
}

const EditUserPage: NextPage = (props: any) => {
  const { userData } = props

  return (
    <PrimaryLayout>
      <ContentWrapper pageTitle="Chỉnh sửa thông tin quản trị viên">
        <CreateAccountForm userData={userData} />
      </ContentWrapper>
    </PrimaryLayout>
  )
}

export default EditUserPage
