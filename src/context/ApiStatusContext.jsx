/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { registerApiStatusController } from "../services/api.js"

const ApiStatusContext = createContext(null)

export function ApiStatusProvider({ children }) {
  const [apiStatus, setApiStatus] = useState({
    isWakingUp: false,
    hasWokenUp: false,
  })

  useEffect(() => {
    const unregister = registerApiStatusController({
      sync: setApiStatus,
    })

    return unregister
  }, [])

  const value = useMemo(() => apiStatus, [apiStatus])

  return <ApiStatusContext.Provider value={value}>{children}</ApiStatusContext.Provider>
}

export function useApiStatus() {
  const context = useContext(ApiStatusContext)

  if (!context) {
    throw new Error("useApiStatus must be used within ApiStatusProvider")
  }

  return context
}
