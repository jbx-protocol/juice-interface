import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

interface FathomInstance {
  trackGoal: (eventId: string, value: number) => void
}

export let fathom: FathomInstance | undefined = undefined
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fathom = (window as any).fathom
}

export const trackFathomGoal = (eventId: string) => {
  fathom?.trackGoal(eventId, 0)
}

/**
 * @link https://vercel.com/guides/deploying-nextjs-using-fathom-analytics-with-vercel
 */
export function useFathom() {
  const router = useRouter()

  useEffect(
    () => {
      if (process.env.NODE_ENV !== 'production') {
        return
      }
      // Initialize Fathom when the app loads
      // Example: yourdomain.com
      //  - Do not include https://
      //  - This must be an exact match of your domain.
      //  - If you're using www. for your domain, make sure you include that here.
      Fathom.load('ERYRRJSV', {
        includedDomains: ['juicebox.money', 'www.juicebox.money'],
      })

      function onRouteChangeComplete() {
        Fathom.trackPageview()
      }
      // Record a pageview when route changes
      router.events.on('routeChangeComplete', onRouteChangeComplete)

      // Unassign event listener
      return () => {
        router.events.off('routeChangeComplete', onRouteChangeComplete)
      }
    },
    [], // eslint-disable-line
  )
}
