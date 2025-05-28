import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { useParticipantsQuery } from 'generated/v4/graphql'
import {
  useJBChainId,
  useJBContractContext,
  useJBTokenContext,
} from 'juice-sdk-react'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { isZeroAddress } from 'utils/address'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useV4TotalTokenSupply } from '../../../hooks/useV4TotalTokenSupply'
import HoldersList from './HoldersList'
import TokenDistributionChart from './TokenDistributionChart'

export const V4TokenHoldersModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) => {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()

  const { token } = useJBTokenContext()
  const tokenAddress = token?.data?.address
  const tokenSymbol = token?.data?.symbol

  const { data: totalTokenSupply } = useV4TotalTokenSupply()

  const { data, loading } = useParticipantsQuery({
    client: bendystrawClient,
    variables: {
      orderDirection: 'desc',
      orderBy: 'balance',
      where: {
        projectId: Number(projectId),
        chainId: Number(chainId),
      },
    },
    skip: !projectId || !open || !chainId,
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
