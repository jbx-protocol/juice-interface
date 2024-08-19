import { Trans } from '@lingui/macro'
import { Table } from 'antd'
import EtherscanLink from 'components/EtherscanLink'
import { BackToProjectButton } from 'components/buttons/BackToProjectButton'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { ProjectHeader } from 'packages/v1/components/V1Project/V1ProjectHeader'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import {
  V2V3ProjectContracts,
  V2V3ProjectContractsContext,
} from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import {
  SUPPORTED_CONTROLLERS,
  SUPPORTED_PAYMENT_TERMINALS,
  V2V3ContractName,
} from 'packages/v2v3/models/contracts'
import { v2v3ProjectRoute } from 'packages/v2v3/utils/routes'
import { useContext } from 'react'
import { V2V3ProjectHeaderActions } from '../V2V3ProjectHeaderActions/V2V3ProjectHeaderActions'

/**
 * Contracts that we don't want to show in the list.
 * Typically this list consists of contracts that are project-specific (e.g. PaymentTerminal, Controller etc.)
 */
const CONTRACT_EXCLUSIONS = [
  V2V3ContractName.JBSingleTokenPaymentTerminalStore,
  V2V3ContractName.JBFundAccessConstraintsStore,
  ...SUPPORTED_CONTROLLERS,
  ...SUPPORTED_PAYMENT_TERMINALS,
]

export function V2V3ProjectContractsDashboard() {
  const { projectId, projectMetadata } = useContext(ProjectMetadataContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { handle } = useContext(V2V3ProjectContext)
  const { contracts: projectContracts } = useContext(
    V2V3ProjectContractsContext,
  )

  if (!contracts) return null

  const columns = [
    {
      title: 'Contract name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => (
        <EtherscanLink type="address" value={address} />
      ),
    },
  ]
  const dataSource = [
    ...Object.keys(projectContracts)
      .map(k => {
        return {
          key: k,
          name:
            k === V2V3ContractName.JBETHPaymentTerminal
              ? 'Primary ETH Payment Terminal'
              : k,
          address: projectContracts[k as keyof V2V3ProjectContracts]?.address,
        }
      })
      .filter(
        c =>
          c?.address !== undefined && c.name !== 'JBFundAccessConstraintsStore',
      ),
    ...Object.keys(contracts)
      .map(k => {
        return {
          key: k,
          name: k,
          address: contracts[k as V2V3ContractName]?.address,
        }
      })
      .filter(
        c =>
          c?.address !== undefined &&
          !CONTRACT_EXCLUSIONS.includes(c.name as V2V3ContractName),
      ),
    {
      key: 'JBFundAccessConstraintsStore',
      name: 'JBFundAccessConstraintsStore',
      address:
        projectContracts.JBFundAccessConstraintsStore?.address ||
        contracts.JBFundAccessConstraintsStore?.address,
    },
  ].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="my-0 mx-auto flex max-w-5xl flex-col gap-y-5 px-5 pb-5">
      <ProjectHeader
        actions={<V2V3ProjectHeaderActions />}
        handle={handle}
        projectOwnerAddress={undefined}
        canEditProjectHandle={false}
      />
      <div className="mb-5">
        <BackToProjectButton
          projectPageUrl={v2v3ProjectRoute({ projectId, handle })}
        />
      </div>
      <h2 className="text-2xl text-grey-900 dark:text-slate-100">
        <Trans>Project contracts</Trans>
      </h2>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  )
}
