/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react"

const AuthContext = createContext(null)

const getStoredAuth = () => {
  const storedToken = localStorage.getItem("token")
  const storedUser = localStorage.getItem("user")

  if (!storedToken || !storedUser) {
    return { token: null, user: null }
  }

  try {
    return {
      token: storedToken,
      user: JSON.parse(storedUser),
    }
  } catch {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth)
  const { user, token } = auth

  const login = useCallback((nextToken, nextUser) => {
    localStorage.setItem("token", nextToken)
    localStorage.setItem("user", JSON.stringify(nextUser))
    setAuth({ token: nextToken, user: nextUser })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setAuth({ token: null, user: null })
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
    }),
    [user, token, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
