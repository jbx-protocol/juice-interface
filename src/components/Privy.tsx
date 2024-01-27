import { PrivyProvider } from '@privy-io/react-auth'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/networkName'
import { createContext, useCallback, useState } from 'react'
import { goerli, mainnet } from 'viem/chains'

const chain = readNetwork.name === NetworkName.mainnet ? mainnet : goerli

export const PrivyContext = createContext<{
  addLoginHandler: (handler: VoidFunction) => string
  removeLoginHandler: (handlerId: string) => void
}>({
  addLoginHandler: () => {
    throw new Error('PrivyContext not initialized')
  },
  removeLoginHandler: () => {
    throw new Error('PrivyContext not initialized')
  },
})

export const Privy = ({ children }: { children: React.ReactNode }) => {
  const [loginHandlers, setLoginHandlers] = useState<
    Record<string, VoidFunction>
  >({})

  const handleLogin = useCallback(() => {
    Object.values(loginHandlers).forEach(handler => handler())
  }, [loginHandlers])

  const addLoginHandler = useCallback((handler: VoidFunction) => {
    const handlerId = Math.random().toString()
    setLoginHandlers(loginHandlers => ({
      ...loginHandlers,
      [handlerId]: handler,
    }))
    return handlerId
  }, [])

  const removeLoginHandler = useCallback((handlerId: string) => {
    setLoginHandlers(loginHandlers => {
      const newLoginHandlers = { ...loginHandlers }
      delete newLoginHandlers[handlerId]
      return newLoginHandlers
    })
  }, [])

  return (
    <PrivyContext.Provider value={{ addLoginHandler, removeLoginHandler }}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ''}
        onSuccess={handleLogin}
        config={{
          supportedChains: [chain],
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://juicebox.money/assets/juice-logo-full_black.png',
          },
          fiatOnRamp: {
            useSandbox: true, // This defaults to false
          },
          embeddedWallets: {
            createOnLogin: 'all-users',
          },
        }}
      >
        {children}
      </PrivyProvider>
    </PrivyContext.Provider>
  )
}
