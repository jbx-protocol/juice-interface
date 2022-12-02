import { ballotStrategies as BallotStrategies } from 'constants/v2v3/ballotStrategies'
import { isEqual } from 'lodash'
import { CreatePage } from 'models/create-page'
import { FundingTargetType } from 'models/fundingTargetType'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  CreateState,
  defaultReduxState,
  editingV2ProjectActions,
  ProjectState,
} from 'redux/slices/editingV2Project'
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
    BallotStrategies.find(
      s => s.address === initialState.fundingCycleData.ballot,
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
export function useSetInitialStateFromQuery() {
  const dispatch = useDispatch()
  const router = useRouter()

  useLayoutEffect(() => {
    const { initialState } = router.query
    if (!initialState) return

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
          ...defaultReduxState,
          ...createFlowState,
          ...parsedInitialState,
        }),
      )
    } catch (e) {
      console.warn('Error parsing initialState:', e)
    }
  }, [router, dispatch])
}
