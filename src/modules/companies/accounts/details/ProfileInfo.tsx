import { COMMON_FORMAT } from '@constants/common-format'
import { DateTimeHelper } from '@helpers/date-time.helper'

const ProfileInfo = (props: any) => {
  const { profile } = props
  const listInfor = [
    {
      label: 'Tên nhân viên',
      content: profile.name,
    },
    {
      label: 'Mã nhân viên',
      content: profile.employeeId,
    },
    {
      label: 'Số điện thoại',
      content: profile.phoneNumber,
    },
    {
      label: 'Email',
      content: profile.email,
    },
    {
      label: 'Chức vụ',
      content: profile.position ? 'Quản lý' : 'Nhân viên',
    },
    {
      label: 'Ngày sinh',
      content: DateTimeHelper.formatDateTime(profile.dob, COMMON_FORMAT.DATE),
    },
    {
      label: 'Giới tính',
      content: profile.gender == 0 ? 'Nam' : 'Nữ',
    },
    {
      label: 'CMT/CCCD/Hộ chiếu',
      content: profile.identityNumber,
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
export default ProfileInfo
