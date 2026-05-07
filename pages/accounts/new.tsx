import { PrimaryLayout } from '@components/widgets/Layouts'
import { Card } from '@douyinfe/semi-ui'
import { Container, PageBreadcrumb } from '@components/widgets'
import { CreateAccountForm } from '@modules/accounts/form/CreateAccountForm'
export async function getServerSideProps(props: any) {
  return {
    props: {
      
      // Will be passed to the page component as props
    },
  }
}

export default function CreateAccountPage() {
  return (
    <div>
      <PrimaryLayout>
        <Container>
          <PageBreadcrumb title="Thêm mới quản trị viên" />
          <Card
            title="Thông tin tài khoản"
            className="border-none rounded shadow-md overflow-auto"
          >
            <CreateAccountForm />
          </Card>
        </Container>
      </PrimaryLayout>
    </div>
  )
}
