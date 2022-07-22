import { t, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { MinimalCollapse } from 'components/MinimalCollapse'
import LaunchProjectPayerButton from 'components/v2/V2Project/LaunchProjectPayer/LaunchProjectPayerButton'
import ProjectPayersModal from 'components/v2/V2Project/ProjectPayersModal'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useProjectPayers } from 'hooks/v2/ProjectPayers'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useContext, useState } from 'react'

export default function ProjectPayersSection() {
  const { projectId } = useContext(V2ProjectContext)

  const [projectPayersModalIsVisible, setProjectPayersModalIsVisible] =
    useState<boolean>()

  const { data: projectPayers } = useProjectPayers(projectId)

  return (
    <section>
      <h3>
        <Trans>ETH-ERC20 Payment addresses</Trans>
      </h3>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <MinimalCollapse header={t`More information`}>
          <p>
            <Trans>
              ETH-ERC20 Payment addresses are{' '}
              <ExternalLink href="https://github.com/jbx-protocol/juice-contracts-v2/blob/main/contracts/JBETHERC20ProjectPayer.sol">
                <Trans>smart contracts</Trans>
              </ExternalLink>
              that allow this project to be paid in <strong>ETH</strong> by
              sending ETH directly to the contract, or in{' '}
              <strong>ERC20 tokens</strong> via the contract's{' '}
              <strong>pay()</strong> function.
            </Trans>
          </p>
          <p>
            <Trans>
              When a payment address is paid, its <strong>beneficiary</strong>{' '}
              address will receive any minted project tokens.
            </Trans>
          </p>
          <p>
            <Trans>
              <strong>Add to balance:</strong> payments to this contract will
              fund the project without minting project tokens.
            </Trans>
          </p>
          <p>
            <Trans>
              <strong>Auto claim:</strong> any minted tokens will automatically
              be claimed as ERC20 (if this project has issued an ERC20 token).
            </Trans>
          </p>
        </MinimalCollapse>

        {projectPayers && (
          <Button onClick={() => setProjectPayersModalIsVisible(true)} block>
            {projectPayers.length === 1 ? (
              <Trans>1 deployed payment address</Trans>
            ) : (
              <Trans>{projectPayers.length} deployed payment addresses</Trans>
            )}
          </Button>
        )}

        <LaunchProjectPayerButton
          size="middle"
          type="primary"
          useDeployProjectPayerTx={useDeployProjectPayerTx}
        />
      </Space>

      <ProjectPayersModal
        visible={projectPayersModalIsVisible}
        onCancel={() => setProjectPayersModalIsVisible(false)}
        projectPayers={projectPayers}
      />
    </section>
  )
}
