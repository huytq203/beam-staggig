import { Container, PageBreadcrumb } from '@components/widgets'
import { PrimaryLayout } from '@components/widgets/Layouts'
import { Card } from '@douyinfe/semi-ui'
import { RolePermissionForm } from '@modules/accounts/form/RolePermissionForm'
import { CompanyService } from '@services/companies'
import { UserSevice } from '@services/users'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

export async function getServerSideProps(props: any) {
  const { locale } = props
  const { userId } = props.params

  const userData = await UserSevice.getUser(userId)
  const userCompany = await CompanyService.getHrUserCompany(userId)

  return {
    props: {
      userData: userData.data,
      userCompany: userCompany,
    },
  }
}

const EditUserPage: NextPage = (props: any) => {
  const router = useRouter()

  if (status == 'unauthenticated') {
    router.push('/auth/login')
  }

  const { userData, userCompany } = props

  const { data: roles, isFetching, isLoading, error, isError } = useQuery(
    [`user_${userData?.id}_roles`, userData.id],
    () => UserSevice.getUserRoles(userData.id),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    },
  )

  return (
    <PrimaryLayout>
      <Container>
        <PageBreadcrumb title="Phân quyền" />
        <Card
          title="Thông tin quản trị viên"
          className="border-none rounded shadow-md overflow-auto"
        >
          {!isLoading && roles && (
            <RolePermissionForm
              userCompany={userCompany}
              userData={userData}
              roles={roles}
            />
          )}
        </Card>
      </Container>
    </PrimaryLayout>
  )
}

export default EditUserPage
