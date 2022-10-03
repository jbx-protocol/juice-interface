import { randomBytes } from 'crypto'
import useLocalStorage from 'hooks/LocalStorage'
import usePopupWindow from 'hooks/PopupWindow'
import { useEffect, useState } from 'react'

type OAuthData = {
  code: string
}

type OauthOptions = {
  client_id: string
  scope: string
  response_type?: 'code' | 'token'
  code_challenge?: 'challenge'
  code_challenge_method?: 'plain'
}

const useOauthPopupWindow = (url: string, oauthOptions: OauthOptions) => {
  const [csrfToken, setCsrfToken] = useLocalStorage(
    `oauth_csrf_token_${oauthOptions.client_id}`,
    randomBytes(16).toString('hex'),
    true,
  )

  const redirectUri = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI as string

  oauthOptions.response_type = oauthOptions.response_type ?? 'code'

  const state = `${oauthOptions.client_id};${csrfToken}`

  // prettier-ignore
  const { onOpen, windowInstance } = usePopupWindow(
    `${url}?${Object.entries(oauthOptions).map(([key, value]) => `${key}=${value}`).join("&")}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`
  )
  const [error, setError] = useState(null)
  const [authData, setAuthData] = useState<OAuthData | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return

    const windowInstanceOpenInitially = !windowInstance.closed

    window.localStorage.removeItem('oauth_popup_data')
    setIsAuthenticating(true)

    new Promise<OAuthData>((resolve, reject) => {
      const interval = setInterval(() => {
        try {
          const { data, type } = JSON.parse(
            window.localStorage.getItem('oauth_popup_data') as string,
          )
          if (type === 'OAUTH_ERROR') {
            clearInterval(interval)
            const title = data?.error ?? 'Unknown error'
            const errorDescription = data?.errorDescription ?? ''
            reject({ error: title, errorDescription })
          }
          if (type === 'OAUTH_SUCCESS') {
            clearInterval(interval)
            resolve({ code: data })
          }
        } catch {
          // ignore
        }
      }, 500)
    })
      .then(setAuthData)
      .catch(setError)
      .finally(() => {
        if (windowInstanceOpenInitially) {
          const closeInterval = setInterval(() => {
            setIsAuthenticating(false)
            clearInterval(closeInterval)
            windowInstance.close()
          }, 500)
        }

        setCsrfToken(randomBytes(16).toString('hex'))
        window.localStorage.removeItem('oauth_popup_data')
        setIsAuthenticating(false)
        window.localStorage.setItem('oauth_window_should_close', 'true')
      })
  }, [windowInstance, redirectUri, csrfToken, setCsrfToken])

  return {
    authData,
    error,
    onOpen: () => {
      setError(null)
      onOpen()
    },
    isAuthenticating,
  }
}

export const useTwitterAuth = () =>
  useOauthPopupWindow('https://twitter.com/i/oauth2/authorize', {
    client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID as string,
    scope: 'offline.access users.read tweet.read',
    code_challenge: 'challenge',
    code_challenge_method: 'plain',
  })
