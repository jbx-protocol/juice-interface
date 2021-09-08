import { CaretRightFilled, CheckCircleFilled } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Col, Drawer, DrawerProps, Row, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import Project from 'components/Dashboard/Project'
import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { constants, utils } from 'ethers'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useAppSelector,
  useEditingFundingCycleSelector,
} from 'hooks/AppSelector'
import { CurrencyOption } from 'models/currency-option'
import { FCMetadata, FundingCycle } from 'models/funding-cycle'
import { FCProperties } from 'models/funding-cycle-properties'
import { PayoutMod, TicketMod } from 'models/mods'
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import {
  fromPerbicent,
  fromPermille,
  fromWad,
  parsePerbicent,
} from 'utils/formatNumber'
import {
  encodeFCMetadata,
  hasFundingTarget,
  isRecurring,
} from 'utils/fundingCycle'
import {
  cidFromUrl,
  editMetadataForCid,
  logoNameForHandle,
  metadataNameForHandle,
  uploadProjectMetadata,
} from 'utils/ipfs'
import { feeForAmount } from 'utils/math'

import BudgetForm from './BudgetForm'
import ConfirmDeployProject from './ConfirmDeployProject'
import IncentivesForm from './IncentivesForm'
import PayModsForm from './PayModsForm'
import ProjectForm, { ProjectFormFields } from './ProjectForm'
import RulesForm from './RulesForm'
import TicketingForm, { TicketingFormFields } from './TicketingForm'

export default function Create() {
  const { transactor, contracts, userAddress, adminFeePercent } =
    useContext(UserContext)
  const { signerNetwork } = useContext(NetworkContext)
  const { colors, radii } = useContext(ThemeContext).theme
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [payModsModalVisible, setPayModsFormModalVisible] =
    useState<boolean>(false)
  const [budgetFormModalVisible, setBudgetFormModalVisible] =
    useState<boolean>(false)
  const [projectFormModalVisible, setProjectFormModalVisible] =
    useState<boolean>(false)
  const [incentivesFormModalVisible, setIncentivesFormModalVisible] =
    useState<boolean>(false)
  const [ticketingFormModalVisible, setTicketingFormModalVisible] =
    useState<boolean>(false)
  const [rulesFormModalVisible, setRulesFormModalVisible] =
    useState<boolean>(false)
  const [deployProjectModalVisible, setDeployProjectModalVisible] =
    useState<boolean>(false)
  const [loadingCreate, setLoadingCreate] = useState<boolean>()
  const [projectForm] = useForm<ProjectFormFields>()
  const [ticketingForm] = useForm<TicketingFormFields>()
  const editingFC = useEditingFundingCycleSelector()
  const {
    info: editingProjectInfo,
    ticketMods: editingTicketMods,
    payoutMods: editingPayoutMods,
  } = useAppSelector(state => state.editingProject)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (adminFeePercent) {
      dispatch(editingProjectActions.setFee(adminFeePercent.toString()))
    }
  }, [adminFeePercent])

  const incrementStep = (index: number) => {
    if (index < currentStep) return
    setCurrentStep(currentStep + 1)
  }

  const resetProjectForm = () =>
    projectForm.setFieldsValue({
      name: editingProjectInfo?.metadata.name ?? '',
      infoUrl: editingProjectInfo?.metadata.infoUri ?? '',
      handle: editingProjectInfo?.handle ?? '',
      logoUrl: editingProjectInfo?.metadata.logoUri ?? '',
    })

  const resetTicketingForm = () =>
    ticketingForm.setFieldsValue({
      reserved: parseFloat(fromPerbicent(editingFC?.reserved)),
    })

  const onPayModsFormSaved = (mods: PayoutMod[]) =>
    dispatch(editingProjectActions.setPayoutMods(mods))

  const onBudgetFormSaved = (
    currency: CurrencyOption,
    target: string,
    duration: string,
  ) => {
    dispatch(editingProjectActions.setTarget(target))
    dispatch(editingProjectActions.setDuration(duration))
    dispatch(editingProjectActions.setCurrency(currency))

    if (target) incrementStep(2)
  }

  const onProjectFormSaved = () => {
    const fields = projectForm.getFieldsValue(true)
    dispatch(editingProjectActions.setName(fields.name))
    dispatch(editingProjectActions.setInfoUri(fields.infoUrl))
    dispatch(editingProjectActions.setHandle(fields.handle))
    dispatch(editingProjectActions.setLogoUri(fields.logoUrl))
    dispatch(editingProjectActions.setDescription(fields.description))
  }

  const onTicketingFormSaved = (mods: TicketMod[]) => {
    const fields = ticketingForm.getFieldsValue(true)
    dispatch(editingProjectActions.setReserved(fields.reserved))
    dispatch(editingProjectActions.setTicketMods(mods))
  }

  const onRulesFormSaved = (ballot: string) => {
    dispatch(editingProjectActions.setBallot(ballot))
  }

  const onIncentivesFormSaved = (
    discountRate: string,
    bondingCurveRate: string,
  ) => {
    dispatch(editingProjectActions.setDiscountRate(discountRate))
    dispatch(editingProjectActions.setBondingCurveRate(bondingCurveRate))
  }

  useLayoutEffect(() => {
    resetProjectForm()
    resetTicketingForm()
  }, [])

  async function deployProject() {
    if (!transactor || !contracts || !editingFC) return

    setLoadingCreate(true)

    const uploadedMetadata = await uploadProjectMetadata({
      name: editingProjectInfo.metadata.name,
      logoUri: editingProjectInfo.metadata.logoUri,
      infoUri: editingProjectInfo.metadata.infoUri,
      description: editingProjectInfo.metadata.description,
    })

    if (!uploadedMetadata.success) {
      setLoadingCreate(false)
      return
    }

    const fee = feeForAmount(editingFC.target, editingFC.fee)

    if (!fee) return

    const targetWithFee = editingFC.target
      ?.add(hasFundingTarget(editingFC) ? fee : 0)
      .toHexString()

    const properties: Record<keyof FCProperties, any> = {
      target: targetWithFee,
      currency: editingFC.currency.toNumber(),
      duration: editingFC.duration.toNumber(),
      discountRate: editingFC.discountRate.toNumber(),
      cycleLimit: editingFC.cycleLimit.toNumber(),
      ballot: constants.AddressZero,
    }

    const metadata: Record<keyof Omit<FCMetadata, 'version'>, string> = {
      bondingCurveRate: editingFC.bondingCurveRate.toHexString(),
      reservedRate: editingFC.reserved.toHexString(),
      reconfigurationBondingCurveRate: parsePerbicent(100).toHexString(),
    }

    transactor(
      contracts.TerminalV1,
      'deploy',
      [
        userAddress,
        utils.formatBytes32String(editingProjectInfo.handle),
        uploadedMetadata.cid,
        properties,
        metadata,
        editingPayoutMods.map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
          projectId: m.projectId || BigNumber.from(0).toHexString(),
          allocator: constants.AddressZero,
        })),
        editingTicketMods.map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
          allocator: constants.AddressZero,
        })),
      ],
      {
        onDone: () => setLoadingCreate(false),
        onConfirmed: () => {
          setDeployProjectModalVisible(false)

          // Add project dependency to metadata and logo files
          editMetadataForCid(uploadedMetadata.cid, {
            name: metadataNameForHandle(editingProjectInfo.handle),
          })
          editMetadataForCid(cidFromUrl(editingProjectInfo.metadata.logoUri), {
            name: logoNameForHandle(editingProjectInfo.handle),
          })

          window.location.hash = '/p/' + editingProjectInfo.handle
        },
      },
    )
  }

  const drawerStyle: Partial<DrawerProps> = {
    placement: 'right',
    width: Math.min(640, window.innerWidth * 0.9),
  }

  const buildSteps = useCallback(
    (steps: { title: string; callback: VoidFunction }[]) => (
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {steps.map((step, i) => {
          const disabled = currentStep < i
          const active = currentStep === i

          return (
            <div
              key={step.title}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                cursor: currentStep < i ? 'default' : 'pointer',
                padding: 10,
                borderRadius: radii.sm,
                border:
                  '1px solid ' +
                  (active
                    ? colors.stroke.action.primary
                    : colors.stroke.action.secondary),
              }}
              onClick={disabled ? () => null : step.callback}
            >
              <div
                style={{
                  fontWeight: active ? 600 : 500,
                  color: active
                    ? colors.text.action.primary
                    : disabled
                    ? colors.text.disabled
                    : colors.text.primary,
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  color: active
                    ? colors.icon.action.primary
                    : disabled
                    ? colors.icon.disabled
                    : colors.icon.primary,
                }}
              >
                {currentStep > i ? (
                  <CheckCircleFilled style={{ color: colors.icon.success }} />
                ) : (
                  <CaretRightFilled />
                )}
              </div>
            </div>
          )
        })}
        <p style={{ fontWeight: 500 }}>
          The JBX protocol is unaudited, and projects built on it may be
          vulnerable to bugs or exploits. Be smart!
        </p>
        <Button
          onClick={() => setDeployProjectModalVisible(true)}
          disabled={currentStep < steps.length}
          type="primary"
        >
          Deploy 🚀
        </Button>
      </Space>
    ),
    [currentStep, colors, radii],
  )

  const fundingCycle: FundingCycle = {
    ...editingFC,
    metadata: encodeFCMetadata(
      editingFC.reserved,
      editingFC.bondingCurveRate,
      1000,
    ),
  }

  return (
    <ProjectContext.Provider
      value={{
        projectType: 'standard',
        owner: userAddress,
        isOwner: false,
        currentFC: fundingCycle,
        currentPayoutMods: editingPayoutMods,
        currentTicketMods: editingTicketMods,
        metadata: editingProjectInfo.metadata,
        handle: editingProjectInfo.handle,
        projectId: BigNumber.from(0),
        queuedFC: undefined,
        queuedPayoutMods: undefined,
        queuedTicketMods: undefined,
        balanceInCurrency: BigNumber.from(0),
        tokenSymbol: undefined,
        tokenAddress: constants.AddressZero,
      }}
    >
      <Row
        style={{
          display: 'flex',
          padding: 40,
        }}
        gutter={40}
      >
        <Col xs={24} lg={7} style={{ marginBottom: 40 }}>
          <h1 style={{ marginBottom: 20 }}>Design your project 🎨</h1>

          {buildSteps([
            {
              title: 'Identity',
              callback: () => setProjectFormModalVisible(true),
            },
            {
              title: 'Funding',
              callback: () => setBudgetFormModalVisible(true),
            },
            {
              title: 'Spending',
              callback: () => setPayModsFormModalVisible(true),
            },
            {
              title: 'Reserved tokens',
              callback: () => setTicketingFormModalVisible(true),
            },
            {
              title: 'Rules',
              callback: () => setRulesFormModalVisible(true),
            },
            ...(isRecurring(editingFC) && editingFC.duration.gt(0)
              ? [
                  {
                    title: 'Incentives',
                    callback: () => setIncentivesFormModalVisible(true),
                  },
                ]
              : []),
          ])}
        </Col>

        <Col xs={24} lg={17}>
          <div
            style={{
              padding: 40,
              paddingTop: 30,
              borderRadius: radii.lg,
              border: '1px solid ' + colors.stroke.secondary,
            }}
          >
            <h3
              style={{
                marginBottom: 30,
                color: colors.text.secondary,
              }}
            >
              Preview:
            </h3>
            <Project showCurrentDetail={currentStep > 2} />
          </div>
        </Col>

        <Drawer
          {...drawerStyle}
          visible={projectFormModalVisible}
          onClose={() => {
            resetProjectForm()
            setProjectFormModalVisible(false)
          }}
        >
          <ProjectForm
            form={projectForm}
            onSave={async () => {
              await projectForm.validateFields()
              onProjectFormSaved()
              setProjectFormModalVisible(false)
              incrementStep(0)
            }}
          />
        </Drawer>

        <Drawer
          visible={budgetFormModalVisible}
          {...drawerStyle}
          onClose={() => {
            setBudgetFormModalVisible(false)
            incrementStep(1)
          }}
          destroyOnClose
        >
          <BudgetForm
            initialCurrency={editingFC.currency.toNumber() as CurrencyOption}
            initialTarget={fromWad(editingFC.target)}
            initialDuration={editingFC?.duration.toString()}
            onSave={async (currency, target, duration) => {
              onBudgetFormSaved(currency, target, duration)
              setBudgetFormModalVisible(false)
              incrementStep(1)
            }}
          />
        </Drawer>

        <Drawer
          visible={payModsModalVisible}
          {...drawerStyle}
          onClose={() => {
            setPayModsFormModalVisible(false)
            incrementStep(2)
          }}
          destroyOnClose
        >
          <PayModsForm
            initialMods={editingPayoutMods}
            currency={editingFC.currency.toNumber() as CurrencyOption}
            target={editingFC.target}
            fee={editingFC.fee}
            onSave={async mods => {
              onPayModsFormSaved(mods)
              setPayModsFormModalVisible(false)
              incrementStep(2)
            }}
          />
        </Drawer>

        <Drawer
          visible={ticketingFormModalVisible}
          {...drawerStyle}
          onClose={() => {
            resetTicketingForm()
            setTicketingFormModalVisible(false)
            incrementStep(3)
          }}
        >
          <TicketingForm
            form={ticketingForm}
            initialMods={editingTicketMods}
            onSave={async mods => {
              await ticketingForm.validateFields()
              onTicketingFormSaved(mods)
              setTicketingFormModalVisible(false)
              incrementStep(3)
            }}
          />
        </Drawer>

        <Drawer
          visible={rulesFormModalVisible}
          {...drawerStyle}
          onClose={() => {
            setRulesFormModalVisible(false)
            incrementStep(4)
          }}
        >
          <RulesForm
            initialBallot={editingFC.ballot}
            onSave={(ballot: string) => {
              onRulesFormSaved(ballot)
              setRulesFormModalVisible(false)
              incrementStep(4)
            }}
          />
        </Drawer>

        <Drawer
          visible={incentivesFormModalVisible}
          {...drawerStyle}
          onClose={() => {
            setIncentivesFormModalVisible(false)
            incrementStep(5)
          }}
        >
          <IncentivesForm
            initialDiscountRate={fromPermille(editingFC.discountRate)}
            initialBondingCurveRate={fromPerbicent(editingFC.bondingCurveRate)}
            onSave={async (discountRate: string, bondingCurveRate: string) => {
              await ticketingForm.validateFields()
              onIncentivesFormSaved(discountRate, bondingCurveRate)
              setIncentivesFormModalVisible(false)
              incrementStep(5)
            }}
          />
        </Drawer>

        <Modal
          visible={deployProjectModalVisible}
          okText={signerNetwork ? 'Deploy on ' + signerNetwork : 'Deploy'}
          onOk={deployProject}
          confirmLoading={loadingCreate}
          width={600}
          onCancel={() => setDeployProjectModalVisible(false)}
        >
          <ConfirmDeployProject />
        </Modal>
      </Row>
    </ProjectContext.Provider>
  )
}
