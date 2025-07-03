import { Trans } from '@lingui/macro'

import { SafetyOutlined } from '@ant-design/icons'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { NETWORKS } from 'constants/networks'
import { JBChainId } from 'juice-sdk-react'
import Image from 'next/legacy/image'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import { useMemo } from 'react'
import { safeTxUrl } from 'utils/safe'
import { useAccount } from 'wagmi'
import DeploySuccessHero from '/public/assets/images/create-success-hero.webp'

export const SafeQueueSuccess = ({
  chains,
}: {
  chains: JBChainId[]
}) => {
  const { address: userAddress } = useAccount()

  const safeUrls = useMemo(() => {
    if (!userAddress) return []
    
    return chains.map(chainId => ({
      chainId,
      chainName: NETWORKS[chainId]?.label || `Chain ${chainId}`,
      url: safeTxUrl({ chainId, safeAddress: userAddress }),
    }))
  }, [chains, userAddress])

  return (
    <div className="mt-4 flex flex-col items-center justify-center text-center">
      <Image
        alt="Project transactions queued successfully image"
        src={DeploySuccessHero}
        width={380}
        height={380}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      <div className="pt-4 font-display text-5xl font-bold">
        <Trans>Congratulations!</Trans>
      </div>
      <div className="my-4 text-lg font-normal text-grey-600 dark:text-slate-200">
        <Trans>Your project launch transactions have been queued to your Safe wallet!</Trans>
      </div>
      
      <div className="mb-6 max-w-lg text-sm text-grey-500 dark:text-slate-400">
        <Trans>
          Your project launch transactions are now waiting for execution in your Safe wallet. 
          Once the required signatures are collected, you can execute them through the Safe interface.
        </Trans>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border px-6 py-4 dark:border-slate-300">
        <div className="text-sm font-medium text-grey-600 dark:text-slate-200 mb-2">
          <Trans>Execute transactions in Safe:</Trans>
        </div>
        {safeUrls.map(({ chainId, chainName, url }) => (
          <ExternalLink key={chainId} href={url}>
            <Button
              icon={<SafetyOutlined />}
              type="default"
              className="flex items-center gap-2 w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <ChainLogo width={18} height={18} chainId={chainId} />
                <span>{chainName}</span>
              </div>
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </Button>
          </ExternalLink>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <ExternalLink href="https://discord.gg/juicebox">
          <Button
            type="text"
            className="text-bluebs-500 hover:text-bluebs-400"
          >
            <span>
              <Trans>Get help in JuiceboxDAO Discord</Trans>
            </span>
          </Button>
        </ExternalLink>
      </div>
    </div>
  )
}
