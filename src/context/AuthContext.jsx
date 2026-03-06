import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  clearAuthSession,
  getToken,
  getUser,
  getUserRole,
  saveAuthSession,
} from '../service/auth'
import { getMeRequest, loginRequest } from '../service/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken())
  const [user, setUser] = useState(getUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      const localToken = getToken()
      if (!localToken) {
        setLoading(false)
        return
      }

      try {
        const me = await getMeRequest()
        const normalizedUser = me?.usuario || me?.user || me
        saveAuthSession({ token: localToken, user: normalizedUser })
        setToken(localToken)
        setUser(normalizedUser)
      } catch {
        clearAuthSession()
        setToken(null)
        setUser({})
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [])

  const signIn = async (credentials) => {
    const data = await loginRequest(credentials)
    const sessionToken = data?.token
    const sessionUser = data?.usuario || data?.user

    saveAuthSession({ token: sessionToken, user: sessionUser })
    setToken(sessionToken || null)
    setUser(sessionUser || {})
    return { token: sessionToken, user: sessionUser }
  }

  const signOut = () => {
    clearAuthSession()
    setToken(null)
    setUser({})
  }

  const value = useMemo(
    () => ({
      token,
      user,
      role: getUserRole(),
      isAuthenticated: Boolean(token),
      isAdmin: getUserRole() === 'admin',
      loading,
      signIn,
      signOut,
      setUser,
    }),
    [loading, token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
