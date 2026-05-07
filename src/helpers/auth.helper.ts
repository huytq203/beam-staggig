import { UserRole } from '@constants/auth.constants'

export const AuthHelper = {
  allowRoleCheck(allowedRoles: UserRole[] = [], userRoles: any) {
    if (!userRoles) return false
    if (!allowedRoles || (allowedRoles && !allowedRoles.length)) return true

    let allowed = false
    for (const role of userRoles) {
      if (allowedRoles.includes(role)) {
        allowed = true
        break
      }
    }
    return allowed
  },
}
