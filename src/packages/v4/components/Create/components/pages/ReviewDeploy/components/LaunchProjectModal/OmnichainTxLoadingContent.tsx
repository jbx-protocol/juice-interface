import { NETWORKS, sortChainIds } from 'constants/networks'
import { Trans, t } from '@lingui/macro'

import { ChainLogo } from 'packages/v4/components/ChainLogo'
import EtherscanLink from 'components/EtherscanLink'
import { Hash } from 'viem'
import Image from 'next/image'
import { JBChainId } from 'juice-sdk-core'
import { RelayrGetBundleResponse } from 'juice-sdk-react'
import { Skeleton } from 'antd'

export function OmnichainTxLoadingContent({
  relayrResponse,
  chainIds,
}: {
  relayrResponse?: RelayrGetBundleResponse
  chainIds?: JBChainId[]
}) {
  // Extract transaction hashes from the completed bundle
  const chainTxHashes = relayrResponse?.transactions
    .filter(tx => tx.status.data !== undefined)
    .map(tx => ({
      chainId: tx.request.chain as JBChainId,
      // @ts-ignore
      hash: tx.status.data.transaction?.hash ?? tx.status.data.hash as Hash
    })) || []

  const sortedChainTxHashes = chainTxHashes.sort((a, b) => 
    sortChainIds([a.chainId, b.chainId]).indexOf(a.chainId) - 
    sortChainIds([a.chainId, b.chainId]).indexOf(b.chainId)
  )

  const sortedChainIds = chainIds ? sortChainIds(chainIds) : []

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Image
        src="/assets/images/orange-loading.webp"
        alt={t`Juicebox loading animation`}
        width={260}
        height={260}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      <h2 className="mt-4 font-heading text-2xl font-medium text-black dark:text-slate-100">
        <Trans>Multi-chain transaction pending...</Trans>
      </h2>
      <p className="text-center">
        <Trans>
          Your transactions have been submitted across multiple chains and are awaiting confirmation.
        </Trans>
      </p>
      
      {chainTxHashes.length > 0 ? (
        <div className="mt-4 flex flex-col gap-2">
          {sortedChainTxHashes.map(({ chainId, hash }) => (
            <div key={chainId} className="flex items-center gap-2">
              <ChainLogo chainId={chainId} />
              <EtherscanLink value={hash} type="tx" chainId={chainId}>
                <Trans>View on {NETWORKS[chainId].label}</Trans>
              </EtherscanLink>
            </div>
          ))}
        </div>
      ) : (
        // Show skeleton with as many chains as there will be
        <div className="mt-4 flex flex-col gap-2">
          {sortedChainIds.map((chainId) => (
            <div key={chainId} className="flex items-center gap-2">
              <ChainLogo chainId={chainId} />
              <Skeleton.Input 
                active 
                size="small" 
                style={{ width: 200, height: 20 }} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
