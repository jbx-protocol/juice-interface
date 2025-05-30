import { Trans, t } from '@lingui/macro'

import EtherscanLink from 'components/EtherscanLink'
import { Hash } from 'viem'
import Image from 'next/image'
import { JBChainId } from 'juice-sdk-core'

export function TxLoadingContent({
  txHash,
  chainId,
}: {
  txHash: Hash
  chainId?: JBChainId
}) {
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
        <Trans>Transaction pending...</Trans>
      </h2>
      <p className="text-center">
        <Trans>
          Your transaction has been submitted and is awaiting confirmation.
        </Trans>
      </p>
      {txHash ? (
        <p>
          <EtherscanLink value={txHash} type="tx" chainId={chainId}>
            <Trans>View on Etherscan</Trans>
          </EtherscanLink>
        </p>
      ) : null}
    </div>
  )
}
