import {
  ArrowUturnLeftIcon,
  BellIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { AnnouncementLauncher } from 'contexts/Announcements/AnnouncementLauncher'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import confettiAnimationJuicebox from 'data/lottie/confetti-animation-juicebox.json'
import Lottie from 'lottie-react'
import moment from 'moment'
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { Cart } from './components/Cart'
import { CartItemBadge } from './components/Cart/components/CartItem/CartItemBadge'
import { CoverPhoto } from './components/CoverPhoto'
import { CurrentCycleCard } from './components/CurrentCycleCard'
import { FundingCycleCountdownProvider } from './components/FundingCycleCountdown/FundingCycleCountdownProvider'
import { NftRewardsCard } from './components/NftRewardsCard'
import { SmallNftSquare } from './components/NftRewardsCard/SmallNftSquare'
import { PayProjectCard } from './components/PayProjectCard'
import { ProjectCartProvider } from './components/ProjectCartProvider'
import { ProjectHeader } from './components/ProjectHeader'
import { ProjectHeaderLogo } from './components/ProjectHeader/components/ProjectHeaderLogo'
import { ProjectTabs } from './components/ProjectTabs'
import { useProjectMetadata } from './hooks'
import { useProjectPageQueries } from './hooks/useProjectPageQueries'

export const ProjectDashboard = () => {
  const {
    nftRewards: { CIDs },
  } = useContext(NftRewardsContext)
  const { projectPayReceipt } = useProjectPageQueries()
  return (
    <TransactionProvider>
      <AnnouncementLauncher>
        <FundingCycleCountdownProvider>
          <ProjectCartProvider>
            {/* // TODO: Remove pb-48, just there for testing */}
            <div className="flex w-full flex-col items-center pb-48">
              {projectPayReceipt !== undefined ? (
                <SuccessPayView />
              ) : (
                <>
                  <CoverPhoto />
                  <div className="flex w-full justify-center px-6">
                    <div className="flex w-full max-w-6xl flex-col">
                      <ProjectHeader />
                      <div className="mt-10 flex w-full gap-6">
                        <PayProjectCard className="flex-1" />
                        {CIDs?.length ? <NftRewardsCard /> : null}
                        <CurrentCycleCard />
                      </div>
                      <ProjectTabs className="mt-16" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <Cart />
          </ProjectCartProvider>
        </FundingCycleCountdownProvider>
      </AnnouncementLauncher>
    </TransactionProvider>
  )
}

const SuccessPayView = () => {
  const { name, nftPaymentSuccessModal } =
    useProjectMetadata().projectMetadata ?? {}
  const { projectPayReceipt, setProjectPayReceipt } = useProjectPageQueries()
  const nftsPurchased = useMemo(
    () => !!projectPayReceipt?.nfts.length,
    [projectPayReceipt?.nfts.length],
  )
  const [confettiVisible, setConfettiVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfettiVisible(false)
    }, 2000)
    return () => clearTimeout(timer)
  })

  const returnToProject = useCallback(() => {
    setProjectPayReceipt(undefined)
  }, [setProjectPayReceipt])

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

const SuccessButton = ({
  icon,
  text,
  onClick,
}: {
  icon: ReactNode
  text: ReactNode
  onClick?: () => void
}) => (
  <Button
    className="flex items-center gap-2 py-2 px-3.5 font-medium"
    type="link"
    icon={icon}
    onClick={onClick}
  >
    {text}
  </Button>
)

const SuccessPayCard = ({ className }: { className?: string }) => {
  const { name } = useProjectMetadata().projectMetadata ?? {}
  const { projectPayReceipt } = useProjectPageQueries()

  const transactionDateString = useMemo(() => {
    if (!projectPayReceipt?.timestamp) return null
    const timestampMs = projectPayReceipt.timestamp.getTime()
    return `${moment(timestampMs).fromNow(true)} ago`
  }, [projectPayReceipt?.timestamp])

  if (!projectPayReceipt || !transactionDateString) return null

  return (
    <div
      className={twMerge(
        'mx-auto flex w-full max-w-xl justify-between gap-3 rounded-lg border border-grey-200 p-6 shadow dark:border-slate-500 dark:bg-slate-700',
        className,
      )}
    >
      <div className="flex gap-3 text-start">
        <ProjectHeaderLogo className="h-20 w-20 bg-white" />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-grey-500 dark:text-slate-200">
            <Trans>Paid</Trans>
          </span>
          <span className="truncate text-sm font-medium">{name}</span>
          <span className="font-heading text-2xl font-medium">
            {formatCurrencyAmount(projectPayReceipt.totalAmount)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2 ">
          <span className="text-xs text-grey-500 dark:text-slate-200">
            {transactionDateString}
          </span>
          <LinkIcon className="h-4 w-4 text-black dark:text-slate-50" />
        </div>
        <EthereumAddress
          address={projectPayReceipt.fromAddress}
          withEnsAvatar
        />
      </div>
    </div>
  )
}

const SuccessNftItem = ({ id }: { id: number }) => {
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)

  const { fileUrl, name } =
    useMemo(() => {
      if (!rewardTiers) return undefined
      const nftReward = rewardTiers.find(reward => reward.id === id)
      return {
        fileUrl: nftReward?.fileUrl,
        name: nftReward?.name,
      }
    }, [id, rewardTiers]) ?? {}

  return (
    <div className="flex items-center py-5">
      <SmallNftSquare
        className="h-14 w-14"
        nftReward={{
          name: name ?? '',
          fileUrl: fileUrl ?? '',
        }}
      />
      <span className="ml-3 text-sm font-medium">{name}</span>
      <CartItemBadge className="ml-2">NFT</CartItemBadge>
    </div>
  )
}

const SuccessTokensItem = () => {
  const { projectPayReceipt } = useProjectPageQueries()

  if (
    !projectPayReceipt ||
    !projectPayReceipt.tokensReceived.length ||
    projectPayReceipt.tokensReceived === '0'
  )
    return null

  return (
    <div className="flex items-center py-5">
      <ProjectHeaderLogo className="h-14 w-14 rounded-full" />
      <div className="ml-3">
        <div>
          <span className="text-sm font-medium">
            <Trans>Project tokens</Trans>
          </span>
          <CartItemBadge className="ml-2">Token</CartItemBadge>
        </div>
        <span className="text-sm text-grey-500 dark:text-slate-200">
          {projectPayReceipt.tokensReceived}
        </span>
      </div>
    </div>
  )
}
