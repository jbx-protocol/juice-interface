import { ballotStrategies as BallotStrategies } from 'constants/v2v3/ballotStrategies'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { isEqual } from 'lodash'
import { CreatePage } from 'models/createPage'
import { FundingTargetType } from 'models/fundingTargetType'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  CreateState,
  DEFAULT_REDUX_STATE,
  editingV2ProjectActions,
  INITIAL_REDUX_STATE,
  ProjectState,
} from 'redux/slices/editingV2Project'
import { isEqualAddress } from 'utils/address'
import { parseWad } from 'utils/format/formatNumber'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { DefaultSettings as DefaultTokenSettings } from '../components/pages/ProjectToken/hooks/ProjectTokenForm'
import { determineAvailablePayoutsSelections } from '../utils/determineAvailablePayoutsSelections'
import { projectTokenSettingsToReduxFormat } from '../utils/projectTokenSettingsToReduxFormat'

const ReduxDefaultTokenSettings =
  projectTokenSettingsToReduxFormat(DefaultTokenSettings)

const parseCreateFlowStateFromInitialState = (
  initialState: ProjectState,
): CreateState => {
  const duration = initialState.fundingCycleData.duration

  let fundingCyclesPageSelection: 'manual' | 'automated' | undefined = undefined
  switch (duration) {
    case '':
      fundingCyclesPageSelection = undefined
      break
    case '0':
      fundingCyclesPageSelection = 'manual'
      break
    default:
      fundingCyclesPageSelection = 'automated'
  }

  const distributionLimit = initialState.fundAccessConstraints[0]
    ?.distributionLimit
    ? parseWad(initialState.fundAccessConstraints[0]?.distributionLimit)
    : undefined

  let fundingTargetSelection: FundingTargetType | undefined

  if (distributionLimit === undefined) {
    fundingTargetSelection = undefined
  } else if (distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)) {
    fundingTargetSelection = 'infinite'
  } else {
    fundingTargetSelection = 'specific'
  }

  const availablePayoutsSelections =
    determineAvailablePayoutsSelections(distributionLimit)

  const payoutsSelection = availablePayoutsSelections.size
    ? [...availablePayoutsSelections][0]
    : undefined

  let projectTokensSelection: ProjectTokensSelection | undefined
  const initialTokenData = {
    weight: initialState.fundingCycleData.weight,
    reservedRate: initialState.fundingCycleMetadata.reservedRate,
    reservedTokensGroupedSplits: initialState.reservedTokensGroupedSplits,
    discountRate: initialState.fundingCycleData.discountRate,
    redemptionRate: initialState.fundingCycleMetadata.redemptionRate,
    allowMinting: initialState.fundingCycleMetadata.allowMinting,
  }
  if (isEqual(initialTokenData, ReduxDefaultTokenSettings)) {
    projectTokensSelection = 'default'
  } else {
    projectTokensSelection = 'custom'
  }

  const reconfigurationRuleSelection =
    BallotStrategies.find(s =>
      isEqualAddress(s.address, initialState.fundingCycleData.ballot),
    )?.id ?? 'threeDay'

  let createFurthestPageReached: CreatePage = 'projectDetails'
  if (fundingCyclesPageSelection) {
    createFurthestPageReached = 'fundingCycles'
  }
  if (fundingTargetSelection) {
    createFurthestPageReached = 'fundingTarget'
  }
  if (payoutsSelection) {
    createFurthestPageReached = 'payouts'
  }
  if (projectTokensSelection) {
    createFurthestPageReached = 'projectToken'
  }
  if (reconfigurationRuleSelection) {
    createFurthestPageReached = 'reconfigurationRules'
  }
  if (
    fundingCyclesPageSelection &&
    fundingTargetSelection &&
    payoutsSelection &&
    projectTokensSelection &&
    reconfigurationRuleSelection
  ) {
    createFurthestPageReached = 'reviewDeploy'
  }

  return {
    fundingCyclesPageSelection,
    fundingTargetSelection,
    payoutsSelection,
    projectTokensSelection,
    reconfigurationRuleSelection,
    createFurthestPageReached,
    createSoftLockPageQueue: undefined, // Not supported, this feature is used only for fully fledged projects.
  }
}

/**
 * Load redux state from a URL query parameter.
 */
export function useLoadingInitialStateFromQuery() {
  const { contracts } = useContext(V2V3ContractsContext)
  const dispatch = useDispatch()
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady || !contracts) return

    const { initialState } = router.query
    if (!initialState) {
      setLoading(false)
      return
    }

    try {
      // TODO we can probably validate this object better in future.
      // But worst case, if it's invalid, we'll just ignore it.
      const parsedInitialState = JSON.parse(
        initialState as string,
      ) as ProjectState
      const createFlowState =
        parseCreateFlowStateFromInitialState(parsedInitialState)

      dispatch(
        editingV2ProjectActions.setState({
          ...INITIAL_REDUX_STATE,
          ...createFlowState,
          ...parsedInitialState,
          ...{
            projectMetadata: {
              ...DEFAULT_REDUX_STATE.projectMetadata,
              ...parsedInitialState.projectMetadata,
            },
            fundingCycleMetadata: {
              ...DEFAULT_REDUX_STATE.fundingCycleMetadata,
              ...parsedInitialState.fundingCycleMetadata,
            },
            fundingCycleData: {
              ...DEFAULT_REDUX_STATE.fundingCycleData,
              ...parsedInitialState.fundingCycleData,
            },
            fundAccessConstraints: [
              {
                ...DEFAULT_REDUX_STATE.fundAccessConstraints[0],
                ...parsedInitialState.fundAccessConstraints[0],
                terminal: contracts.JBETHPaymentTerminal.address,
                token: ETH_TOKEN_ADDRESS,
              },
            ],
          },
        }),
      )
    } catch (e) {
      console.warn('Error parsing initialState:', e)
    }
    setLoading(false)
  }, [router, dispatch, contracts])

  return loading
}
