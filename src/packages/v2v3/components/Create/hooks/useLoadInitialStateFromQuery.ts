import { CreateState, ProjectState } from 'redux/slices/v2v3/shared/v2ProjectTypes'
import {
  DEFAULT_REDUX_STATE,
  creatingV2ProjectActions,
} from 'redux/slices/v2v3/creatingV2Project'
import { useEffect, useState } from 'react'

import { CreatePage } from 'models/createPage'
import { DefaultSettings as DefaultTokenSettings } from '../components/pages/ProjectToken/hooks/useProjectTokenForm'
import { ETH_TOKEN_ADDRESS } from 'constants/juiceboxTokens'
import { INITIAL_REDUX_STATE } from 'redux/slices/v2v3/shared/v2ProjectInitialReduxState'
import { MAX_DISTRIBUTION_LIMIT } from 'packages/v2v3/utils/math'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { TreasurySelection } from 'models/treasurySelection'
import { ballotStrategiesFn } from 'packages/v2v3/constants/ballotStrategies'
import isEqual from 'lodash/isEqual'
import { isEqualAddress } from 'utils/address'
import { parseWad } from 'utils/format/formatNumber'
import { projectTokenSettingsToReduxFormat } from '../utils/projectTokenSettingsToReduxFormat'
import { useDefaultJBETHPaymentTerminal } from 'packages/v2v3/hooks/defaultContracts/useDefaultJBETHPaymentTerminal'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

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

  let treasurySelection: TreasurySelection | undefined

  if (distributionLimit === undefined) {
    treasurySelection = undefined
  } else if (distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)) {
    treasurySelection = 'unlimited'
  } else if (distributionLimit.eq(0)) {
    treasurySelection = 'zero'
  } else {
    treasurySelection = 'amount'
  }

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
    ballotStrategiesFn({}).find(s =>
      isEqualAddress(s.address, initialState.fundingCycleData.ballot),
    )?.id ?? 'threeDay'

  let createFurthestPageReached: CreatePage = 'projectDetails'
  if (fundingCyclesPageSelection) {
    createFurthestPageReached = 'fundingCycles'
  }
  if (treasurySelection) {
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
    treasurySelection &&
    projectTokensSelection &&
    reconfigurationRuleSelection
  ) {
    createFurthestPageReached = 'reviewDeploy'
  }

  return {
    projectChainId: 0, // not necessary for v2v3
    fundingCyclesPageSelection,
    treasurySelection,
    fundingTargetSelection: undefined, // TODO: Remove
    payoutsSelection: undefined, // TODO: Remove
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
  const dispatch = useDispatch()
  const router = useRouter()
  const defaultJBETHPaymentTerminal = useDefaultJBETHPaymentTerminal()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady || !defaultJBETHPaymentTerminal) return

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
        creatingV2ProjectActions.setState({
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
                terminal: defaultJBETHPaymentTerminal.address,
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
  }, [router, dispatch, defaultJBETHPaymentTerminal])

  return loading
}
