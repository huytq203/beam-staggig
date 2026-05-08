import { Modal } from '@douyinfe/semi-ui'
import { SMSConfigForm } from './form'

interface ConfigurationDetailModalProps {
  visible: boolean
  onCancel: () => void
}
export const ConfigurationDetailModal = (
  props: ConfigurationDetailModalProps,
) => {
  const { visible, onCancel } = props
  return (
    <Modal
      title="Property Config"
      visible={visible}
      fullScreen
      className="h-full"
      bodyStyle={{
        overflow: 'auto',
      }}
      onCancel={onCancel}
    >
      <SMSConfigForm />
    </Modal>
  )
}
