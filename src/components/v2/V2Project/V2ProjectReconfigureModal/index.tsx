import { t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { CaretRightFilled } from '@ant-design/icons'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'

import {
  defaultFundingCycleMetadata,
  editingV2ProjectActions,
} from 'redux/slices/editingV2Project'
import { fromWad } from 'utils/formatNumber'
import {
  SerializedV2FundAccessConstraint,
  SerializedV2FundingCycleData,
  SerializedV2FundingCycleMetadata,
  serializeFundAccessConstraint,
  serializeV2FundingCycleData,
  serializeV2FundingCycleMetadata,
} from 'utils/v2/serializers'
import { useAppDispatch } from 'hooks/AppDispatch'

import {
  useAppSelector,
  useEditingV2FundAccessConstraintsSelector,
  useEditingV2FundingCycleDataSelector,
  useEditingV2FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import { useReconfigureV2FundingCycleTx } from 'hooks/v2/transactor/ReconfigureV2FundingCycleTx'
import { decodeV2FundingCycleMetadata } from 'utils/v2/fundingCycle'

import FundingTabContent from 'components/v2/V2Create/forms/FundingForm'
import TokenTabContent from 'components/v2/V2Create/forms/TokenForm'
import RulesTabContent from 'components/v2/V2Create/forms/RulesForm'

import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'

import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'

import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'

import UnsavedChangesModal from 'components/v2/shared/UnsavedChangesModal'

import { isEqual } from 'lodash'

import { Split } from 'models/v2/splits'

import { NO_CURRENCY, V2_CURRENCY_ETH } from 'utils/v2/currency'

import { V2ReconfigureFundingDrawer } from './drawers/V2ReconfigureFundingDrawer'
import { V2ReconfigureProjectDetailsDrawer } from './drawers/V2ReconfigureProjectDetailsDrawer'
import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'
import V2ReconfigureUpcomingMessage from './V2ReconfigureUpcomingMessage'
import ReconfigurePreview from './ReconfigurePreview'

const DrawerUnsavedChangesModal = UnsavedChangesModal

function ReconfigureButton({
  title,
  reconfigureHasChanges,
  onClick,
}: {
  title: string
  reconfigureHasChanges: boolean
  onClick: () => void
}) {
  const { colors, radii } = useContext(ThemeContext).theme

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        cursor: 'pointer',
        padding: 10,
        fontWeight: 500,
        borderRadius: radii.sm,
        border:
          '1px solid ' +
          (reconfigureHasChanges
            ? colors.stroke.action.primary
            : colors.stroke.action.secondary),
      }}
      onClick={onClick}
    >
      <div>{title}</div>
      <div>
        <CaretRightFilled />
      </div>
    </div>
  )
}

export const FundingDrawersSubtitles = (
  <p>
    <Trans>
      Updates you make to this section will only be applied to <i>upcoming</i>{' '}
      funding cycles.
    </Trans>
  </p>
)

export default function V2ProjectReconfigureModal({
  visible,
  onOk: exit,
  onCancel,
  hideProjectDetails,
}: {
  visible: boolean
  onOk: VoidFunction
  onCancel: VoidFunction
  hideProjectDetails?: boolean
}) {
  const {
    fundingCycle,
    payoutSplits,
    reservedTokensSplits,
    distributionLimit,
    distributionLimitCurrency,
  } = useContext(V2ProjectContext)

  const { projectId, primaryTerminal } = useContext(V2ProjectContext)

  const { data: queuedFundingCycleResponse } = useProjectQueuedFundingCycle({
    projectId,
  })

  const [queuedFundingCycle] = queuedFundingCycleResponse ?? []
  const { data: queuedPayoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: queuedFundingCycle?.configuration?.toString(),
  })

  const { data: queuedReservedTokensSplits } = useProjectSplits({
    projectId,
    splitGroup: RESERVED_TOKEN_SPLIT_GROUP,
    domain: queuedFundingCycle?.configuration?.toString(),
  })

  const { data: queuedDistributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: queuedFundingCycle?.configuration.toString(),
    terminal: primaryTerminal,
  })

  const [queuedDistributionLimit, queuedDistributionLimitCurrency] =
    queuedDistributionLimitData ?? []

  const { contracts } = useContext(V2UserContext)

  const dispatch = useAppDispatch()

  const [initialEditingData, setInitialEditingData] = useState<{
    fundAccessConstraints: SerializedV2FundAccessConstraint[]
    fundingCycleData: SerializedV2FundingCycleData
    fundingCycleMetadata: SerializedV2FundingCycleMetadata
    payoutGroupedSplits: {
      payoutGroupedSplits: Split[]
      reservedTokensGroupedSplits: Split[]
    }
  }>()

  const [projectDetailsDrawerVisible, setProjectDetailsDrawerVisible] =
    useState<boolean>(false)
  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>(false)
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>(false)

  const [unsavedChangesModalVisibile, setUnsavedChangesModalVisible] =
    useState<boolean>(false)

  const openUnsavedChangesModal = () => setUnsavedChangesModalVisible(true)
  const closeUnsavedChangesModal = () => setUnsavedChangesModalVisible(false)

  const [fundingFormUpdated, setFundingFormUpdated] = useState<boolean>(false)
  const [tokenFormUpdated, setTokenFormUpdated] = useState<boolean>(false)
  const [rulesFormUpdated, setRulesFormUpdated] = useState<boolean>(false)

  const [
    drawerUnsavedChangesModalVisible,
    setDrawerUnsavedChangesModalVisible,
  ] = useState<boolean>(false)

  const openDrawerUnsavedChangesModal = () =>
    setDrawerUnsavedChangesModalVisible(true)
  const closeDrawerUnsavedChangesModal = () =>
    setDrawerUnsavedChangesModalVisible(false)

  const closeReconfigureDrawer = () => {
    setFundingDrawerVisible(false)
    setTokenDrawerVisible(false)
    setRulesDrawerVisible(false)
  }

  const closeDrawerUnsavedChangesModalAndReconfigureDrawer = () => {
    closeDrawerUnsavedChangesModal()
    closeReconfigureDrawer()
  }

  const handleReconfigureDrawerCloseClick = (formUpdated: boolean) => {
    if (!formUpdated) {
      return closeReconfigureDrawer()
    }
    openDrawerUnsavedChangesModal()
  }

  const closeUnsavedChangesModalAndExit = () => {
    closeUnsavedChangesModal()
    onCancel()
  }

  const [reconfigureTxLoading, setReconfigureTxLoading] =
    useState<boolean>(false)

  const effectiveFundingCycle = queuedFundingCycle?.number.gt(0)
    ? queuedFundingCycle
    : fundingCycle

  const effectivePayoutSplits = queuedFundingCycle?.number.gt(0)
    ? queuedPayoutSplits
    : payoutSplits

  const effectiveReservedTokensSplits = queuedFundingCycle?.number.gt(0)
    ? queuedReservedTokensSplits
    : reservedTokensSplits

  let effectiveDistributionLimit = distributionLimit
  if (effectiveFundingCycle?.duration.gt(0) && queuedDistributionLimit) {
    effectiveDistributionLimit = queuedDistributionLimit
  }

  const effectiveDistributionLimitCurrency =
    queuedDistributionLimitCurrency ?? distributionLimitCurrency

  // Creates the local redux state from V2ProjectContext values
  useLayoutEffect(() => {
    if (!visible || !effectiveFundingCycle) return

    // Build fundAccessConstraint
    let fundAccessConstraint: SerializedV2FundAccessConstraint | undefined =
      undefined
    if (effectiveDistributionLimit) {
      const distributionLimitCurrency =
        effectiveDistributionLimitCurrency?.toNumber() ?? V2_CURRENCY_ETH

      fundAccessConstraint = {
        terminal: contracts?.JBETHPaymentTerminal.address ?? '',
        token: ETH_TOKEN_ADDRESS,
        distributionLimit: fromWad(effectiveDistributionLimit),
        distributionLimitCurrency:
          distributionLimitCurrency === NO_CURRENCY
            ? V2_CURRENCY_ETH.toString()
            : distributionLimitCurrency.toString(),
        overflowAllowance: '0', // nothing for the time being.
        overflowAllowanceCurrency: '0',
      }
    }
    const editingFundAccessConstraints = fundAccessConstraint
      ? [fundAccessConstraint]
      : []
    dispatch(
      editingV2ProjectActions.setFundAccessConstraints(
        fundAccessConstraint ? [fundAccessConstraint] : [],
      ),
    )

    // Set editing funding cycle
    const editingFundingCycleData = serializeV2FundingCycleData(
      effectiveFundingCycle,
    )
    dispatch(
      editingV2ProjectActions.setFundingCycleData(
        serializeV2FundingCycleData(effectiveFundingCycle),
      ),
    )

    // Set editing funding metadata
    const editingFundingCycleMetadata = effectiveFundingCycle.metadata
      ? serializeV2FundingCycleMetadata(
          decodeV2FundingCycleMetadata(effectiveFundingCycle.metadata),
        )
      : defaultFundingCycleMetadata
    if (effectiveFundingCycle?.metadata) {
      dispatch(
        editingV2ProjectActions.setFundingCycleMetadata(
          serializeV2FundingCycleMetadata(
            decodeV2FundingCycleMetadata(effectiveFundingCycle.metadata),
          ),
        ),
      )
    }

    // Set editing payout splits
    dispatch(
      editingV2ProjectActions.setPayoutSplits(effectivePayoutSplits ?? []),
    )

    // Set reserve token splits
    dispatch(
      editingV2ProjectActions.setReservedTokensSplits(
        effectiveReservedTokensSplits ?? [],
      ),
    )

    setInitialEditingData({
      fundAccessConstraints: editingFundAccessConstraints,
      fundingCycleData: editingFundingCycleData,
      fundingCycleMetadata: editingFundingCycleMetadata,
      payoutGroupedSplits: {
        payoutGroupedSplits: effectivePayoutSplits ?? [],
        reservedTokensGroupedSplits: effectiveReservedTokensSplits ?? [],
      },
    })
  }, [
    contracts,
    effectiveFundingCycle,
    effectivePayoutSplits,
    effectiveReservedTokensSplits,
    effectiveDistributionLimit,
    effectiveDistributionLimitCurrency,
    fundingCycle,
    visible,
    dispatch,
  ])

  // Gets values from the redux state to be used in the modal drawer fields
  const {
    payoutGroupedSplits: editingPayoutGroupedSplits,
    reservedTokensGroupedSplits: editingReservedTokensGroupedSplits,
  } = useAppSelector(state => state.editingV2Project)
  const editingFundingCycleMetadata = useEditingV2FundingCycleMetadataSelector()
  const editingFundingCycleData = useEditingV2FundingCycleDataSelector()
  const editingFundAccessConstraints =
    useEditingV2FundAccessConstraintsSelector()

  const fundingHasSavedChanges = useMemo(() => {
    if (!initialEditingData) {
      // Nothing to compare so return false
      return false
    }
    const editedChanges: typeof initialEditingData = {
      fundAccessConstraints: editingFundAccessConstraints.map(
        serializeFundAccessConstraint,
      ),
      fundingCycleMetadata: serializeV2FundingCycleMetadata(
        editingFundingCycleMetadata,
      ),
      fundingCycleData: serializeV2FundingCycleData(editingFundingCycleData),
      payoutGroupedSplits: {
        payoutGroupedSplits: editingPayoutGroupedSplits.splits,
        reservedTokensGroupedSplits: editingReservedTokensGroupedSplits.splits,
      },
    }
    return !isEqual(initialEditingData, editedChanges)
  }, [
    editingFundAccessConstraints,
    editingFundingCycleData,
    editingFundingCycleMetadata,
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    initialEditingData,
  ])

  const handleGlobalModalClose = useCallback(() => {
    if (!fundingHasSavedChanges) {
      return onCancel()
    }
    openUnsavedChangesModal()
  }, [fundingHasSavedChanges, onCancel])

  const reconfigureV2FundingCycleTx = useReconfigureV2FundingCycleTx()

  const reconfigureFundingCycle = useCallback(async () => {
    setReconfigureTxLoading(true)
    if (
      !(
        editingFundingCycleData &&
        editingFundingCycleMetadata &&
        editingFundAccessConstraints
      )
    ) {
      setReconfigureTxLoading(false)
      throw new Error('Error deploying project.')
    }

    const txSuccessful = await reconfigureV2FundingCycleTx(
      {
        fundingCycleData: editingFundingCycleData,
        fundingCycleMetadata: editingFundingCycleMetadata,
        fundAccessConstraints: editingFundAccessConstraints,
        groupedSplits: [
          editingPayoutGroupedSplits,
          editingReservedTokensGroupedSplits,
        ],
      },
      {
        onDone() {
          console.info(
            'Reconfigure transaction executed. Awaiting confirmation...',
          )
        },
        onConfirmed() {
          setReconfigureTxLoading(false)
          exit()
        },
      },
    )

    if (!txSuccessful) {
      setReconfigureTxLoading(false)
    }
  }, [
    editingFundAccessConstraints,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    reconfigureV2FundingCycleTx,
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    exit,
  ])

  const saveFundingTab = () => {
    setFundingDrawerVisible(false)
  }

  const saveTokenTab = () => {
    setTokenDrawerVisible(false)
  }

  const saveRulesTab = () => {
    setRulesDrawerVisible(false)
  }

  const fundingDrawerHasSavedChanges = () => {
    const fundingCycleData = serializeV2FundingCycleData(
      editingFundingCycleData,
    )
    const fundAccessConstraints = editingFundAccessConstraints.length
      ? serializeFundAccessConstraint(editingFundAccessConstraints?.[0])
      : undefined
    const payoutGroupedSplits = editingPayoutGroupedSplits.splits

    if (!fundAccessConstraints || !initialEditingData) {
      return false
    }
    const durationUpdated =
      fundingCycleData.duration !== initialEditingData.fundingCycleData.duration
    const distributionLimitUpdated =
      fundAccessConstraints.distributionLimit !==
      initialEditingData.fundAccessConstraints?.[0].distributionLimit
    const distributionLimitCurrencyUpdated =
      fundAccessConstraints.distributionLimitCurrency !==
      initialEditingData.fundAccessConstraints?.[0].distributionLimitCurrency
    const payoutGroupedSplitsUpdated = !isEqual(
      payoutGroupedSplits,
      initialEditingData.payoutGroupedSplits?.payoutGroupedSplits ?? [],
    )
    return (
      durationUpdated ||
      distributionLimitUpdated ||
      distributionLimitCurrencyUpdated ||
      payoutGroupedSplitsUpdated
    )
  }

  const tokenDrawerHasSavedChanges = () => {
    const fundingCycleData = serializeV2FundingCycleData(
      editingFundingCycleData,
    )
    const fundingCycleMetadata = serializeV2FundingCycleMetadata(
      editingFundingCycleMetadata,
    )
    const fundAccessConstraints = editingFundAccessConstraints.length
      ? serializeFundAccessConstraint(editingFundAccessConstraints?.[0])
      : undefined
    const reservedTokensGroupedSplits =
      editingReservedTokensGroupedSplits.splits

    if (!fundAccessConstraints || !initialEditingData) {
      return false
    }

    const reservedRateUpdated =
      fundingCycleMetadata.reservedRate !==
      initialEditingData.fundingCycleMetadata.reservedRate
    const reservedTokensGroupedSplitsUpdated = !isEqual(
      reservedTokensGroupedSplits,
      initialEditingData.payoutGroupedSplits.reservedTokensGroupedSplits ?? [],
    )
    const discountRateUpdated =
      fundingCycleData.discountRate !==
      initialEditingData.fundingCycleData.discountRate
    const redemptionRateUpdated =
      fundingCycleMetadata.redemptionRate !==
      initialEditingData.fundingCycleMetadata.redemptionRate

    return (
      reservedRateUpdated ||
      reservedTokensGroupedSplitsUpdated ||
      discountRateUpdated ||
      redemptionRateUpdated
    )
  }

  const rulesDrawerHasSavedChanges = () => {
    const fundingCycleData = serializeV2FundingCycleData(
      editingFundingCycleData,
    )
    const fundingCycleMetadata = serializeV2FundingCycleMetadata(
      editingFundingCycleMetadata,
    )
    const fundAccessConstraints = editingFundAccessConstraints.length
      ? serializeFundAccessConstraint(editingFundAccessConstraints?.[0])
      : undefined

    if (!fundAccessConstraints || !initialEditingData) {
      return false
    }

    const pausePaymentsUpdated =
      fundingCycleMetadata.pausePay !==
      initialEditingData.fundingCycleMetadata.pausePay
    const allowMintingUpdated =
      fundingCycleMetadata.allowMinting !==
      initialEditingData.fundingCycleMetadata.allowMinting
    const ballotUpdated =
      fundingCycleData.ballot !== initialEditingData.fundingCycleData.ballot

    return pausePaymentsUpdated || allowMintingUpdated || ballotUpdated
  }

  return (
    <Modal
      title={<Trans>Project configuration</Trans>}
      visible={visible}
      onOk={reconfigureFundingCycle}
      onCancel={handleGlobalModalClose}
      okText={t`Deploy new project configuration`}
      okButtonProps={{ disabled: !fundingHasSavedChanges }}
      confirmLoading={reconfigureTxLoading}
      width={650}
      centered
      destroyOnClose
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ width: '100%', marginBottom: 40 }}
      >
        {hideProjectDetails ? null : (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ marginBottom: 0 }}>
              <Trans>Edit project details</Trans>
            </h4>
            <p>
              <Trans>
                Changes to project details will take effect immediately.
              </Trans>
            </p>
            <ReconfigureButton
              reconfigureHasChanges={false}
              title={t`Project details`}
              onClick={() => setProjectDetailsDrawerVisible(true)}
            />
          </div>
        )}

        <h4 style={{ marginBottom: 0 }}>
          <Trans>Reconfigure upcoming funding cycles</Trans>
        </h4>
        <p>
          <V2ReconfigureUpcomingMessage />
        </p>
        <ReconfigureButton
          title={t`Distribution limit, duration and payouts`}
          reconfigureHasChanges={fundingDrawerHasSavedChanges()}
          onClick={() => setFundingDrawerVisible(true)}
        />
        <ReconfigureButton
          title={t`Token`}
          reconfigureHasChanges={tokenDrawerHasSavedChanges()}
          onClick={() => setTokenDrawerVisible(true)}
        />
        <ReconfigureButton
          title={t`Rules`}
          reconfigureHasChanges={rulesDrawerHasSavedChanges()}
          onClick={() => setRulesDrawerVisible(true)}
        />
      </Space>
      <ReconfigurePreview
        payoutSplits={editingPayoutGroupedSplits.splits}
        reserveSplits={editingReservedTokensGroupedSplits.splits}
        fundingCycleMetadata={editingFundingCycleMetadata}
        fundingCycleData={editingFundingCycleData}
        fundAccessConstraints={editingFundAccessConstraints}
      />
      {hideProjectDetails ? null : (
        <V2ReconfigureProjectDetailsDrawer
          visible={projectDetailsDrawerVisible}
          onFinish={() => setProjectDetailsDrawerVisible(false)}
        />
      )}
      <V2ReconfigureFundingDrawer
        visible={fundingDrawerVisible}
        onClose={() => handleReconfigureDrawerCloseClick(fundingFormUpdated)}
        title={<Trans>Reconfigure funding</Trans>}
        content={
          <FundingTabContent
            onFormUpdated={updated => setFundingFormUpdated(updated)}
            onFinish={saveFundingTab}
          />
        }
      />
      <V2ReconfigureFundingDrawer
        visible={tokenDrawerVisible}
        onClose={() => handleReconfigureDrawerCloseClick(tokenFormUpdated)}
        title={<Trans>Reconfigure token</Trans>}
        content={
          <TokenTabContent
            onFormUpdated={updated => setTokenFormUpdated(updated)}
            onFinish={saveTokenTab}
          />
        }
      />
      <V2ReconfigureFundingDrawer
        visible={rulesDrawerVisible}
        onClose={() => handleReconfigureDrawerCloseClick(rulesFormUpdated)}
        title={<Trans>Reconfigure rules</Trans>}
        content={
          <RulesTabContent
            onFormUpdated={updated => setRulesFormUpdated(updated)}
            onFinish={saveRulesTab}
          />
        }
      />
      <DrawerUnsavedChangesModal
        visible={drawerUnsavedChangesModalVisible}
        onOk={closeDrawerUnsavedChangesModalAndReconfigureDrawer}
        onCancel={closeDrawerUnsavedChangesModal}
      />
      <UnsavedChangesModal
        visible={unsavedChangesModalVisibile}
        onOk={closeUnsavedChangesModalAndExit}
        onCancel={closeUnsavedChangesModal}
      />
    </Modal>
  )
}
