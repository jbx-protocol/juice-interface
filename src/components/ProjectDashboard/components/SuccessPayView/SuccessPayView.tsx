import { ArrowUturnLeftIcon, BellIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useSuccessPayView } from 'components/ProjectDashboard/hooks/useSuccessPayView'
import confettiAnimationJuicebox from 'data/lottie/confetti-animation-juicebox.json'
import Lottie from 'lottie-react'
import {
  SuccessButton,
  SuccessNftItem,
  SuccessPayCard,
  SuccessTokensItem,
} from './components'

export const SuccessPayView = () => {
  const {
    confettiVisible,
    name,
    projectPayReceipt,
    nftPaymentSuccessModal,
    nftsPurchased,
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
      <h1 className="mb-0 font-heading text-5xl font-bold">
        <Trans>Success</Trans>
      </h1>
      <h2 className="mt-3 mb-0 font-body text-lg font-normal text-grey-600 dark:text-slate-200">
        <Trans>Thank you, your payment was successful.</Trans>
      </h2>

      <div className="flex flex-col divide-y divide-grey-200 dark:divide-slate-600">
        <div className="pb-10">
          <SuccessPayCard className="mt-6" />

          <div className="mt-8 flex justify-center gap-1">
            <SuccessButton
              icon={<BellIcon className="h-5 w-5" />}
              text={<Trans>Subscribe to updates</Trans>}
            />
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
            <p>
              Lorem ipsum dolor sit amet consectetur. In felis velit vitae
              pulvinar id sollicitudin nisl. Eu id gravida viverra nisl ipsum
              venenatis feugiat mi ut. Arcu duis quis lectus vitae nunc elit in.
              Tristique aliquam platea sollicitudin nisl amet. At nisl lacus
              ornare nibh aliquam adipiscing tristique. Arcu etiam tempor
              sagittis amet. Consectetur eget quis malesuada sollicitudin
              gravida nisi in. Morbi aliquet faucibus viverra sed nulla. Sed
              libero amet proin donec. Neque interdum sit cras.
            </p>
          </div>
        )}

        {nftsPurchased && (
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
