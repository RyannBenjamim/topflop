import { createContext, useCallback, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '../types/auth'
import type { User, UserRole } from '../types/users'
import { findOne } from '../api/users.service'
import { getStoredToken } from '../utils/getStoredToken'

type AuthUser = {
  id: string
  role: UserRole
}

type AuthContextType = {
  user: AuthUser | null
  token: string | null
  profile: User | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  updateProfile: (changes: Partial<User>) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const toAuthUser = (payload: JwtPayload): AuthUser => ({
  id: payload.id,
  role: payload.role,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken()?.token ?? null)
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = getStoredToken()
    return stored ? toAuthUser(stored.payload) : null
  })
  const [profile, setProfile] = useState<User | null>(null)

  const logout = useCallback(() => {
    localStorage.removeItem('user_access_data')
    setToken(null)
    setUser(null)
    setProfile(null)
  }, [])

  function login(token: string) {
    try {
      localStorage.setItem('user_access_data', JSON.stringify({ token }))
      const decoded = jwtDecode<JwtPayload>(token)
      setToken(token)
      setUser(toAuthUser(decoded))
    } catch (error) {
      console.error('Failed to log in', error)
    }
  }

  function updateProfile(changes: Partial<User>) {
    setProfile(current => (current ? { ...current, ...changes } : current))
  }

  useEffect(() => {
    if (!user) return

    let isMounted = true

    findOne(user.id)
      .then(res => isMounted && setProfile(res.data))
      .catch(error => console.error('Failed to fetch the profile', error))

    return () => {
      isMounted = false
    }
  }, [user])

  useEffect(() => {
    if (!token) return

    const { exp } = jwtDecode<JwtPayload>(token)
    if (!exp) return

    const timeout = setTimeout(() => {
      logout()
      window.location.assign('/login')
    }, Math.max(exp * 1000 - Date.now(), 0))

    return () => clearTimeout(timeout)
  }, [token, logout])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        profile,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
