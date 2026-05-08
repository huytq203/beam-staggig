import { useAuth } from '@contexts/authentication';
import { AuthHelper } from '@helpers/auth.helper';
import React from 'react';

export interface ProtectedProps {
  allowedRoles: any;
  children: any;
}

export const ProtectedWrapper = (props: ProtectedProps) => {
  const { children, allowedRoles } = props;
  const { profile } = useAuth();

  const getAccess = () => {
    const userRoles = profile?.roles;
    return AuthHelper.allowRoleCheck(allowedRoles, userRoles);
  };

  if (!getAccess()) return <React.Fragment />;

  return <>{children}</>;
};
