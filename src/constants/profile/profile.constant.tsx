
export enum NavProfileEnum {
  Profile = 0,
  ChangePassword = 1,
  Setting = 2,
}

export type NavProfileSelect = {
  type: NavProfileEnum
  label?: string
  icon?: any
  content?: any
  key: string
}

export const NavProfileType: Array<NavProfileSelect> = [
  {
    type: NavProfileEnum.Profile,
    // content: <EditProfile />,
    key: 'profile',
  },
  {
    type: NavProfileEnum.ChangePassword,
    // content: <ChangePassword />,
    key: 'changePassword',
  },
  {
    type: NavProfileEnum.Setting,
    // content: <ChangePassword />,
    key: 'setting',
  },
]

export function getContentNavProfile(keySelect: string) {
  return NavProfileType.find((x) => x.key === keySelect)
}
