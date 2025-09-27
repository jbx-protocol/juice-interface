import { useCallback, useMemo } from 'react'

import { useRouter } from 'next/router'
import { V4CurrencyOption } from 'packages/v4/models/v4CurrencyOption'

type ProjectPageTab =
  | 'activity'
  | 'about'
  | 'nft_rewards'
  | 'ruleset_payouts'
  | 'tokens'

export type ProjectPayReceipt = {
  totalAmount: {
    amount: number
    currency: V4CurrencyOption
  }
  tokensReceived: string
  timestamp: Date
  transactionHash: string | undefined
  fromAddress: string
  nfts: {
    id: number
  }[]
}

export const useProjectPageQueries = () => {
  const router = useRouter()

  const projectPageTab = router.query.tabid as ProjectPageTab | undefined
  const projectPayReceiptString = router.query.payReceipt as string | undefined

  const projectPayReceipt = useMemo(() => {
    if (!projectPayReceiptString) {
      return undefined
    }

    try {
      const parsed = JSON.parse(projectPayReceiptString) as ProjectPayReceipt
      return {
        ...parsed,
        timestamp: new Date(parsed.timestamp),
      }
    } catch (error) {
      console.error('Failed to parse projectPayReceipt', error)
      return undefined
    }
  }, [projectPayReceiptString])

  const setProjectPageTab = useCallback(
    (tabId: string) => {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, tabid: tabId },
        },
        undefined,
        { shallow: true },
      )
    },
    [router],
  )

  const setProjectPayReceipt = useCallback(
    (payReceipt: ProjectPayReceipt | undefined) => {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            payReceipt: payReceipt ? JSON.stringify(payReceipt) : undefined,
          },
        },
        undefined,
        { shallow: true },
      )
    },
    [router],
  )

  return {
    projectPageTab,
    setProjectPageTab,
    projectPayReceipt,
    setProjectPayReceipt,
  }
}
