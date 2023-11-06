import { Trans, t } from '@lingui/macro'
import { Modal } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'

import { BigNumber, constants } from 'ethers'
import { useContext } from 'react'
import { isZeroAddress } from 'utils/address'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import TokenDistributionChart from 'components/TokenDistributionChart'
import {
  OrderDirection,
  Participant_OrderBy,
  ParticipantsDocument,
  ParticipantsQuery,
  QueryParticipantsArgs,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { paginateDepleteQuery } from 'lib/apollo/paginateDepleteQuery'
import { useQuery } from 'react-query'
import HoldersList from './HoldersList'

export default function ParticipantsModal({
  tokenSymbol,
  tokenAddress,
  totalTokenSupply,
  open,
  onCancel,
}: {
  tokenSymbol: string | undefined
  tokenAddress: string | undefined
  totalTokenSupply: BigNumber | undefined
  open: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const { projectId, pv } = useContext(ProjectMetadataContext)

  const { data: allParticipants, isLoading } = useQuery(
    [`token-holders-${projectId}-${pv}`],
    () =>
      paginateDepleteQuery<ParticipantsQuery, QueryParticipantsArgs>({
        client,
        document: ParticipantsDocument,
        variables: {
          orderDirection: OrderDirection.desc,
          orderBy: Participant_OrderBy.balance,
          where: {
            projectId,
            pv,
            balance_gt: BigNumber.from(0),
            wallet_not: constants.AddressZero,
          },
        },
      }),
    {
      staleTime: 5 * 60 * 1000, // 5 min
      enabled: Boolean(projectId && pv && open),
    },
  )

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onCancel}
      okText={t`Done`}
      cancelButtonProps={{ hidden: true }}
      destroyOnClose={true}
    >
      <div>
        <h4>
          <Trans>
            {tokenSymbolText({ tokenSymbol, capitalize: true })} holders
          </Trans>
        </h4>
        <div className="flex flex-col gap-4">
          <div>
            {tokenAddress && !isZeroAddress(tokenAddress) && (
              <div>
                <Trans>
                  Token address: <EthereumAddress address={tokenAddress} />
                </Trans>
              </div>
            )}
            <div>{allParticipants?.length} wallets</div>
          </div>

          <div className="flex items-center justify-center">
            <TokenDistributionChart
              participants={allParticipants}
              isLoading={isLoading}
              tokenSupply={totalTokenSupply}
            />
          </div>

          <HoldersList
            projectId={projectId}
            pv={pv}
            tokenSymbol={tokenSymbol}
            totalTokenSupply={totalTokenSupply}
          />
        </div>
      </div>
    </Modal>
  )
}
