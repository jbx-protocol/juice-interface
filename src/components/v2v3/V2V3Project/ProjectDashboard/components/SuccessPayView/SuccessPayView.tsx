import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { SubscribeButton } from 'components/buttons/SubscribeButton/SubscribeButton'
import { useSuccessPayView } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useSuccessPayView'
import confettiAnimationJuicebox from 'data/lottie/confetti-animation-juicebox.json'
import dynamic from 'next/dynamic'
import { SuccessButton } from './components/SuccessButton'
import { SuccessNftItem } from './components/SuccessNftItem'
import { SuccessPayCard } from './components/SuccessPayCard'
import { SuccessTokensItem } from './components/SuccessTokensItem'
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export const SuccessPayView = () => {
  const {
    projectId,
    confettiVisible,
    name,
    projectPayReceipt,
    nftPaymentSuccessModal,
    nftsPurchased,
    tokensReceivedDuringTx,
    returnToProject,
  } = useSuccessPayView()
  return (
    <div className="relative mt-16 w-full max-w-xl text-center">
      {confettiVisible && (
        <Lottie
          className="absolute left-1/2 mx-auto w-full -translate-x-1/2"
          animationData={confettiAnimationJuicebox}
        />
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
            {projectId && (
              <SubscribeButton
                disableTooltip
                className="flex items-center gap-2 py-2 px-3.5 font-medium text-bluebs-500 hover:text-bluebs-300 dark:text-bluebs-300 dark:hover:text-bluebs-500"
                iconClassName="h-5 w-5"
                projectId={projectId}
              >
                <Trans>Subscribe to updates</Trans>
              </SubscribeButton>
            )}
            {/* // TODO: Hidden for now */}
            {/* <SuccessButton
              icon={<TwitterOutlined className="h-5 w-5 text-xl" />}
              text={<Trans>Share on twitter</Trans>}
            /> */}
            <SuccessButton
              icon={<ArrowUturnLeftIcon className="h-5 w-5" />}
              text={<Trans>Return to project</Trans>}
              onClick={returnToProject}
            />
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
              {projectPayReceipt?.nfts.map(({ id }) => (
                <SuccessNftItem key={id} id={id} />
              ))}
              <SuccessTokensItem />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
