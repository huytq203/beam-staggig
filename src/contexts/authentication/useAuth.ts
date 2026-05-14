import { useContext } from 'react'
import { AuthenticationContext } from './AuthenticationContext'

export const useAuth = () => useContext(AuthenticationContext)
