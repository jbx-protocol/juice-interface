import { Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import ExternalLink from 'components/shared/ExternalLink'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useAddToBalanceTx } from 'hooks/v1/transactor/AddToBalanceTx'
import { useMigrateV1ProjectTx } from 'hooks/v1/transactor/MigrateV1ProjectTx'
import { useContext, useState } from 'react'
import { getTerminalAddress } from 'utils/v1/terminals'

export default function MigrateV1Pt1Modal({
  visible,
  onCancel,
}: {
  visible: boolean
  onCancel: VoidFunction
}) {
  const [loadingAddToBalance, setLoadingAddToBalance] = useState<boolean>()
  const [loadingMigrate, setLoadingMigrate] = useState<boolean>()
  const { balance, handle } = useContext(V1ProjectContext)
  const migrateV1ProjectTx = useMigrateV1ProjectTx()
  const addToBalanceTx = useAddToBalanceTx()

  const needsBalance = balance?.eq(0)

  function migrate() {
    const newTerminalAddress = getTerminalAddress('1.1')

    if (!newTerminalAddress) return

    setLoadingMigrate(true)

    migrateV1ProjectTx(
      { newTerminalAddress },
      {
        onDone: () => {
          setLoadingMigrate(false)
          onCancel()
        },
      },
    )
  }

  function add1Wei() {
    setLoadingAddToBalance(true)

    addToBalanceTx(
      { value: BigNumber.from(1) },
      {
        onDone: () => setLoadingAddToBalance(false),
      },
    )
  }

  return (
    <Modal
      visible={visible}
      onOk={migrate}
      onCancel={onCancel}
      okText="Migrate to V1.1"
      okType="primary"
      confirmLoading={loadingMigrate}
      okButtonProps={{ disabled: needsBalance }}
    >
      <h2>
        <Trans>Migrate to Juicebox V1.1</Trans>
      </h2>
      <p>
        <Trans>
          This project is currently using the Juicebox V1 terminal contract. New
          features introduced in V1.1 allow the project owner to:
        </Trans>
      </p>
      <ul>
        <li>
          <Trans>Pause received payments</Trans>
        </li>
        <li>
          <Trans>Burn project tokens</Trans>
        </li>
        <li>
          <Trans>Mint project tokens on demand</Trans>
        </li>
      </ul>
      <p>
        <ExternalLink href="https://juicebox.notion.site/Migration-plan-1a05f62d80284cb1b8df2a3b53da341a">
          <Trans>Documentation on v1.1 contracts</Trans>
        </ExternalLink>
      </p>

      {needsBalance && (
        <div>
          <p>
            <Trans>
              <b>NOTE:</b> This project has a balance of 0. Projects cannot be
              migrated without a balance. To migrate this project, first pay it
              or use the button below to deposit 1 wei (0.000000000000000001 or
              10<sup>-18</sup> ETH).
            </Trans>
          </p>
          <p>
            <Button block onClick={add1Wei} loading={loadingAddToBalance}>
              <Trans>Deposit 1 wei to @{handle}</Trans>
            </Button>
          </p>
        </div>
      )}
    </Modal>
  )
}
