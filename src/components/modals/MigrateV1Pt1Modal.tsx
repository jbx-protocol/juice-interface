import { Modal } from 'antd'
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
  const [loading, setLoading] = useState<boolean>()
  const { contracts, transactor } = useContext(UserContext)
  const { projectId } = useContext(ProjectContext)

  function migrate() {
    const terminalV1_1Address = getTerminalAddress('1.1')

    if (!transactor || !contracts || !projectId || !terminalV1_1Address) return

    setLoading(true)

    transactor(
      contracts.TerminalV1,
      'migrate',
      [projectId.toHexString(), terminalV1_1Address],
      {
        onDone: () => {
          setLoading(false)
          onCancel()
        },
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
      confirmLoading={loading}
    >
      <h2>Migrate to v1.1</h2>
      <p>
        This project is currently using the Juicebox v1 terminal. New features
        introduced in v1.1 allow the project owner to:
      </p>
      <ul>
        <li>Pause received payments</li>
        <li>Burn project tokens</li>
        <li>Mint project tokens on demand</li>
      </ul>
      <p>
        <a
          href="https://juicebox.notion.site/Migration-plan-1a05f62d80284cb1b8df2a3b53da341a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation on v1.1 contracts
        </a>
      </p>
    </Modal>
  )
}
