import { BigNumber } from '@ethersproject/bignumber'
import { Button, Drawer, Steps } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import Project from 'components/Dashboard/Project'
import { layouts } from 'constants/styles/layouts'
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
import ProjectForm, { ProjectFormFields } from './ProjectForm'
import TicketingForm, { TicketingFormFields } from './TicketingForm'

export default function PlayCreate() {
  const { transactor, contracts, userAddress } = useContext(UserContext)
  const { signerNetwork } = useContext(NetworkContext)
  const { colors, radii } = useContext(ThemeContext).theme
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [budgetFormModalVisible, setBudgetFormModalVisible] = useState<boolean>(
    false,
  )
  const [projectFormModalVisible, setProjectFormModalVisible] = useState<
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

  const incrementStep = (num: number) =>
    num > currentStep ? setCurrentStep(num) : null

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
      discountRate: fromPerbicent(editingFC?.discountRate),
      reserved: fromPerbicent(editingFC?.reserved),
      bondingCurveRate: fromPerbicent(editingFC?.bondingCurveRate),
    })

  const onBudgetFormSaved = (
    currency: CurrencyOption,
    mods: ModRef[],
    target: number,
  ) => {
    const fields = budgetForm.getFieldsValue(true)
    dispatch(editingProjectActions.setTarget(target.toString()))
    dispatch(
      editingProjectActions.setDuration(parseFloat(fields.duration).toString()),
    )
    dispatch(editingProjectActions.setCurrency(currency))
    dispatch(editingProjectActions.setPaymentMods(mods))

    if (fields?.duration && target) incrementStep(1)

    // Ticketing form depends on budget recurring/one-time
    resetTicketingForm()
  }

  const onProjectFormSaved = () => {
    const fields = projectForm.getFieldsValue(true)
    dispatch(editingProjectActions.setName(fields.name))
    dispatch(editingProjectActions.setInfoUri(fields.infoUrl))
    dispatch(editingProjectActions.setHandle(fields.handle))
    dispatch(editingProjectActions.setLogoUri(fields.logoUrl))

    incrementStep(2)
  }

  const onTicketingFormSaved = (mods: ModRef[]) => {
    const fields = ticketingForm.getFieldsValue(true)
    dispatch(editingProjectActions.setDiscountRate(fields.discountRate))
    dispatch(editingProjectActions.setReserved(fields.reserved))
    dispatch(editingProjectActions.setBondingCurveRate(fields.bondingCurveRate))
    dispatch(editingProjectActions.setTicketMods(mods))

    incrementStep(3)
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
      <Steps progressDot responsive current={currentStep}>
        {steps.map((step, i) => (
          <Steps.Step
            key={step.title}
            title={
              <Button
                type={currentStep === i ? 'primary' : 'default'}
                onClick={step.callback}
                disabled={currentStep < i}
              >
                {i + 1}. {step.title}
              </Button>
            }
          />
        ))}
      </Steps>
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
    <div>
      <div
        style={{
          ...layouts.maxWidth,
          marginTop: 20,
          marginBottom: 20,
          borderRadius: radii.lg,
          padding: 40,
          border: '1px solid ' + colors.stroke.secondary,
        }}
      >
        <h1 style={{ marginBottom: 20 }}>Deploy your project 🚀</h1>

        {buildSteps([
          {
            title: 'Configure funding',
            callback: () => setBudgetFormModalVisible(true),
          },
          {
            title: 'Set project info',
            callback: () => setProjectFormModalVisible(true),
          },
          {
            title: 'Configure tickets',
            callback: () => setTicketingFormModalVisible(true),
          },
          {
            title: 'Deploy',
            callback: () => setDeployProjectModalVisible(true),
          },
        ])}
      </div>

      <div style={{ ...layouts.maxWidth, paddingBottom: 180 }}>
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
          initialMods={editingPaymentMods}
          initialCurrency={editingFC.currency.toNumber() as CurrencyOption}
          initialTarget={parseFloat(fromWad(editingFC.target))}
          onSave={async (currency, mods, target) => {
            await budgetForm.validateFields()
            onBudgetFormSaved(currency, mods, target)
            setBudgetFormModalVisible(false)
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
          incrementStep(2)
        }}
      >
        <ProjectForm
          form={projectForm}
          onSave={async () => {
            await projectForm.validateFields()
            onProjectFormSaved()
            setProjectFormModalVisible(false)
            incrementStep(2)
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
          cycleIsRecurring={isRecurring(fundingCycle)}
          initialMods={editingTicketMods}
          onSave={async mods => {
            await ticketingForm.validateFields()
            onTicketingFormSaved(mods)
            setTicketingFormModalVisible(false)
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
