import { CaretRightFilled, CheckCircleFilled } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Drawer, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import Project from 'components/Dashboard/Project'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { constants, utils } from 'ethers'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useAppSelector,
  useEditingFundingCycleSelector,
} from 'hooks/AppSelector'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import { FCMetadata, FundingCycle } from 'models/funding-cycle'
import { ModRef } from 'models/mods'
import { useCallback, useContext, useLayoutEffect, useState } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { fromPerbicent, fromWad, parsePerbicent } from 'utils/formatNumber'
import { encodeFCMetadata, isRecurring } from 'utils/fundingCycle'
import {
  cidFromUrl,
  editMetadataForCid,
  logoNameForHandle,
  metadataNameForHandle,
  uploadProjectMetadata,
} from 'utils/ipfs'
import { feeForAmount } from 'utils/math'
import { FCProperties } from '../../models/funding-cycle-properties'
import BudgetForm, { BudgetFormFields } from './BudgetForm'
import ConfirmDeployProject from './ConfirmDeployProject'
import IncentivesForm, { IncentivesFormFields } from './IncentivesForm'
import PayModsForm from './PayModsForm'
import ProjectForm, { ProjectFormFields } from './ProjectForm'
import TicketingForm, { TicketingFormFields } from './TicketingForm'

export default function Create() {
  const { transactor, contracts, userAddress } = useContext(UserContext)
  const { signerNetwork } = useContext(NetworkContext)
  const { colors, radii } = useContext(ThemeContext).theme
  const [currentStep, setCurrentStep] = useState<number>(0)
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
  const [deployProjectModalVisible, setDeployProjectModalVisible] = useState<
    boolean
  >(false)
  const [loadingCreate, setLoadingCreate] = useState<boolean>()
  const [budgetForm] = useForm<BudgetFormFields>()
  const [projectForm] = useForm<ProjectFormFields>()
  const [ticketingForm] = useForm<TicketingFormFields>()
  const editingFC = useEditingFundingCycleSelector()
  const {
    info: editingProjectInfo,
    ticketMods: editingTicketMods,
    paymentMods: editingPaymentMods,
  } = useAppSelector(state => state.editingProject)
  const dispatch = useAppDispatch()

  const adminFeePercent = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'fee',
  })

  const incrementStep = () => setCurrentStep(currentStep + 1)

  const resetBudgetForm = () =>
    budgetForm.setFieldsValue({
      duration: editingFC?.duration.toString() ?? '0',
    })

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

  const onPayModsFormSaved = (mods: ModRef[]) =>
    dispatch(editingProjectActions.setPaymentMods(mods))

  const onBudgetFormSaved = (currency: CurrencyOption, target: string) => {
    const fields = budgetForm.getFieldsValue(true)
    dispatch(editingProjectActions.setTarget(target))
    dispatch(
      editingProjectActions.setDuration(parseFloat(fields.duration).toString()),
    )
    dispatch(editingProjectActions.setCurrency(currency))

    if (fields?.duration && target) incrementStep()
  }

  const onProjectFormSaved = () => {
    const fields = projectForm.getFieldsValue(true)
    dispatch(editingProjectActions.setName(fields.name))
    dispatch(editingProjectActions.setInfoUri(fields.infoUrl))
    dispatch(editingProjectActions.setHandle(fields.handle))
    dispatch(editingProjectActions.setLogoUri(fields.logoUrl))
  }

  const onTicketingFormSaved = (mods: ModRef[]) => {
    const fields = ticketingForm.getFieldsValue(true)
    dispatch(editingProjectActions.setReserved(fields.reserved))
    dispatch(editingProjectActions.setTicketMods(mods))
  }

  const onIncentivesFormSaved = (
    discountRate: number,
    bondingCurveRate: number,
  ) => {
    dispatch(editingProjectActions.setDiscountRate(discountRate.toString()))
    dispatch(
      editingProjectActions.setBondingCurveRate(bondingCurveRate.toString()),
    )
  }

  useLayoutEffect(() => {
    resetBudgetForm()
    resetProjectForm()
    resetTicketingForm()
  }, [])

  async function deployProject() {
    if (!transactor || !contracts || !adminFeePercent || !editingFC) return

    setLoadingCreate(true)

    const uploadedMetadata = await uploadProjectMetadata({
      name: editingProjectInfo.metadata.name,
      logoUri: editingProjectInfo.metadata.logoUri,
      infoUri: editingProjectInfo.metadata.infoUri,
    })

    if (!uploadedMetadata.success) {
      setLoadingCreate(false)
      return
    }

    const fee = feeForAmount(editingFC.target, adminFeePercent)

    if (!fee) return

    const targetWithFee = editingFC.target?.add(fee).toHexString()

    const properties: Record<keyof FCProperties, any> = {
      target: targetWithFee,
      currency: editingFC.currency.toNumber(),
      duration: editingFC.duration.toNumber(),
      discountRate: editingFC.discountRate.toNumber(),
      cycleLimit: editingFC.cycleLimit.toNumber(),
      ballot: constants.AddressZero,
    }

    const metadata: Omit<FCMetadata, 'version'> = {
      bondingCurveRate: editingFC.bondingCurveRate,
      reservedRate: editingFC.reserved,
      reconfigurationBondingCurveRate: parsePerbicent('100').toNumber(),
    }

    transactor(
      contracts.Juicer,
      'deploy',
      [
        userAddress,
        utils.formatBytes32String(editingProjectInfo.handle),
        uploadedMetadata.cid,
        properties,
        metadata,
        editingPaymentMods.map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
          projectId: m.projectId || BigNumber.from(0).toHexString(),
          allocator: constants.AddressZero,
        })),
        [],
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

  const buildSteps = useCallback(
    (steps: { title: string; callback: VoidFunction }[]) => (
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {steps.map((step, i) => {
          const disabled = currentStep < i
          const active = currentStep === i

          return (
            <div
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
                {currentStep > i ? <CheckCircleFilled /> : <CaretRightFilled />}
              </div>
            </div>
          )
        })}
        <Button
          onClick={() => setDeployProjectModalVisible(true)}
          disabled={currentStep < steps.length}
          type="primary"
        >
          Deploy
        </Button>
      </Space>
    ),
    [currentStep],
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
    <div
      style={{
        display: 'flex',
        padding: 40,
      }}
    >
      <div
        style={{
          marginRight: 40,
          // borderRight: '1px solid ' + colors.stroke.secondary,
          minWidth: 300,
        }}
      >
        <h1 style={{ marginBottom: 20 }}>Create your Juicebox 🚀</h1>

        {buildSteps([
          {
            title: 'Identity',
            callback: () => setProjectFormModalVisible(true),
          },
          {
            title: 'Spending',
            callback: () => setPayModsFormModalVisible(true),
          },
          {
            title: 'Funding',
            callback: () => setBudgetFormModalVisible(true),
          },
          {
            title: 'Reserved tokens',
            callback: () => setTicketingFormModalVisible(true),
          },
          ...(isRecurring(editingFC)
            ? [
                {
                  title: 'Incentives',
                  callback: () => setIncentivesFormModalVisible(true),
                },
              ]
            : []),
        ])}
      </div>

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
        <Project
          isOwner={false}
          showCurrentDetail={currentStep > 2}
          fundingCycle={fundingCycle}
          paymentMods={editingPaymentMods}
          ticketMods={editingTicketMods}
          metadata={editingProjectInfo.metadata}
          handle={editingProjectInfo.handle}
          projectId={BigNumber.from(0)}
        />
      </div>

      <Drawer
        visible={payModsModalVisible}
        placement="right"
        width={640}
        onClose={() => {
          setPayModsFormModalVisible(false)
        }}
        destroyOnClose
      >
        <PayModsForm
          initialMods={editingPaymentMods}
          currency={editingFC.currency.toNumber() as CurrencyOption}
          target={parseFloat(fromWad(editingFC.target))}
          onSave={async mods => {
            await budgetForm.validateFields()
            onPayModsFormSaved(mods)
            setPayModsFormModalVisible(false)
            incrementStep()
          }}
        />
      </Drawer>

      <Drawer
        visible={budgetFormModalVisible}
        placement="right"
        width={640}
        onClose={() => {
          resetBudgetForm()
          setBudgetFormModalVisible(false)
        }}
        destroyOnClose
      >
        <BudgetForm
          form={budgetForm}
          initialCurrency={editingFC.currency.toNumber() as CurrencyOption}
          initialTarget={fromWad(editingFC.target)}
          onSave={async (currency, target) => {
            await budgetForm.validateFields()
            onBudgetFormSaved(currency, target)
            setBudgetFormModalVisible(false)
            incrementStep()
          }}
        />
      </Drawer>

      <Drawer
        visible={projectFormModalVisible}
        placement="right"
        width={640}
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
            incrementStep()
          }}
        />
      </Drawer>

      <Drawer
        visible={incentivesFormModalVisible}
        placement="right"
        width={640}
        onClose={() => {
          setIncentivesFormModalVisible(false)
        }}
      >
        <IncentivesForm
          initialDiscountRate={editingFC.discountRate.toNumber()}
          initialBondingCurveRate={editingFC.bondingCurveRate}
          onSave={async (discountRate: number, bondingCurveRate: number) => {
            await ticketingForm.validateFields()
            onIncentivesFormSaved(discountRate, bondingCurveRate)
            setIncentivesFormModalVisible(false)
            incrementStep()
          }}
        />
      </Drawer>

      <Drawer
        visible={ticketingFormModalVisible}
        placement="right"
        width={640}
        onClose={() => {
          resetTicketingForm()
          setTicketingFormModalVisible(false)
        }}
      >
        <TicketingForm
          form={ticketingForm}
          initialMods={editingTicketMods}
          onSave={async mods => {
            await ticketingForm.validateFields()
            onTicketingFormSaved(mods)
            setTicketingFormModalVisible(false)
            incrementStep()
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
    </div>
  )
}
