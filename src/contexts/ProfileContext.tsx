import { UserSevice } from '@services/users'
import jwt_decode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { getCookie } from 'src/helpers/cookies.helper'

export let setProfile = (profile: any) => {}

export interface ProfileContextProps {
  profile?: any
  authorized?: boolean
  getProfile?: (callback?: any) => void
  setProfile?: any
  hasCampusAdmin?: boolean
}

export const ProfileContext = React.createContext<ProfileContextProps>({})

export function ProfileProvider(props: any) {
  const [profile, setUserProfile] = useState<any>()

  useEffect(() => {
    getProfile()
    setProfile = (profile?: any) => {
      setUserProfile(profile && profile)
    }
  }, [])

  const getProfile = async () => {
    //const profileCookies = getCookie('profile')
    const access_token = getCookie('ACCESS_TOKEN')
    if (access_token) {
      const decoded: any = jwt_decode(access_token)
      if (decoded && decoded?.exp > Date.now()) {
        const profileInfor = await UserSevice.getUser(decoded?.sub)
        if (profileInfor) {
          setUserProfile(profileInfor)
        }
      }
    }
  }

  return (
    <ProfileContext.Provider
      value={{
        authorized: profile === undefined ? undefined : profile != null,
        profile,
        getProfile,
        setProfile,
      }}
    >
      {props.children}
    </ProfileContext.Provider>
  )
}
