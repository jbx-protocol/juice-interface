import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid'
import { t, Trans } from '@lingui/macro'
import { JuiceModal } from 'components/modals/JuiceModal'
import { NETWORKS } from 'constants/networks'
import { JBChainId } from 'juice-sdk-core'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import { ChainSelect } from 'packages/v4/components/ChainSelect'
import React from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { twMerge } from 'tailwind-merge'
import { sepolia } from 'viem/chains'

export const LaunchProjectModal: React.FC<{
  className?: string
  open: boolean
  setOpen: (open: boolean) => void
}> = props => {
  const createData = useAppSelector(state => state.creatingV2Project)
  const selectedChains = React.useMemo(() => {
    return (
      Object.entries(createData.selectedRelayrChainIds)
        .filter(c => c[1])
        .map(c => Number(c[0])) as JBChainId[]
    ).map(c => ({
      chainId: c,
      label: NETWORKS[c].label,
    }))
  }, [createData.selectedRelayrChainIds])

  return (
    <JuiceModal
      className="max-w-lg"
      title={t`Launch project`}
      okText={t`Launch project`}
      cancelText={t`Cancel`}
      open={props.open}
      setOpen={props.setOpen}
    >
      <div className="flex flex-col divide-y divide-grey-200 dark:divide-grey-800">
        <div className="flex items-start gap-4 pb-6">
          <div className="flex-1">
            <Trans>Gas quote</Trans>
            <button className="mt-1 flex h-12 w-full items-center justify-between rounded-lg border border-grey-100 bg-grey-50 px-3">
              <div className="flex items-center gap-2.5">
                <GasIcon className="h-5 w-5" />
                <div className="text-base font-medium leading-none">$11.23</div>
              </div>
              <ArrowPathIcon className="h-6 w-6 text-grey-600" />
            </button>
          </div>
          <div className="flex-1">
            <Trans>Pay gas on</Trans>
            {/* // TODO: use correct values and wire up */}
            <ChainSelect
              className="mt-1 h-12"
              showTitle
              value={sepolia.id}
              onChange={() => {}}
              suckers={[{ peerChainId: sepolia.id, projectId: -1n }]}
            />
          </div>
        </div>
        <div className="py-6">
          <span>Chains to deploy</span>
          <div className="mt-6 flex flex-col gap-6">
            {selectedChains.map(chain => (
              <ChainIdentifier
                key={chain.chainId}
                chainId={chain.chainId}
                label={chain.label}
                state="ready"
              />
            ))}
          </div>
        </div>
        <div className="h-2"></div> {/* Spacer */}
      </div>
    </JuiceModal>
  )
}

const ChainIdentifier: React.FC<{
  chainId: JBChainId
  label: string
  state: 'ready' | 'waiting' | 'deploying' | 'success' | 'error'
}> = ({ chainId, label, state }) => {
  return (
    <div
      key={chainId}
      className={twMerge(
        'flex items-center justify-between gap-5',
        state === 'waiting' && 'opacity-40',
        state === 'error' && 'text-error-500',
      )}
    >
      <div className="flex items-center gap-2">
        <ChainLogo height={24} width={24} chainId={chainId} />
        <span className="font-medium">{label}</span>
      </div>
      {state === 'waiting' ? (
        <EllipsisHorizontalIcon className="h-5 w-5" />
      ) : state === 'deploying' ? (
        <LoadingIcon className="animate-spin" />
      ) : state === 'success' ? (
        <CheckCircleIcon className="h-5 w-5 text-bluebs-500" />
      ) : state === 'error' ? (
        <ExclamationCircleIcon className="h-5 w-5 text-error-500" />
      ) : null}
    </div>
  )
}

const LoadingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5"
      stroke="#5777EB"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)

const GasIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_246_7385)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.5943 0.819553C12.907 0.52015 13.4035 0.530514 13.7033 0.8427L17.0345 4.31113C17.2492 4.49787 17.4298 4.72288 17.5654 4.97555C17.724 5.24738 17.8432 5.57356 17.8432 5.94855V14.0737C17.8432 15.2855 16.8593 16.2657 15.647 16.2657C14.4342 16.2657 13.4509 15.2839 13.4509 14.0728V12.2713C13.4509 11.8388 13.0999 11.4881 12.6667 11.4881H12.3529V17.049C12.3529 17.103 12.3502 17.1565 12.3448 17.2091C12.3149 17.5033 12.2035 17.7734 12.0335 17.9965C11.747 18.3726 11.294 18.6154 10.7843 18.6154H4.50979C3.96833 18.6154 3.49095 18.3414 3.20906 17.9248C3.03993 17.6748 2.94116 17.3734 2.94116 17.049V3.73436C2.94116 2.4367 3.99461 1.38474 5.2941 1.38474H9.99999C11.2995 1.38474 12.3529 2.4367 12.3529 3.73436V9.92172H12.6667C13.9661 9.92172 15.0196 10.9737 15.0196 12.2713V14.0728C15.0196 14.4188 15.3005 14.6994 15.647 14.6994C15.9942 14.6994 16.2745 14.4191 16.2745 14.0737V8.29991C16.0292 8.3865 15.7652 8.43361 15.4902 8.43361C14.1907 8.43361 13.1373 7.38165 13.1373 6.08398C13.1373 5.13522 13.7003 4.31778 14.511 3.94682L12.5712 1.92694C12.2714 1.61475 12.2818 1.11895 12.5943 0.819553ZM15.9685 5.46322C15.8361 5.36136 15.6702 5.30078 15.4902 5.30078C15.057 5.30078 14.7059 5.65143 14.7059 6.08398C14.7059 6.51654 15.057 6.8672 15.4902 6.8672C15.9234 6.8672 16.2745 6.51654 16.2745 6.08398C16.2745 5.95941 16.2454 5.84162 16.1935 5.73705C16.1414 5.65459 16.0666 5.56369 15.9685 5.46322ZM5.2941 11.5664C4.86094 11.5664 4.50979 11.9171 4.50979 12.3496C4.50979 12.7822 4.86094 13.1329 5.2941 13.1329H9.99999C10.4332 13.1329 10.7843 12.7822 10.7843 12.3496C10.7843 11.9171 10.4332 11.5664 9.99999 11.5664H5.2941ZM5.2941 14.6992C4.86094 14.6992 4.50979 15.0499 4.50979 15.4825C4.50979 15.9151 4.86094 16.2656 5.2941 16.2656H9.99999C10.4332 16.2656 10.7843 15.9151 10.7843 15.4825C10.7843 15.0499 10.4332 14.6992 9.99999 14.6992H5.2941Z"
          fill="#737373"
        />
      </g>
      <defs>
        <clipPath id="clip0_246_7385">
          <rect
            width="20"
            height="18.797"
            fill="white"
            transform="translate(0 0.601501)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
