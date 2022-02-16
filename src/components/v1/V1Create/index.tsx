import { CaretRightFilled, CheckCircleFilled } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Col, Drawer, DrawerProps, Row, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import V1Project from 'components/v1/V1Project'
import { NetworkContext } from 'contexts/networkContext'
import {
  V1ProjectContext,
  V1ProjectContextType,
} from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { constants } from 'ethers'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useAppSelector,
  useEditingV1FundingCycleSelector,
} from 'hooks/AppSelector'
import { useTerminalFee } from 'hooks/v1/TerminalFee'
import { useDeployProjectTx } from 'hooks/v1/transactor/DeployProjectTx'
import { V1ContractName } from 'models/v1/contracts'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { V1TerminalVersion } from 'models/v1/terminals'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { fromPerbicent, fromPermille, fromWad } from 'utils/formatNumber'
import {
  encodeFundingCycleMetadata,
  hasFundingTarget,
  hasFundingDuration,
} from 'utils/fundingCycle'
import {
  cidFromUrl,
  editMetadataForCid,
  logoNameForHandle,
  metadataNameForHandle,
  uploadProjectMetadata,
} from 'utils/ipfs'
import { getTerminalAddress } from 'utils/v1/terminals'

import BudgetForm from 'components/shared/forms/BudgetForm'
import IncentivesForm from 'components/shared/forms/IncentivesForm'
import PayModsForm from 'components/shared/forms/PayModsForm'
import ProjectDetailsForm, {
  ProjectDetailsFormFields,
} from 'components/shared/forms/ProjectDetailsForm'
import RestrictedActionsForm, {
  RestrictedActionsFormFields,
} from 'components/shared/forms/RestrictedActionsForm'
import RulesForm from 'components/shared/forms/RulesForm'
import TicketingForm, {
  TicketingFormFields,
} from 'components/shared/forms/TicketingForm'

import ConfirmDeployProject from './ConfirmDeployProject'

const terminalVersion: V1TerminalVersion = '1.1'

export default function V1Create() {
  const { signerNetwork, userAddress } = useContext(NetworkContext)
  const { colors, radii } = useContext(ThemeContext).theme
  const [currentStep, setCurrentStep] = useState<number>()
  const [viewedSteps, setViewedSteps] = useState<number[]>([])
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
  const [
    restrictedActionsFormModalVisible,
    setRestrictedActionsFormModalVisible,
  ] = useState<boolean>(false)
  const [deployProjectModalVisible, setDeployProjectModalVisible] =
    useState<boolean>(false)
  const [confirmStartOverVisible, setConfirmStartOverVisible] = useState(false)
  const [loadingCreate, setLoadingCreate] = useState<boolean>()
  const [projectForm] = useForm<ProjectDetailsFormFields>()
  const [ticketingForm] = useForm<TicketingFormFields>()
  const [restrictedActionsForm] = useForm<RestrictedActionsFormFields>()
  const editingFC = useEditingV1FundingCycleSelector()
  const {
    info: editingProjectInfo,
    ticketMods: editingTicketMods,
    payoutMods: editingPayoutMods,
  } = useAppSelector(state => state.editingProject)
  const dispatch = useAppDispatch()
  const deployProjectTx = useDeployProjectTx()

  const terminalFee = useTerminalFee(terminalVersion)

  useEffect(() => {
    if (terminalFee) {
      dispatch(
        editingProjectActions.setFee(fromPerbicent(terminalFee).toString()),
      )
    }
  }, [terminalFee, dispatch])

  const resetProjectForm = useCallback(() => {
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
  }, [
    editingProjectInfo.handle,
    editingProjectInfo.metadata.description,
    editingProjectInfo.metadata.discord,
    editingProjectInfo.metadata.infoUri,
    editingProjectInfo.metadata.logoUri,
    editingProjectInfo.metadata.name,
    editingProjectInfo.metadata.payButton,
    editingProjectInfo.metadata.payDisclosure,
    editingProjectInfo.metadata.twitter,
    projectForm,
  ])

  const resetTicketingForm = useCallback(
    () =>
      ticketingForm.setFieldsValue({
        reserved: parseFloat(fromPerbicent(editingFC?.reserved)),
      }),
    [editingFC?.reserved, ticketingForm],
  )

  const resetRestrictedActionsForm = useCallback(() => {
    if (
      editingFC?.payIsPaused !== null &&
      editingFC?.ticketPrintingIsAllowed !== null
    ) {
      restrictedActionsForm.setFieldsValue({
        payIsPaused: editingFC?.payIsPaused,
        ticketPrintingIsAllowed: editingFC?.ticketPrintingIsAllowed,
      })
    }
  }, [
    editingFC?.payIsPaused,
    editingFC?.ticketPrintingIsAllowed,
    restrictedActionsForm,
  ])

  useEffect(() => {
    resetProjectForm()
  }, [resetProjectForm])

  useEffect(() => {
    resetTicketingForm()
  }, [resetTicketingForm])

  useEffect(() => {
    resetRestrictedActionsForm()
  }, [resetRestrictedActionsForm])

  const onPayModsFormSaved = (mods: PayoutMod[]) =>
    dispatch(editingProjectActions.setPayoutMods(mods))

  const onBudgetFormSaved = (
    currency: V1CurrencyOption,
    target: string,
    duration: string,
  ) => {
    dispatch(editingProjectActions.setTarget(target))
    dispatch(editingProjectActions.setDuration(duration))
    dispatch(editingProjectActions.setCurrency(currency))

    if (!duration) {
      dispatch(editingProjectActions.setBallot(constants.AddressZero))
    }
  }

  const onProjectFormSaved = useCallback(() => {
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
  }, [dispatch, projectForm])

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

  const onRestrictedActionsFormSaved = () => {
    const fields = restrictedActionsForm.getFieldsValue(true)
    dispatch(
      editingProjectActions.setTicketPrintingIsAllowed(
        fields.ticketPrintingIsAllowed,
      ),
    )
    dispatch(editingProjectActions.setPayIsPaused(fields.payIsPaused))
  }

  const deployProject = useCallback(async () => {
    setLoadingCreate(true)

    const uploadedMetadata = await uploadProjectMetadata(
      editingProjectInfo.metadata,
    )

    if (!uploadedMetadata.success) {
      setLoadingCreate(false)
      return
    }

    deployProjectTx(
      {
        handle: editingProjectInfo.handle,
        projectMetadataCid: uploadedMetadata.cid,
        properties: {
          target: editingFC.target,
          currency: editingFC.currency,
          duration: editingFC.duration,
          discountRate: editingFC.discountRate,
          cycleLimit: editingFC.cycleLimit,
          ballot: editingFC.ballot,
        },
        fundingCycleMetadata: {
          reservedRate: editingFC.reserved.toNumber(),
          bondingCurveRate: editingFC.bondingCurveRate.toNumber(),
          reconfigurationBondingCurveRate:
            editingFC.bondingCurveRate.toNumber(),
          payIsPaused: editingFC.payIsPaused,
          ticketPrintingIsAllowed: editingFC.ticketPrintingIsAllowed,
          treasuryExtension: constants.AddressZero,
        },
        payoutMods: editingPayoutMods,
        ticketMods: editingTicketMods,
      },
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

          resetProjectForm()
          dispatch(editingProjectActions.resetState())

          window.location.hash = '/p/' + editingProjectInfo.handle
        },
      },
    )
  }, [
    dispatch,
    editingFC,
    editingProjectInfo.handle,
    editingProjectInfo.metadata,
    editingPayoutMods,
    editingTicketMods,
    resetProjectForm,
    deployProjectTx,
  ])

  const viewedCurrentStep = useCallback(() => {
    if (currentStep !== undefined && !viewedSteps.includes(currentStep)) {
      setViewedSteps([...viewedSteps, currentStep])
    }
    setCurrentStep(undefined)
  }, [currentStep, viewedSteps])

  const drawerStyle: Partial<DrawerProps> = useMemo(
    () => ({
      placement: 'right',
      width: Math.min(640, window.innerWidth * 0.9),
    }),
    [],
  )

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
          <Trans>
            The JBX protocol is unaudited, and projects built on it may be
            vulnerable to bugs or exploits. Be smart!
          </Trans>
        </p>

        <div
          style={{
            display: 'flex',
          }}
        >
          <Button
            onClick={() => setConfirmStartOverVisible(true)}
            type="ghost"
            block
            style={{ marginRight: 8 }}
          >
            <Trans>Start Over</Trans>
          </Button>

          <Button
            onClick={() => setDeployProjectModalVisible(true)}
            type="primary"
            block
            disabled={
              !editingProjectInfo?.metadata.name || !editingProjectInfo.handle
            }
          >
            <Trans>Review & Deploy</Trans>
          </Button>
        </div>
      </Space>
    ),
    [
      editingProjectInfo.metadata.name,
      editingProjectInfo.handle,
      currentStep,
      viewedSteps,
      radii.sm,
      colors.text.primary,
      colors.text.action.primary,
      colors.text.secondary,
      colors.stroke.secondary,
      colors.stroke.action.primary,
    ],
  )

  const fundingCycle: V1FundingCycle = useMemo(
    () => ({
      ...editingFC,
      metadata: encodeFundingCycleMetadata(
        editingFC.reserved,
        editingFC.bondingCurveRate,
        200,
        editingFC.payIsPaused,
        editingFC.ticketPrintingIsAllowed,
        constants.AddressZero,
        1,
      ),
    }),
    [editingFC],
  )

  const project = useMemo<V1ProjectContextType>(
    () => ({
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
      overflow: BigNumber.from(0),
      tokenSymbol: undefined,
      tokenAddress: constants.AddressZero,
      isPreviewMode: true,
      isArchived: false,
      terminal: {
        version: terminalVersion,
        name: V1ContractName.TerminalV1_1,
        address: getTerminalAddress(terminalVersion),
      },
    }),
    [
      editingPayoutMods,
      editingProjectInfo.handle,
      editingProjectInfo.metadata,
      editingTicketMods,
      fundingCycle,
      userAddress,
    ],
  )

  const spacing = 40

  return (
    <V1ProjectContext.Provider value={project}>
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
          <h1 style={{ marginBottom: spacing / 2 }}>
            <Trans>Design your project</Trans> 🎨
          </h1>

          {buildSteps([
            {
              title: t`Project details`,
              description: t`Project name, handle, links, and other details.`,
              callback: () => setProjectFormModalVisible(true),
            },
            {
              title: t`Funding cycle`,
              description: t`Your project's funding cycle target and duration.`,
              callback: () => setBudgetFormModalVisible(true),
            },
            {
              title: t`Funding distribution`,
              description: t`How your project will distribute funds.`,
              callback: () => setPayModsFormModalVisible(true),
            },
            {
              title: t`Reserved tokens`,
              description: t`Reward specific community members with tokens.`,
              callback: () => setTicketingFormModalVisible(true),
            },
            ...(editingFC?.duration.gt(0)
              ? [
                  {
                    title: t`Reconfiguration`,
                    description: t`Rules for how changes can be made to your project.`,
                    callback: () => setRulesFormModalVisible(true),
                  },
                ]
              : []),
            {
              title: t`Incentives`,
              description: t`Adjust incentives for paying your project.`,
              callback: () => setIncentivesFormModalVisible(true),
            },
            {
              title: t`Restricted actions`,
              description: t`Restrict payments and printing tokens.`,
              callback: () => setRestrictedActionsFormModalVisible(true),
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
            <Trans>Preview</Trans>:
          </h3>

          <div
            style={{
              paddingLeft: spacing,
              paddingRight: spacing,
              borderLeft: '1px solid ' + colors.stroke.tertiary,
            }}
          >
            <V1Project showCurrentDetail column />
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
          <Space direction="vertical" size="large">
            <h1>
              <Trans>Project details</Trans>
            </h1>
            <p>
              <Trans>
                Changes to these attributes can be made at any time and will be
                applied to your project immediately.
              </Trans>
            </p>
            <ProjectDetailsForm
              form={projectForm}
              onSave={async () => {
                await projectForm.validateFields()
                viewedCurrentStep()
                onProjectFormSaved()
                setProjectFormModalVisible(false)
              }}
            />
          </Space>
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
            initialCurrency={editingFC.currency.toNumber() as V1CurrencyOption}
            initialTarget={fromWad(editingFC.target)}
            initialDuration={editingFC.duration.toString()}
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
            currency={editingFC.currency.toNumber() as V1CurrencyOption}
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
            initialDiscountRate={
              editingFC.duration.eq(0)
                ? '0'
                : fromPermille(editingFC.discountRate)
            }
            initialBondingCurveRate={fromPerbicent(editingFC.bondingCurveRate)}
            disableDiscountRate={
              editingFC.duration.eq(0)
                ? t`Discount rate disabled while funding cycle duration is 0.`
                : undefined
            }
            disableBondingCurve={
              !hasFundingTarget(editingFC)
                ? t`Bonding curve disabled while no funding target is set.`
                : undefined
            }
            onSave={async (discountRate: string, bondingCurveRate: string) => {
              viewedCurrentStep()
              await ticketingForm.validateFields()
              onIncentivesFormSaved(discountRate, bondingCurveRate)
              setIncentivesFormModalVisible(false)
            }}
          />
        </Drawer>

        <Drawer
          visible={restrictedActionsFormModalVisible}
          {...drawerStyle}
          onClose={() => {
            setRestrictedActionsFormModalVisible(false)
            setCurrentStep(undefined)
          }}
        >
          <RestrictedActionsForm
            form={restrictedActionsForm}
            onSave={() => {
              onRestrictedActionsFormSaved()
              setRestrictedActionsFormModalVisible(false)
              setCurrentStep(undefined)
            }}
            hasFundingDuration={hasFundingDuration(editingFC)}
          />
        </Drawer>

        <Modal
          visible={deployProjectModalVisible}
          okText={
            userAddress
              ? signerNetwork
                ? 'Deploy project on ' + signerNetwork
                : 'Deploy project'
              : 'Connect wallet to deploy'
          }
          onOk={deployProject}
          confirmLoading={loadingCreate}
          width={800}
          onCancel={() => setDeployProjectModalVisible(false)}
        >
          <ConfirmDeployProject />
        </Modal>

        <Modal
          visible={confirmStartOverVisible}
          okText="Start Over"
          okType="danger"
          title="Are you sure you want to start over?"
          onOk={() => {
            resetProjectForm()
            dispatch(editingProjectActions.resetState())
            setConfirmStartOverVisible(false)
          }}
          onCancel={() => setConfirmStartOverVisible(false)}
        >
          This will erase of your all changes.
        </Modal>
      </Row>
    </V1ProjectContext.Provider>
  )
}
