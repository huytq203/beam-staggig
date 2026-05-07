import { ContentWrapper } from '@components/widgets'
import NavSettingContent from '@modules/settings/NavSettingContent'
import SettingContent from './SettingContent'
import SettingHeader from './SettingHeader'

const SettingUser = () => {
  return (
    <ContentWrapper pageTitle="Cấu hình">
      <SettingHeader />
      <NavSettingContent />
      <SettingContent />
    </ContentWrapper>
  )
}

export default SettingUser
