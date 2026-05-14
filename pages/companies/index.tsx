import { PrimaryLayout } from '@components/widgets/Layouts'
import { CompanyGridList } from '@modules/companies/CompanyGridList'

export async function getServerSideProps(props: any) {
  return {
    props: {
      
    },
  }
}

export default function CompanyPage() {
  return (
    <PrimaryLayout>
      <CompanyGridList showSelection={true} showDelete={true} showEdit={true} />
    </PrimaryLayout>
  )
}
