import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import FeedbackFormLink from 'components/shared/FeedbackFormLink'

import {
  ProjectContextV2,
  // ProjectContextV2Type,
} from 'contexts/v2/projectContextV2'
import useContractReaderV2 from 'hooks/v2/ContractReaderV2'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
// import { useErc20Contract } from 'hooks/Erc20Contract'
// import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useProjectsQuery } from 'hooks/Projects'
import { JuiceboxV2ContractName } from 'models/contracts/juiceboxV2'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { deepEqFundingCycles } from 'utils/deepEqFundingCycles'
// import { normalizeHandle } from 'utils/formatHandle'
import { getTerminalVersion } from 'utils/terminal-versions'

import { utils } from 'ethers'

import { padding } from 'constants/styles/padding'
import { layouts } from 'constants/styles/layouts'
import { projectTypes } from 'constants/project-types'
import { archivedProjectIds } from 'constants/archived-projects'

import Loading from '../shared/Loading'
import Project from './Project'

export default function Dashboard() {
  const [projectExists, setProjectExists] = useState<boolean>()

  const converter = useCurrencyConverter()

  const { projectId: rawProjectId }: { projectId?: string } = useParams()
  const projectId = BigNumber.from(rawProjectId)

  const handle = useContractReaderV2<string>({
    contract: JuiceboxV2ContractName.JBProjects,
    functionName: 'handleOf',
    args: projectId ? [projectId.toString()] : null,
    callback: useCallback(
      (handle?: string) => {
        // setProjectExists(id?.gt(0) ?? false)
        setProjectExists(Boolean(handle))
      },
      [],
      // [setProjectExists],
    ),
    formatter: useCallback(val => utils.parseBytes32String(val), []),
  })

  console.log('HANDLE::', handle)

  const { data: projects } = useProjectsQuery({
    projectId,
    keys: ['createdAt', 'totalPaid'],
  })

  const terminalAddresses = useContractReaderV2<string>({
    contract: JuiceboxV2ContractName.JBDirectory,
    functionName: '_terminalsOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const terminalAddress = terminalAddresses?.[0]

  // const terminalName = getTerminalName({
  //   address: terminalAddress, // TODO is this correct? Assume first terminal?
  // })

  const terminalName = JuiceboxV2ContractName.JBETHPaymentTerminal // TODO get this from terminalAddress
  // TODO create a V2 version of getTerminalName

  const terminalVersion = getTerminalVersion(terminalAddress)

  const createdAt = projects?.[0]?.createdAt
  const earned = projects?.[0]?.totalPaid

  // const owner = useContractReaderV2<string>({
  //   contract: JuiceboxV2ContractName.Projects,
  //   functionName: 'ownerOf',
  //   args: projectId ? [projectId.toHexString()] : null,
  // })

  const owner = 'TODO'

  const currentFC = useContractReaderV2<FundingCycle>({
    contract: JuiceboxV2ContractName.JBFundingCycleStore,
    functionName: 'currentOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: useCallback((a, b) => !deepEqFundingCycles(a, b), []),
    // updateOn: useMemo(
    //   () =>
    //     projectId
    //       ? [
    //           {
    //             contract: JuiceboxV2ContractName.JBFundingCycleStore,
    //             eventName: 'Configure',
    //             topics: [[], projectId.toHexString()],
    //           },
    //           {
    //             contract: terminalName,
    //             eventName: 'Pay',
    //             topics: [[], projectId.toHexString()],
    //           },
    //           {
    //             contract: terminalName,
    //             eventName: 'Tap',
    //             topics: [[], projectId.toHexString()],
    //           },
    //         ]
    //       : undefined,
    //   [projectId, terminalName],
    // ),
  })

  const queuedFC = useContractReaderV2<FundingCycle>({
    contract: JuiceboxV2ContractName.JBFundingCycleStore,
    functionName: 'queuedOf',
    args: projectId ? [projectId.toHexString()] : null,
    // updateOn: projectId
    //   ? [
    //       {
    //         contract: JuiceboxV2ContractName.FundingCycles,
    //         eventName: 'Configure',
    //         topics: [[], projectId.toHexString()],
    //       },
    //     ]
    //   : undefined,
  })

  const uri = useContractReaderV2<string>({
    contract: JuiceboxV2ContractName.JBProjects,
    functionName: 'metadataCidOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  // const currentPayoutMods = useContractReaderV2<PayoutMod[]>({
  //   contract: JuiceboxV2ContractName.ModStore,
  //   functionName: 'payoutModsOf',
  //   args:
  //     projectId && currentFC
  //       ? [projectId.toHexString(), currentFC.configured.toHexString()]
  //       : null,
  //   updateOn: useMemo(
  //     () =>
  //       projectId && currentFC
  //         ? [
  //             {
  //               contract: JuiceboxV2ContractName.ModStore,
  //               eventName: 'SetPayoutMod',
  //               topics: [
  //                 projectId.toHexString(),
  //                 currentFC.configured.toHexString(),
  //               ],
  //             },
  //           ]
  //         : [],
  //     [projectId, currentFC],
  //   ),
  // })

  // const queuedPayoutMods = useContractReaderV2<PayoutMod[]>({
  //   contract: JuiceboxV2ContractName.ModStore,
  //   functionName: 'payoutModsOf',
  //   args:
  //     projectId && queuedFC
  //       ? [projectId.toHexString(), queuedFC.configured.toHexString()]
  //       : null,
  //   updateOn: useMemo(
  //     () =>
  //       projectId && queuedFC
  //         ? [
  //             {
  //               contract: JuiceboxV2ContractName.ModStore,
  //               eventName: 'SetPayoutMod',
  //               topics: [
  //                 projectId.toHexString(),
  //                 queuedFC.configured.toHexString(),
  //               ],
  //             },
  //           ]
  //         : [],
  //     [projectId, queuedFC],
  //   ),
  // })

  // const currentTicketMods = useContractReaderV2<TicketMod[]>({
  //   contract: JuiceboxV2ContractName.ModStore,
  //   functionName: 'ticketModsOf',
  //   args:
  //     projectId && currentFC
  //       ? [projectId.toHexString(), currentFC.configured.toHexString()]
  //       : null,
  //   updateOn: useMemo(
  //     () =>
  //       projectId && currentFC
  //         ? [
  //             {
  //               contract: JuiceboxV2ContractName.ModStore,
  //               eventName: 'SetTicketMod',
  //               topics: [
  //                 projectId.toHexString(),
  //                 currentFC.configured.toHexString(),
  //               ],
  //             },
  //           ]
  //         : [],
  //     [projectId, currentFC],
  //   ),
  // })

  // const queuedTicketMods = useContractReaderV2<TicketMod[]>({
  //   contract: JuiceboxV2ContractName.ModStore,
  //   functionName: 'ticketModsOf',
  //   args:
  //     projectId && queuedFC
  //       ? [projectId.toHexString(), queuedFC.configured.toHexString()]
  //       : null,
  //   updateOn: useMemo(
  //     () =>
  //       projectId && queuedFC
  //         ? [
  //             {
  //               contract: JuiceboxV2ContractName.ModStore,
  //               eventName: 'SetTicketMod',
  //               topics: [
  //                 projectId.toHexString(),
  //                 queuedFC.configured.toHexString(),
  //               ],
  //             },
  //           ]
  //         : [],
  //     [projectId, queuedFC],
  //   ),
  // })

  // const tokenAddress = useContractReaderV2<string>({
  //   contract: JuiceboxV2ContractName.TicketBooth,
  //   functionName: 'ticketsOf',
  //   args: projectId ? [projectId.toHexString()] : null,
  //   updateOn: useMemo(
  //     () => [
  //       {
  //         contract: JuiceboxV2ContractName.TicketBooth,
  //         eventName: 'Issue',
  //         topics: projectId ? [projectId.toHexString()] : undefined,
  //       },
  //     ],
  //     [projectId],
  //   ),
  // })
  const tokenAddress = useContractReaderV2<string>({
    contract: JuiceboxV2ContractName.JBTokenStore,
    functionName: 'tokenOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  // const tokenSymbol = useContractReaderV2<string>({
  //   contract: token,
  //   functionName: 'symbol',
  // })
  const tokenSymbol = 'TODO'

  // const { data: metadata } = useProjectMetadata(uri)
  const metadata = useMemo(() => {
    return {
      name: 'helloworld yea',
      uri,
    }
  }, [uri])

  useEffect(() => {
    if (metadata?.name) {
      document.title = metadata.name
    } else {
      document.title = 'Juicebox'
    }
  }, [metadata])

  const balance = useContractReaderV2<BigNumber>({
    contract: terminalName,
    functionName: 'balanceOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: terminalName,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: terminalName,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId, terminalName],
    ),
  })

  const balanceInCurrency = useMemo(
    () =>
      balance &&
      converter.wadToCurrency(
        balance,
        currentFC?.currency.toNumber() as CurrencyOption,
        0,
      ),
    [balance, converter, currentFC],
  )

  const project = useMemo(() => {
    // TODO should return type ProjectContextV2Type
    const projectType = projectId
      ? projectTypes[projectId.toNumber()]
      : 'standard'
    const isPreviewMode = false
    const isArchived = projectId
      ? archivedProjectIds.includes(projectId.toNumber())
      : false

    return {
      createdAt,
      projectId,
      projectType,
      owner,
      earned,
      handle,
      metadata,
      currentFC,
      queuedFC,
      // currentPayoutMods,
      // currentTicketMods,
      // queuedPayoutMods,
      // queuedTicketMods,
      tokenAddress,
      tokenSymbol,
      balance,
      balanceInCurrency,
      isPreviewMode,
      isArchived,
      terminal: {
        address: terminalAddress,
        name: terminalName,
        version: terminalVersion,
      },
    }
  }, [
    balance,
    balanceInCurrency,
    createdAt,
    currentFC,
    // currentPayoutMods,
    // currentTicketMods,
    earned,
    handle,
    metadata,
    owner,
    projectId,
    queuedFC,
    // queuedPayoutMods,
    // queuedTicketMods,
    tokenAddress,
    tokenSymbol,
    terminalVersion,
    terminalName,
    terminalAddress,
  ])

  if (projectExists === undefined) return <Loading />

  if (!projectExists) {
    return (
      <div
        style={{
          padding: padding.app,
          height: '100%',
          ...layouts.centered,
        }}
      >
        <h2>
          <Trans>{handle} not found</Trans>
        </h2>
      </div>
    )
  }

  if (!projectId || !handle || !metadata) return null

  return (
    <ProjectContextV2.Provider value={project}>
      <div style={layouts.maxWidth}>
        <Project />
        <div
          style={{ textAlign: 'center', cursor: 'pointer', padding: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Trans>Back to top</Trans>
        </div>
        <FeedbackFormLink projectHandle={handle} />
      </div>
    </ProjectContextV2.Provider>
  )
}
