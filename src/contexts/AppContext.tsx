import React, { useState } from 'react'

export let setProfile = (profile: any) => {}

export interface AppContextProps {
  currentBreadcrumb?: any
  setCurrentBreadcrumb?: any
}

export const AppContext = React.createContext<AppContextProps>({})

export function AppProvider(props: any) {
  const [currentBreadcrumb, setCurrentBreadcrumb] = useState<any>()

  return (
    <AppContext.Provider
      value={{
        currentBreadcrumb: currentBreadcrumb,
        setCurrentBreadcrumb: setCurrentBreadcrumb,
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}
