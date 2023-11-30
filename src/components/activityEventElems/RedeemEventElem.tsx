import { plural, t, Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import RichNote from 'components/RichNote/RichNote'
import { TokenAmount } from 'components/TokenAmount'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { BigNumber } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils.js'
import { ProjectEventsQuery } from 'generated/graphql'
import { useContext } from 'react'
import { ActivityEvent } from './ActivityElement/ActivityElement'

function decodeJB721DelegateRedeemMetadata(
  metadata: string,
): [string, string, BigNumber[]] | undefined {
  try {
    const decoded = defaultAbiCoder.decode(
      ['bytes32', 'bytes4', 'uint256[]'],
      metadata,
    ) as [string, string, BigNumber[]]

    return decoded
  } catch (e) {
    return undefined
  }
}

const getRedeemedTokenIds = (metadata: string) => {
  try {
    const [, , redeemedTokenIds] = metadata
      ? decodeJB721DelegateRedeemMetadata(metadata) ?? []
      : []
    return redeemedTokenIds
  } catch (e) {
    return []
  }
}

export default function RedeemEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['redeemEvent']
  withProjectLink?: boolean
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)

  if (!event) return null

  const redeemedTokenIds = getRedeemedTokenIds(event.metadata)

  const redeemedTokens = (
    <TokenAmount amountWad={event.amount} tokenSymbol={tokenSymbol} />
  )

  return (
    <ActivityEvent
      header={t`Redeemed`}
      event={event}
      withProjectLink={withProjectLink}
      subject={
        <div className="text-base font-medium">
          {redeemedTokenIds && redeemedTokenIds.length > 0 ? (
            <div>
              <div>
                {plural(redeemedTokenIds.length, {
                  one: '# NFT',
                  other: '# NFTs',
                })}
              </div>
              <div className="text-xs font-normal text-grey-500 dark:text-grey-300">
                {redeemedTokens}
              </div>
            </div>
          ) : (
            <span>{redeemedTokens}</span>
          )}
        </div>
      }
      extra={
        <div className="text-grey-900 dark:text-slate-100">
          <Trans>
            <ETHAmount amount={event.returnAmount} /> reclaimed from project
          </Trans>
          {event.memo && <RichNote className="mt-4" note={event.memo} />}
        </div>
      }
    />
  )
}
