import { PrimaryLayout } from '@components/widgets/Layouts'
import SettingUser from 'src/domain/settings/components/SettingUser'

export async function getServerSideProps(context: any) {
  return {
    props: {
      // Will be passed to the page component as props
    },
  }
}

export default function SettingPage() {
  return (
    <PrimaryLayout>
      <SettingUser />
    </PrimaryLayout>
  )
}
