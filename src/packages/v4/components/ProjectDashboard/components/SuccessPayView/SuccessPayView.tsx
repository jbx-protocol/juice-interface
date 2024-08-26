import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { v4ProjectRoute } from 'packages/v4/utils/routes'
import { useChainId } from 'wagmi'
import { SuccessPayCard } from './components/SuccessPayCard'
import { SuccessTokensItem } from './components/SuccessTokensItem'
import { useSuccessPayView } from './hooks/useSuccessPayView'
const Confetti = dynamic(() => import('components/Confetti'), { ssr: false })

export const SuccessPayView = () => {
  const {
    projectId,
    confettiVisible,
    name,
    projectPayReceipt,
    nftPaymentSuccessModal,
    nftsPurchased,
    tokensReceivedDuringTx,
  } = useSuccessPayView()

  const chainId = useChainId()

  return (
    <div className="relative mt-16 w-full max-w-xl text-center">
      {confettiVisible && (
        <Confetti className="absolute left-1/2 mx-auto w-full -translate-x-1/2" />
      )}
      <h1 className="mb-0 font-display text-5xl font-bold">
        <Trans>Success!</Trans>
      </h1>
      <h2 className="mx-14 mt-3 mb-0 font-body text-lg font-normal text-grey-600 dark:text-slate-200 md:px-0">
        <Trans>Thank you, your payment was successful.</Trans>
      </h2>

      <div className="flex flex-col divide-y divide-grey-200 px-4 dark:divide-slate-600 md:px-0">
        <div className="pb-10">
          <SuccessPayCard className="mt-6" />

          <div className="mt-8 flex flex-col items-center justify-center gap-1 md:flex-row">
            {/* {projectId && (
              <SubscribeButton
                disableTooltip
                className="flex items-center gap-2 py-2 px-3.5 font-medium text-bluebs-500 hover:text-bluebs-300 dark:text-bluebs-300 dark:hover:text-bluebs-500"
                iconClassName="h-5 w-5"
                projectId={projectId}
              >
                <Trans>Subscribe to updates</Trans>
              </SubscribeButton>
            )} */}

            <Link href={v4ProjectRoute({ projectId, chainId })}>
              <Button
                className="flex items-center gap-2 py-2 px-3.5 font-medium"
                type="link"
                icon={<ArrowUturnLeftIcon className="h-5 w-5 text-xl" />}
              >
                <Trans>Return to project</Trans>
              </Button>
            </Link>
          </div>
        </div>

        {nftsPurchased && nftPaymentSuccessModal && (
          <div className="flex flex-col gap-4 py-10 text-start">
            <h3 className="mb-0 font-heading text-xl font-medium">
              <Trans>A message from {name}</Trans>
            </h3>
            <p>{nftPaymentSuccessModal.content}</p>
          </div>
        )}

        {(nftsPurchased || tokensReceivedDuringTx) && (
          <div className="flex flex-col gap-4 py-10 text-start">
            <h3 className="mb-0 font-heading text-xl font-medium">
              <Trans>Your NFTs & Rewards</Trans>
            </h3>
            <div className="mt-4">
              <SuccessTokensItem />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
