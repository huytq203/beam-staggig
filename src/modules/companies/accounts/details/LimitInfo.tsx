import { StringHelper } from '@helpers/string.helper'
import { useRouter } from 'next/router'

const LimitInfo = (props: any) => {
  const { profile } = props
  const router = useRouter()
  const { companyId } = router.query

  const rulespay = profile.groupCode
    ? profile.groups.find((cur: any) => {
        if (cur.groupCode === profile.groupCode) {
          return cur
        }
      })
    : 'Customize'

  const listInfor = [
    {
      label: profile.payLimitType ? 'Hạn mức cố định' : 'Lương',
      content: profile.payLimitValue,
    },
    {
      label: 'Quy tắc ứng',
      content: `${rulespay.name} ( ${
        rulespay.payLimitType
          ? rulespay.payLimitValue + '%'
          : StringHelper.formatVND(rulespay.payLimitValue)
      })`,
    },
  ]
  return (
    <div className="grid grid-cols-2 gap-4">
      {listInfor.map((cur: any) => {
        return (
          <>
            <InfoDetails label={cur.label} content={cur.content} />
          </>
        )
      })}
    </div>
  )
}

const InfoDetails = (props: any) => {
  const { label, content } = props
  return (
    <div>
      <div>
        <strong>{label}</strong>
      </div>
      <div>
        <>{content}</>
      </div>
    </div>
  )
}
export default LimitInfo
