import { BigNumber } from '@ethersproject/bignumber'
import { Button, Drawer, notification, Steps } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import Project from 'components/Dashboard/Project'
import { layouts } from 'constants/styles/layouts'
import { SECONDS_IN_DAY } from 'constants/units'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useAppSelector,
  useEditingFundingCycleSelector,
} from 'hooks/AppSelector'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { ProjectMetadata } from 'models/project-metadata'
import { useCallback, useContext, useEffect, useState } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { fromWad, parsePerbicent } from 'utils/formatNumber'
import { encodeFCMetadata, isRecurring } from 'utils/fundingCycle'
import { ipfsCidUrl, IPFS_TAGS, uploadFile } from 'utils/ipfs'
import { feeForAmount } from 'utils/math'
import { FundingCycle } from '../../models/funding-cycle'
import { fromPerbicent } from '../../utils/formatNumber'
import BudgetInfo, { BudgetFormFields } from './BudgetForm'
import ConfirmDeployProject from './ConfirmDeployProject'
import ProjectForm, { ProjectFormFields } from './ProjectForm'
import TicketingForm, { TicketingFormFields } from './TicketingForm'

export default function PlayCreate() {
  const { transactor, contracts, userAddress } = useContext(UserContext)
  const { onNeedProvider, signerNetwork } = useContext(NetworkContext)
  const { colors, radii } = useContext(ThemeContext).theme
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [budgetFormModalVisible, setBudgetFormModalVisible] = useState<boolean>(
    false,
  )
  const [
    projectFormModalVisible,
    setProjectFormModalVisible,
  ] = useState<boolean>(false)
  const [
    ticketingFormModalVisible,
    setTicketingFormModalVisible,
  ] = useState<boolean>(false)
  const [
    deployProjectModalVisible,
    setDeployProjectModalVisible,
  ] = useState<boolean>(false)
  const [loadingCreate, setLoadingCreate] = useState<boolean>()
  const [budgetForm] = useForm<BudgetFormFields>()
  const [projectForm] = useForm<ProjectFormFields>()
  const [ticketingForm] = useForm<TicketingFormFields>()
  const editingFC = useEditingFundingCycleSelector()
  const editingProject = useAppSelector(
    state => state.editingProject.projectIdentifier,
  )
  const dispatch = useAppDispatch()

  const adminFeePercent = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'fee',
  })

  const incrementStep = (num: number) =>
    num > currentStep ? setCurrentStep(num) : null

  const resetBudgetForm = () =>
    budgetForm.setFieldsValue({
      target: fromWad(editingFC?.target) ?? '0',
      duration: (editingFC?.duration / SECONDS_IN_DAY).toString() ?? '0',
      currency: editingFC?.currency ?? 0,
    })

  const resetProjectForm = () =>
    projectForm.setFieldsValue({
      name: editingProject?.metadata.name ?? '',
      infoUri: editingProject?.link ?? '',
      handle: editingProject?.handle ?? '',
      logoUri: editingProject?.metadata.logoUri ?? '',
    })

  const resetTicketingForm = () =>
    ticketingForm.setFieldsValue({
      discountRate: fromPerbicent(editingFC?.discountRate),
      reserved: fromPerbicent(editingFC?.reserved),
      bondingCurveRate: fromPerbicent(editingFC?.bondingCurveRate),
    })

  const onBudgetFormSaved = () => {
    const fields = budgetForm.getFieldsValue(true)
    dispatch(editingProjectActions.setTarget(fields.target))
    dispatch(
      editingProjectActions.setDuration(
        (parseFloat(fields.duration) * SECONDS_IN_DAY).toString(),
      ),
    )
    dispatch(editingProjectActions.setCurrency(fields.currency))

    if (fields?.duration && fields?.target) {
      incrementStep(1)
    }

    // Ticketing form depends on budget recurring/one-time
    resetTicketingForm()
  }

  const onProjectFormSaved = () => {
    const fields = projectForm.getFieldsValue(true)
    dispatch(editingProjectActions.setName(fields.name))
    dispatch(editingProjectActions.setInfoUri(fields.infoUri))
    dispatch(editingProjectActions.setHandle(fields.handle))
    dispatch(editingProjectActions.setLogoUri(fields.logoUri))

    incrementStep(2)
  }

  const onTicketingFormSaved = () => {
    const fields = ticketingForm.getFieldsValue(true)
    dispatch(editingProjectActions.setDiscountRate(fields.discountRate))
    dispatch(editingProjectActions.setReserved(fields.reserved))
    dispatch(editingProjectActions.setBondingCurveRate(fields.bondingCurveRate))

    incrementStep(3)
  }

  useEffect(() => {
    if (
      editingProject.metadata.name &&
      editingFC?.duration &&
      editingFC?.target
    ) {
      setCurrentStep(1)
    }

    resetBudgetForm()
    resetProjectForm()
    resetTicketingForm()
  }, [])

  async function deployProject() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!adminFeePercent || !editingFC) return

    setLoadingCreate(true)

    const metadata: ProjectMetadata = {
      name: editingProject.metadata.name,
      logoUri: editingProject.metadata.logoUri,
      infoUri: editingProject.metadata.infoUri,
    }

    const now = new Date().valueOf()

    const uploadedMetadata = await uploadFile(
      new File([JSON.stringify(metadata)], 'juice-project-metadata.json', {
        lastModified: now,
      }),
      {
        metadata: { tag: IPFS_TAGS.METADATA },
      },
    )

    if (!uploadedMetadata.success) {
      notification.error({
        key: now.toString(),
        message: 'Failed to upload project metadata',
        description: uploadedMetadata.err,
        duration: 0,
      })

      setLoadingCreate(false)
      return
    }

    const fee = feeForAmount(editingFC.target, adminFeePercent)

    if (!fee) return

    const targetWithFee = editingFC.target?.add(fee).toHexString()

    transactor(
      contracts.Juicer,
      'deploy',
      [
        userAddress,
        editingProject.handle,
        ipfsCidUrl(uploadedMetadata.cid),
        targetWithFee,
        BigNumber.from(editingFC.currency).toHexString(),
        BigNumber.from(editingFC.duration).toHexString(),
        BigNumber.from(editingFC.discountRate).toHexString(),
        {
          reservedRate: BigNumber.from(editingFC.reserved).toHexString(),
          bondingCurveRate: BigNumber.from(
            editingFC.bondingCurveRate,
          ).toHexString(),
          reconfigurationBondingCurveRate: parsePerbicent('100').toHexString(),
        },
        constants.AddressZero,
      ],
      {
        onDone: () => setLoadingCreate(false),
        onConfirmed: () => {
          setDeployProjectModalVisible(false)
          window.location.hash = '/p/' + editingProject.handle
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
          project={editingProject}
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
      >
        <BudgetInfo
          form={budgetForm}
          onSave={async () => {
            await budgetForm.validateFields()
            onBudgetFormSaved()
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
          onSave={async () => {
            await ticketingForm.validateFields()
            onTicketingFormSaved()
            setTicketingFormModalVisible(false)
          }}
        />
      </Drawer>

      <Modal
        visible={deployProjectModalVisible}
        okText={'Deploy on ' + signerNetwork}
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
