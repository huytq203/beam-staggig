import { createContext } from 'react';
import {
  AuthenticationRequestProps,
  AuthenticationSignOutRequestProps,
  authInitialState,
  signInType,
} from './AuthenticationProvider';

export const AuthenticationContext = createContext({
  signIn: (a: signInType, b: AuthenticationRequestProps) => {},
  signOut: (config: AuthenticationSignOutRequestProps = {}) => {},
  state: authInitialState,
  profile: {
    accountType: '',
    avatar: '',
    createdBy: '',
    createdDate: '',
    dob: '',
    email: null,
    enabled: null,
    firstName: null,
    firstTimeLogin: null,
    gender: null,
    id: null,
    language: null,
    lastName: null,
    modifiedBy: null,
    modifiedDate: null,
    passport: null,
    phoneNumber: null,
    role: null,
    status: null,
    username: null,
    roles: [],
  },
  authCheckByRole: (
    allowedRoles: any[] = [],
    accessData?: any,
    callback: any = () => {}
  ) => {},
});
