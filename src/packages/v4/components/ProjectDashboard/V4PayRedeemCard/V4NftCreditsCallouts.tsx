import { CubeIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { formatEther } from 'juice-sdk-core'
import { useV4UserNftCredits } from 'packages/v4/contexts/V4UserNftCreditsProvider'
import { useProjectPageQueries } from 'packages/v4/views/V4ProjectDashboard/hooks/useProjectPageQueries'

export function V4NftCreditsCallouts() {
  const { setProjectPageTab } = useProjectPageQueries()
  const { data: nftCredits } = useV4UserNftCredits()

  if (!nftCredits || nftCredits <= 0n) {
    return null
  }

  return (
    <div
      className={
        'flex flex-col gap-5 rounded-lg border border-grey-200 bg-white p-5 pb-6 shadow-[0_6px_16px_0_rgba(0,_0,_0,_0.04)] dark:border-slate-600 dark:bg-slate-700'
      }
    >
      <div className="flex-start flex items-center gap-1.5">
        <div className="flex items-center justify-center rounded-full bg-bluebs-50 p-1 dark:bg-bluebs-500">
          <CubeIcon className="text-gray-500 h-5 w-5 stroke-2 text-bluebs-600 dark:text-black" />
        </div>
        <Trans>
          You have{' '}
          <strong className="font-bold">{formatEther(nftCredits)} ETH</strong>{' '}
          of unclaimed NFT credits
        </Trans>
      </div>
      <Button
        type="default"
        className="border-none bg-bluebs-50 font-medium dark:bg-bluebs-500 dark:text-black"
        onClick={() => setProjectPageTab('nft_rewards')}
      >
        Browse NFTs
      </Button>
    </div>
  )
}
