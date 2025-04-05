import { t, Trans } from '@lingui/macro'
import EtherscanLink from 'components/EtherscanLink'
import { JBChainId } from 'juice-sdk-core'
import Image from 'next/image'
import { Hash } from 'viem'

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
      <p>
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
