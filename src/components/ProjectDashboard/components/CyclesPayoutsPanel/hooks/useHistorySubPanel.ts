import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import { fetchPastFundingCycles } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleHistory/utils'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber, Contract } from 'ethers'
import { JB_CONTROLLER_V_3_1 } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/useProjectController'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3FundingCycle } from 'models/v2v3/fundingCycle'
import moment from 'moment'
import { useCallback, useContext, useEffect, useReducer } from 'react'
import { isBigNumberish } from 'utils/bigNumbers'
import { callContract } from 'utils/callContract'
import { fromWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { HistoryData } from '../components/HistorySubPanel'

type State = {
  loading: boolean
  data: HistoryData
  error?: string
}

type Action =
  | { type: 'request' }
  | { type: 'success'; payload: HistoryData }
  | { type: 'failure'; payload: string }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'request':
      return { ...state, loading: true, error: undefined }
    case 'success':
      return { ...state, loading: false, data: action.payload }
    case 'failure':
      return { ...state, loading: false, error: action.payload }
  }
}

export const useHistorySubPanel = () => {
  const { projectId } = useProjectMetadata()
  const { fundingCycle, primaryETHTerminal } = useProjectContext()
  const {
    contracts,
    versions: { JBControllerVersion },
  } = useContext(V2V3ProjectContractsContext)
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: [],
  })

  const fetchCurrencyOfFundingCycle = useCallback(
    async (fundingCycle: V2V3FundingCycle) => {
      const terminal = primaryETHTerminal
      const { JBController, JBFundAccessConstraintsStore } = contracts
      const contract =
        JBControllerVersion === JB_CONTROLLER_V_3_1
          ? JBFundAccessConstraintsStore
          : JBController
      const result = await callContract({
        contract,
        contracts: contracts as Record<string, Contract>,
        functionName: 'distributionLimitOf',
        args:
          projectId && fundingCycle.configuration && terminal && contract
            ? [
                projectId,
                fundingCycle.configuration.toString(),
                terminal,
                ETH_TOKEN_ADDRESS,
              ]
            : null,
      })
      if (typeof result === undefined) return
      if (!(Array.isArray(result) && result.length === 2)) {
        console.error('Unexpected result from distributionLimitOf', result)
        throw new Error('Unexpected result from distributionLimitOf')
      }
      const [, currency] = result
      if (!isBigNumberish(currency)) {
        console.error('Unexpected result from distributionLimitOf', result)
        throw new Error('Unexpected result from distributionLimitOf')
      }
      const currencyOption = BigNumber.from(currency).toNumber()
      if (currencyOption === 0) {
        return undefined
      }
      return BigNumber.from(currency).toNumber() as V2V3CurrencyOption
    },
    [JBControllerVersion, contracts, primaryETHTerminal, projectId],
  )

  const fetchUsedDistributionLimitOfFundingCycle = useCallback(
    async (fundingCycle: V2V3FundingCycle) => {
      const terminal = primaryETHTerminal
      const { number } = fundingCycle
      const result = await callContract({
        contract: contracts.JBETHPaymentTerminalStore,
        contracts: contracts as Record<string, Contract>,
        functionName: 'usedDistributionLimitOf',
        args:
          terminal && projectId && number
            ? [terminal, projectId, number]
            : null,
      })
      if (typeof result === undefined) return
      if (!isBigNumberish(result)) {
        console.error('Unexpected result from usedDistributionLimitOf')
        throw new Error('Unexpected result from usedDistributionLimitOf')
      }
      return Number(fromWad(BigNumber.from(result)))
    },
    [contracts, primaryETHTerminal, projectId],
  )

  const fetchWithdrawnOfFundingCycle = useCallback(
    async (fundingCycle: V2V3FundingCycle) => {
      const [withdrawn, currency] = await Promise.all([
        fetchUsedDistributionLimitOfFundingCycle(fundingCycle),
        fetchCurrencyOfFundingCycle(fundingCycle),
      ])
      return formatCurrencyAmount({ amount: withdrawn, currency }) ?? '0Ξ'
    },
    [fetchCurrencyOfFundingCycle, fetchUsedDistributionLimitOfFundingCycle],
  )

  useEffect(() => {
    dispatch({ type: 'request' })

    const fetchHistory = async () => {
      if (!projectId || !fundingCycle || !contracts.JBController) return
      try {
        const data = await fetchPastFundingCycles({
          projectId,
          currentFundingCycle: fundingCycle,
          JBController: contracts.JBController,
        })

        const result = await Promise.all(
          data.map(async d => ({
            cycleNumber: d[0].number.toString(),
            withdrawn: await fetchWithdrawnOfFundingCycle(d[0]),
            date: `${moment(
              d[0].start.add(d[0].duration).mul(1000).toNumber(),
            ).fromNow(true)} ago`,
            _metadata: {
              fundingCycle: d[0],
              metadata: d[1],
            },
          })),
        )

        dispatch({ type: 'success', payload: result })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('error', error)
        dispatch({ type: 'failure', payload: error.message })
      }
    }

    fetchHistory()
  }, [
    contracts.JBController,
    fetchCurrencyOfFundingCycle,
    fetchWithdrawnOfFundingCycle,
    fundingCycle,
    projectId,
  ])

  return state
}
