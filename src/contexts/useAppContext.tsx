import { useContext } from 'react'
import { AppContext, AppContextProps } from './AppContext'

export function useAppContext(): AppContextProps {
  const context = useContext(AppContext)

  if (!context) return {}
  const { currentBreadcrumb, setCurrentBreadcrumb } = context

  return { currentBreadcrumb, setCurrentBreadcrumb }
}
