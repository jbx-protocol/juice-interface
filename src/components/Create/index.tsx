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
import {
  defaultProjectState,
  editingProjectActions,
} from 'redux/slices/editingProject'
import { fromPerbicent, fromPermille, fromWad } from 'utils/formatNumber'
import { encodeFCMetadata, hasFundingTarget } from 'utils/fundingCycle'
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
  const { transactor, contracts, adminFeePercent } = useContext(UserContext)
  const { signerNetwork, userAddress } = useContext(NetworkContext)
  const { colors, radii } = useContext(ThemeContext).theme
  const [currentStep, setCurrentStep] = useState<number>()
  const [viewedSteps, setViewedSteps] = useState<number[]>([])
  const [payModsModalVisible, setPayModsFormModalVisible] = useState<boolean>(
    false,
  )
  const [budgetFormModalVisible, setBudgetFormModalVisible] = useState<boolean>(
    false,
  )
  const [projectFormModalVisible, setProjectFormModalVisible] = useState<
    boolean
  >(false)
  const [incentivesFormModalVisible, setIncentivesFormModalVisible] = useState<
    boolean
  >(false)
  const [ticketingFormModalVisible, setTicketingFormModalVisible] = useState<
    boolean
  >(false)
  const [rulesFormModalVisible, setRulesFormModalVisible] = useState<boolean>(
    false,
  )
  const [deployProjectModalVisible, setDeployProjectModalVisible] = useState<
    boolean
  >(false)
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
      dispatch(
        editingProjectActions.setFee(fromPerbicent(adminFeePercent).toString()),
      )
    }
  }, [adminFeePercent])

  const resetProjectForm = () =>
    projectForm.setFieldsValue({
      name: editingProjectInfo?.metadata.name ?? '',
      infoUri: editingProjectInfo?.metadata.infoUri ?? '',
      handle: editingProjectInfo?.handle ?? '',
      description: editingProjectInfo?.metadata.description ?? '',
      logoUri: editingProjectInfo?.metadata.logoUri ?? '',
      twitter: editingProjectInfo?.metadata.twitter ?? '',
      discord: editingProjectInfo?.metadata.discord ?? '',
      payButton: editingProjectInfo?.metadata.payButton ?? '',
      payDisclosure: editingProjectInfo?.metadata.payDisclosure ?? '',
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
  }

  const onProjectFormSaved = () => {
    const fields = projectForm.getFieldsValue(true)
    dispatch(editingProjectActions.setName(fields.name))
    dispatch(editingProjectActions.setInfoUri(fields.infoUri))
    dispatch(editingProjectActions.setHandle(fields.handle))
    dispatch(editingProjectActions.setLogoUri(fields.logoUri))
    dispatch(editingProjectActions.setDescription(fields.description))
    dispatch(editingProjectActions.setTwitter(fields.twitter))
    dispatch(editingProjectActions.setDiscord(fields.discord))
    dispatch(editingProjectActions.setPayButton(fields.payButton))
    dispatch(editingProjectActions.setPayDisclosure(fields.payDisclosure))
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
    dispatch(editingProjectActions.setState(defaultProjectState))
  }, [])

  async function deployProject() {
    if (!transactor || !contracts || !editingFC) return

    setLoadingCreate(true)

    const uploadedMetadata = await uploadProjectMetadata(
      editingProjectInfo.metadata,
    )

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
      currency: hasFundingTarget(editingFC) ? editingFC.currency.toNumber() : 0,
      duration: editingFC.duration.toNumber(),
      discountRate: hasFundingTarget(editingFC)
        ? editingFC.discountRate.toNumber()
        : 0,
      cycleLimit: editingFC.cycleLimit.toNumber(),
      ballot: constants.AddressZero,
    }

    const metadata: Omit<FCMetadata, 'version'> = {
      reservedRate: editingFC.reserved.toNumber(),
      bondingCurveRate: editingFC.bondingCurveRate.toNumber(),
      reconfigurationBondingCurveRate: editingFC.bondingCurveRate.toNumber(),
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

  function viewedCurrentStep() {
    if (currentStep !== undefined && !viewedSteps.includes(currentStep)) {
      setViewedSteps([...viewedSteps, currentStep])
    }
    setCurrentStep(undefined)
  }

  const drawerStyle: Partial<DrawerProps> = {
    placement: 'right',
    width: Math.min(640, window.innerWidth * 0.9),
  }

  const buildSteps = useCallback(
    (
      steps: {
        title: string
        description?: string
        callback: VoidFunction
      }[],
    ) => (
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {steps.map((step, i) => {
          const active = currentStep === i
          const viewed = viewedSteps.includes(i)

          return (
            <div
              key={step.title}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
                padding: 15,
                borderRadius: radii.sm,
                fontWeight: viewed ? 500 : 600,
                color: viewed
                  ? colors.text.primary
                  : colors.text.action.primary,
                border: viewed
                  ? '1px solid ' + colors.stroke.secondary
                  : '1px solid' + colors.stroke.action.primary,
                borderLeftWidth: active ? 10 : 1,
              }}
              onClick={() => {
                if (currentStep !== undefined) return
                setCurrentStep(i)
                step.callback()
              }}
            >
              <div
                style={{
                  marginRight: 15,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  marginRight: 10,
                  flex: 1,
                }}
              >
                <div>{step.title}</div>
                <div
                  style={{
                    color: colors.text.secondary,
                    fontWeight: 400,
                    fontSize: '0.75rem',
                  }}
                >
                  {step.description}
                </div>
              </div>
              <div
                style={{
                  alignSelf: 'center',
                  color: viewed
                    ? colors.text.secondary
                    : colors.text.action.primary,
                }}
              >
                {viewed ? <CheckCircleFilled /> : <CaretRightFilled />}
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
          type="primary"
          block
          disabled={
            !projectForm.getFieldValue('name') ||
            !projectForm.getFieldValue('handle')
          }
        >
          Review & Deploy
        </Button>
      </Space>
    ),
    [currentStep, colors, radii],
  )

  const spacing = 40

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
        createdAt: new Date().valueOf() / 1000,
        projectType: 'standard',
        owner: userAddress,
        earned: BigNumber.from(0),
        currentFC: fundingCycle,
        currentPayoutMods: editingPayoutMods,
        currentTicketMods: editingTicketMods,
        metadata: editingProjectInfo.metadata,
        handle: editingProjectInfo.handle,
        projectId: BigNumber.from(0),
        queuedFC: undefined,
        queuedPayoutMods: undefined,
        queuedTicketMods: undefined,
        balance: BigNumber.from(0),
        balanceInCurrency: BigNumber.from(0),
        tokenSymbol: undefined,
        tokenAddress: constants.AddressZero,
        isPreviewMode: true,
        isArchived: false,
      }}
    >
      <Row style={{ marginTop: 40 }}>
        <Col
          xs={24}
          md={10}
          style={{
            marginBottom: spacing * 2,
            paddingLeft: spacing,
            paddingRight: spacing,
          }}
        >
          <h1 style={{ marginBottom: spacing / 2 }}>Design your project 🎨</h1>

          {buildSteps([
            {
              title: 'Appearance',
              description: 'Project name, handle, links, and other details.',
              callback: () => setProjectFormModalVisible(true),
            },
            {
              title: 'Funding Cycles',
              description: 'How your project will earn and manage funds.',
              callback: () => setBudgetFormModalVisible(true),
            },
            {
              title: 'Distribution',
              description: 'How your project will distribute funds.',
              callback: () => setPayModsFormModalVisible(true),
            },
            {
              title: 'Reserved Tokens',
              description: 'Reward specific community members with tokens.',
              callback: () => setTicketingFormModalVisible(true),
            },
            {
              title: 'Reconfiguration',
              description: 'Rules for how changes can be made to your project.',
              callback: () => setRulesFormModalVisible(true),
            },
            {
              title: 'Incentives',
              description: 'Adjust incentivizes for paying your project.',
              callback: () => setIncentivesFormModalVisible(true),
            },
          ])}
        </Col>

        <Col xs={24} md={14}>
          <h3
            style={{
              marginTop: 5,
              marginBottom: spacing / 2,
              color: colors.text.secondary,
              paddingLeft: spacing,
              paddingRight: spacing,
            }}
          >
            Preview:
          </h3>

          <div
            style={{
              paddingLeft: spacing,
              paddingRight: spacing,
              borderLeft: '1px solid ' + colors.stroke.tertiary,
            }}
          >
            <Project showCurrentDetail column />
          </div>
        </Col>

        <Drawer
          {...drawerStyle}
          visible={projectFormModalVisible}
          onClose={() => {
            setCurrentStep(undefined)
            resetProjectForm()
            setProjectFormModalVisible(false)
          }}
        >
          <ProjectForm
            form={projectForm}
            onSave={async () => {
              await projectForm.validateFields()
              viewedCurrentStep()
              onProjectFormSaved()
              setProjectFormModalVisible(false)
            }}
          />
        </Drawer>

        <Drawer
          visible={budgetFormModalVisible}
          {...drawerStyle}
          onClose={() => {
            viewedCurrentStep()
            setBudgetFormModalVisible(false)
          }}
          destroyOnClose
        >
          <BudgetForm
            initialCurrency={editingFC.currency.toNumber() as CurrencyOption}
            initialTarget={fromWad(editingFC.target)}
            initialDuration={editingFC?.duration.toString()}
            onSave={async (currency, target, duration) => {
              viewedCurrentStep()
              onBudgetFormSaved(currency, target, duration)
              setBudgetFormModalVisible(false)
            }}
          />
        </Drawer>

        <Drawer
          visible={payModsModalVisible}
          {...drawerStyle}
          onClose={() => {
            viewedCurrentStep()
            setPayModsFormModalVisible(false)
          }}
          destroyOnClose
        >
          <PayModsForm
            initialMods={editingPayoutMods}
            currency={editingFC.currency.toNumber() as CurrencyOption}
            target={editingFC.target}
            fee={editingFC.fee}
            onSave={async mods => {
              viewedCurrentStep()
              onPayModsFormSaved(mods)
              setPayModsFormModalVisible(false)
            }}
          />
        </Drawer>

        <Drawer
          visible={ticketingFormModalVisible}
          {...drawerStyle}
          onClose={() => {
            viewedCurrentStep()
            resetTicketingForm()
            setTicketingFormModalVisible(false)
          }}
        >
          <TicketingForm
            form={ticketingForm}
            initialMods={editingTicketMods}
            onSave={async mods => {
              viewedCurrentStep()
              await ticketingForm.validateFields()
              onTicketingFormSaved(mods)
              setTicketingFormModalVisible(false)
            }}
          />
        </Drawer>

        <Drawer
          visible={rulesFormModalVisible}
          {...drawerStyle}
          onClose={() => {
            viewedCurrentStep()
            setRulesFormModalVisible(false)
          }}
        >
          <RulesForm
            initialBallot={editingFC.ballot}
            onSave={(ballot: string) => {
              viewedCurrentStep()
              onRulesFormSaved(ballot)
              setRulesFormModalVisible(false)
            }}
          />
        </Drawer>

        <Drawer
          visible={incentivesFormModalVisible}
          {...drawerStyle}
          onClose={() => {
            viewedCurrentStep()
            setIncentivesFormModalVisible(false)
          }}
        >
          <IncentivesForm
            initialDiscountRate={fromPermille(editingFC.discountRate)}
            initialBondingCurveRate={fromPerbicent(editingFC.bondingCurveRate)}
            showBondingCurve={hasFundingTarget(editingFC)}
            onSave={async (discountRate: string, bondingCurveRate: string) => {
              viewedCurrentStep()
              await ticketingForm.validateFields()
              onIncentivesFormSaved(discountRate, bondingCurveRate)
              setIncentivesFormModalVisible(false)
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
