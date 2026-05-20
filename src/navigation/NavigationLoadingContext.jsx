import { createContext, useContext } from 'react'

export const NavigationLoadingContext = createContext(() => {})

export function useNavigationLoading() {
  return useContext(NavigationLoadingContext)
}
