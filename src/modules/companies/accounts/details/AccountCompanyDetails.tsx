import { FormActionButton } from '@components/widgets'
import { Collapse } from '@douyinfe/semi-ui'
import { EmployeesServices } from '@services/companies/accounts'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import AccountInfo from './AccountInfo'
import LimitInfo from './LimitInfo'
import ProfileInfo from './ProfileInfo'

const AccountCompanyDetails = (props: any) => {
  const { onCancel } = props
  const router = useRouter()
  const { slug } = router?.query
  const employeeId = slug ? slug[1] : ''

  const { data, isLoading } = useQuery(['detail-employee'], () =>
    EmployeesServices.getDetailEmployee(employeeId),
  )

  if (isLoading) return <></>
  return (
    <div>
      <Collapse activeKey={['profileInfo', 'accountInfo', 'limitInfor']}>
        <Collapse.Panel
          header={<div className="text-blue-400">Thông tin cá nhân</div>}
          itemKey="profileInfo"
        >
          <ProfileInfo profile={data} />
        </Collapse.Panel>
        <Collapse.Panel
          header={<div className="text-blue-400">Thông tin tài khoản</div>}
          itemKey="accountInfo"
        >
          <AccountInfo profile={data} />
        </Collapse.Panel>
        <Collapse.Panel
          header={<div className="text-blue-400">Thông tin hạn mức</div>}
          itemKey="limitInfor"
        >
          <LimitInfo profile={data} />
        </Collapse.Panel>
      </Collapse>
      <FormActionButton showSubmitButton={false} onCancel={onCancel} />
    </div>
  )
}

export default AccountCompanyDetails
