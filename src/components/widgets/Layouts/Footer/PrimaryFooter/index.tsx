import { IconBytedanceLogo } from '@douyinfe/semi-icons'
import { Layout } from '@douyinfe/semi-ui'

const PrimaryFooter = () => {
  const { Footer } = Layout

  return (
    <Footer className="flex justify-between p-4 border-t text-sm bg-gray-800 text-white">
      <span className="flex items-center gap-4">
        <IconBytedanceLogo size="large" />
        <span>Copyright © 2022 BEAM. All Rights Reserved. </span>
      </span>
      <span className="flex gap-4">
        <span>Customer Service</span>
        <span>Feedback</span>
      </span>
    </Footer>
  )
}

export default PrimaryFooter
