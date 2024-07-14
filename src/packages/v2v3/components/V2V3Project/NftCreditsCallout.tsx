import { CubeIcon } from "@heroicons/react/24/outline"
import { Trans } from "@lingui/macro"
import { Button } from "antd"
import { useWallet } from "hooks/Wallet"
import { useNftCredits } from "packages/v2v3/hooks/JB721Delegate/useNftCredits"
import { fromWad } from "utils/format/formatNumber"
import { useProjectPageQueries } from "./ProjectDashboard/hooks/useProjectPageQueries"

export function NftCreditsCallout() {
  const { setProjectPageTab } = useProjectPageQueries()
  const { userAddress } = useWallet()
  const { data: nftCredits } = useNftCredits(userAddress)
  if (nftCredits && nftCredits.gt(0)) {
    return (
      <div
        className={'flex flex-col gap-5 rounded-lg border border-grey-200 bg-white p-5 pb-6 shadow-[0_6px_16px_0_rgba(0,_0,_0,_0.04)] dark:border-slate-600 dark:bg-slate-700'}
      >
        <div className='flex flex-start gap-1.5 items-center'>
          <div className='bg-bluebs-50 dark:bg-bluebs-500 rounded-full flex items-center justify-center p-1'>
            <CubeIcon className="h-5 w-5 text-gray-500 text-bluebs-600 dark:text-black stroke-2" />
          </div>
          <Trans>
            You have <strong className="font-bold">{fromWad(nftCredits)} ETH</strong> of unclaimed NFT credits
          </Trans>
        </div>
        <Button 
          type="default" 
          className="bg-bluebs-50 dark:bg-bluebs-500 border-none font-medium dark:text-black"
          onClick={() => setProjectPageTab('nft_rewards')}
        >
          Browse NFTs
        </Button>
      </div>
    )
  }
  return null
}
