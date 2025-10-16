import { useCallback, useMemo } from 'react'

import { useRouter } from 'next/router'
import { V4V5CurrencyOption } from 'packages/v4v5/models/v4CurrencyOption'

type ProjectPageTab =
  | 'activity'
  | 'about'
  | 'nft_rewards'
  | 'ruleset_payouts'
  | 'tokens'

export type ProjectPayReceipt = {
  totalAmount: {
    amount: number
    currency: V4V5CurrencyOption
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
      const { tabid, payReceipt } = router.query
      router.replace(
        {
          pathname: router.asPath.split('?')[0], // Use actual path instead of pattern to prevent encoding
          query: {
            ...(payReceipt && { payReceipt }), // Only include if it exists
            tabid: tabId,
          },
        },
        undefined,
        { shallow: true },
      )
    },
    [router],
  )

  const setProjectPayReceipt = useCallback(
    (payReceipt: ProjectPayReceipt | undefined) => {
      const { tabid } = router.query
      router.replace(
        {
          pathname: router.asPath.split('?')[0], // Use actual path instead of pattern to prevent encoding
          query: {
            ...(tabid && { tabid }), // Only include if it exists
            ...(payReceipt && { payReceipt: JSON.stringify(payReceipt) }),
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
