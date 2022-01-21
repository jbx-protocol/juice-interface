import { Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { useContext, useState } from 'react'
import { getTerminalAddress } from 'utils/terminal-versions'

export default function MigrateV1Pt1Modal({
  visible,
  onCancel,
}: {
  visible: boolean
  onCancel: VoidFunction
}) {
  const [loadingAddToBalance, setLoadingAddToBalance] = useState<boolean>()
  const [loadingMigrate, setLoadingMigrate] = useState<boolean>()
  const { contracts, transactor } = useContext(UserContext)
  const { projectId, balance, handle } = useContext(ProjectContext)

  const needsBalance = balance?.eq(0)

  function migrate() {
    const terminalV1_1Address = getTerminalAddress('1.1')

    if (!transactor || !contracts || !projectId || !terminalV1_1Address) return

    setLoadingMigrate(true)

    transactor(
      contracts.TerminalV1,
      'migrate',
      [projectId.toHexString(), terminalV1_1Address],
      {
        onDone: () => {
          setLoadingMigrate(false)
          onCancel()
        },
      },
    )
  }

  function add1Wei() {
    if (!transactor || !contracts || !projectId) return

    setLoadingAddToBalance(true)

    transactor(
      contracts.TerminalV1,
      'addToBalance',
      [projectId.toHexString()],
      {
        value: '0x01',
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
        <a
          href="https://juicebox.notion.site/Migration-plan-1a05f62d80284cb1b8df2a3b53da341a"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans>Documentation on v1.1 contracts</Trans>
        </a>
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
