import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { useParticipantsQuery, useProjectQuery } from 'generated/v4v5/graphql'
import {
  useJBChainId,
  useJBContractContext,
  useJBTokenContext,
} from 'juice-sdk-react'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { isZeroAddress } from 'utils/address'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { useV4V5TotalTokenSupply } from '../../../hooks/useV4V5TotalTokenSupply'
import HoldersList from './HoldersList'
import TokenDistributionChart from './TokenDistributionChart'

export const V4V5TokenHoldersModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) => {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()
  const { version } = useV4V5Version()

  const { token } = useJBTokenContext()
  const tokenAddress = token?.data?.address
  const tokenSymbol = token?.data?.symbol

  const { data: totalTokenSupply } = useV4V5TotalTokenSupply()

  const { data: project } = useProjectQuery({
    client: bendystrawClient,
    variables: {
      projectId: Number(projectId),
      chainId: Number(chainId),
      version: version
    },
    skip: !projectId || !open || !chainId,
  })

  const { data, loading } = useParticipantsQuery({
    client: bendystrawClient,
    variables: {
      orderDirection: 'desc',
      orderBy: 'balance',
      where: {
        suckerGroupId: project?.project?.suckerGroupId,
      },
    },
    skip: !project?.project?.suckerGroupId,
  })

  const allParticipants = data?.participants

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
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
                  Token address:{' '}
                  <EthereumAddress address={tokenAddress} chainId={chainId} />
                </Trans>
              </div>
            )}
            <div>{allParticipants?.items.length} wallets</div>
          </div>

          <div className="flex items-center justify-center">
            <TokenDistributionChart
              participants={allParticipants?.items}
              isLoading={loading}
              tokenSupply={totalTokenSupply}
            />
          </div>

          <HoldersList
            projectId={Number(projectId)}
            tokenSymbol={tokenSymbol}
            totalTokenSupply={totalTokenSupply}
          />
        </div>
      </div>
    </Modal>
  )
}
