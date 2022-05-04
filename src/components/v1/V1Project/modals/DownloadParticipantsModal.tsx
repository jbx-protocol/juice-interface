import { t, Trans } from '@lingui/macro'
import { Modal, notification } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import UntrackedErc20Notice from 'components/shared/UntrackedErc20Notice'

import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { NetworkName } from 'models/network-name'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fromWad } from 'utils/formatNumber'
import { querySubgraphExhaustive } from 'utils/graph'

import { readProvider } from 'constants/readProvider'
import { indexedProjectERC20s } from 'constants/v1/indexedProjectERC20s'

export default function DownloadParticipantsModal({
  visible,
  onCancel,
}: {
  visible: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const [latestBlockNumber, setLatestBlockNumber] = useState<number>()
  const [blockNumber, setBlockNumber] = useState<number>()
  const [loading, setLoading] = useState<boolean>()
  const { projectId, tokenSymbol, handle } = useContext(V1ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useEffect(() => {
    readProvider.getBlockNumber().then(val => {
      setLatestBlockNumber(val)
      setBlockNumber(val)
    })
  }, [])

  const download = useCallback(async () => {
    if (blockNumber === undefined || !projectId) return

    setLoading(true)

    const rows = [
      [
        t`Wallet address`,
        `Total ${tokenSymbol ?? t`token`} balance`,
        t`Staked balance`,
        t`Unstaked balance`,
        t`Total ETH paid`,
        t`Last paid timestamp`,
      ], // CSV header row
    ]

    try {
      const participants = await querySubgraphExhaustive({
        entity: 'participant',
        keys: [
          'wallet',
          'totalPaid',
          'balance',
          'stakedBalance',
          'unstakedBalance',
          'lastPaidTimestamp',
        ],
        orderBy: 'balance',
        orderDirection: 'desc',
        block: {
          number: blockNumber,
        },
        where: {
          key: 'project',
          value: projectId.toString(),
        },
      })

      if (!participants) {
        notification.error({
          message: t`Error loading holders`,
        })
        throw new Error('No data.')
      }

      participants.forEach(p => {
        let date = new Date((p.lastPaidTimestamp ?? 0) * 1000).toUTCString()

        if (date.includes(',')) date = date.split(',')[1]

        rows.push([
          p.wallet ?? '--',
          fromWad(p.balance),
          fromWad(p.stakedBalance),
          fromWad(p.unstakedBalance),
          fromWad(p.totalPaid),
          date,
        ])
      })

      const csvContent =
        'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute(
        'download',
        `@${handle}_holders-block${blockNumber}.csv`,
      )
      document.body.appendChild(link)

      link.click()

      setLoading(false)
    } catch (e) {
      console.error('Error downloading participants', e)
      setLoading(false)
    }
  }, [projectId, setLoading, blockNumber, handle, tokenSymbol])

  const erc20IsUntracked =
    tokenSymbol &&
    projectId &&
    !indexedProjectERC20s[
      process.env.REACT_APP_INFURA_NETWORK as NetworkName
    ]?.includes(projectId)

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={download}
      okText={t`Download CSV`}
      okButtonProps={{ type: 'primary' }}
      cancelText={t`Close`}
      confirmLoading={loading}
      centered
    >
      <div>
        <h4>
          <Trans>Download CSV of {tokenSymbol || t`token`} holders</Trans>
        </h4>

        {erc20IsUntracked && (
          <p style={{ padding: 10, background: colors.background.l1 }}>
            (
            <UntrackedErc20Notice tokenSymbol={tokenSymbol} />
          </p>
        )}

        <label style={{ display: 'block', marginTop: 20, marginBottom: 5 }}>
          <Trans>Block number</Trans>
        </label>
        <FormattedNumberInput
          value={blockNumber?.toString()}
          onChange={val => setBlockNumber(val ? parseInt(val) : undefined)}
          accessory={
            <InputAccessoryButton
              content={t`Latest`}
              onClick={() => setBlockNumber(latestBlockNumber)}
              disabled={blockNumber === latestBlockNumber}
            />
          }
        />
      </div>
    </Modal>
  )
}
