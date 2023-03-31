import { Steps } from 'antd'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useContext, useEffect, useState } from 'react'
import { isEqualAddress } from 'utils/address'
import { MigrateProjectController } from '../../../components/MigrateProjectController'
import { MigrateProjectTerminal } from '../../../components/MigrateProjectTerminal'
import { SetProjectTerminal } from '../../../components/SetProjectTerminal'

export function UpgradeController() {
  const { contracts } = useContext(V2V3ContractsContext)
  const { contracts: projectContracts } = useContext(
    V2V3ProjectContractsContext,
  )
  if (!contracts?.JBController3_1 || !contracts?.JBETHPaymentTerminal3_1)
    return null

  const [current, setCurrent] = useState<number>(0)

  const onChange = (value: number) => {
    setCurrent(value)
  }

  useEffect(() => {
    // if contract already set, skip to step 2
    if (
      projectContracts?.JBController &&
      contracts?.JBController3_1 &&
      isEqualAddress(
        projectContracts.JBController.address,
        contracts.JBController3_1?.address,
      )
    ) {
      onChange(1)
    }
  }, [contracts, projectContracts])

  return (
    <div>
      <Steps
        size="small"
        current={current}
        onChange={onChange}
        items={[
          {
            title: (
              <span className="text-sm capitalize">Upgrade Controller</span>
            ),
          },
          {
            title: (
              <span className="text-sm capitalize">
                Upgrade Payment Terminal
              </span>
            ),
          },
          {
            title: <span className="text-sm capitalize">Move ETH</span>,
          },
        ]}
        className="mb-5"
      />
      {current === 0 && (
        <MigrateProjectController
          controllerAddress={contracts.JBController3_1.address}
          onDone={() => setCurrent(1)}
        />
      )}
      {current === 1 && (
        <SetProjectTerminal
          terminalAddress={contracts.JBETHPaymentTerminal3_1.address}
          onDone={() => setCurrent(2)}
        />
      )}
      {current === 2 && (
        <MigrateProjectTerminal
          terminalAddress={contracts.JBETHPaymentTerminal3_1.address}
        />
      )}
    </div>
  )
}
