import { BigNumber } from '@ethersproject/bignumber'
import { Button, Drawer, Steps } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import Project from 'components/Dashboard/Project'
import { layouts } from 'constants/styles/layouts'
import { SECONDS_MULTIPLIER } from 'constants/units'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useAppSelector,
  useEditingFundingCycleSelector,
} from 'hooks/AppSelector'
import { useCallback, useContext, useEffect, useState } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { fromPerMille, fromWad } from 'utils/formatCurrency'
import { encodeFCMetadata } from 'utils/fundingCycle'
import { feeForAmount } from 'utils/math'

import { FundingCycle } from '../../models/funding-cycle'
import BudgetInfo, { BudgetFormFields } from './BudgetForm'
import ConfirmDeployProject from './ConfirmDeployProject'
import ProjectForm, { ProjectFormFields } from './ProjectForm'
import TicketingForm, { TicketingFormFields } from './TicketingForm'

export default function PlayCreate() {
  const {
    transactor,
    contracts,
    onNeedProvider,
    userAddress,
    network,
    adminFeePercent,
  } = useContext(UserContext)
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
  const [budgetForm] = useForm<BudgetFormFields>()
  const [projectForm] = useForm<ProjectFormFields>()
  const [ticketingForm] = useForm<TicketingFormFields>()
  const editingFC = useEditingFundingCycleSelector()
  const editingProject = useAppSelector(
    state => state.editingProject.projectIdentifier,
  )
  const creatingProject = useAppSelector(state => state.editingProject.loading)
  const dispatch = useAppDispatch()

  const incrementStep = (num: number) =>
    num > currentStep ? setCurrentStep(num) : null

  const resetBudgetForm = () =>
    budgetForm.setFieldsValue({
      target: fromWad(editingFC?.target) ?? '0',
      duration: (editingFC?.duration / SECONDS_MULTIPLIER).toString() ?? '0',
      currency: editingFC?.currency ?? 0,
    })

  const resetProjectForm = () =>
    projectForm.setFieldsValue({
      name: editingProject?.name ?? '',
      link: editingProject?.link ?? '',
      handle: editingProject?.handle ?? '',
      logoUri: editingProject?.logoUri ?? '',
    })

  const resetTicketingForm = () =>
    ticketingForm.setFieldsValue({
      discountRate: fromPerMille(editingFC?.discountRate),
      reserved: fromPerMille(editingFC?.reserved),
      bondingCurveRate: fromPerMille(editingFC?.bondingCurveRate),
    })

  const onBudgetFormSaved = () => {
    const fields = budgetForm.getFieldsValue(true)
    dispatch(editingProjectActions.setTarget(fields.target))
    dispatch(
      editingProjectActions.setDuration(
        (parseInt(fields.duration) * SECONDS_MULTIPLIER).toString(),
      ),
    )
    dispatch(editingProjectActions.setCurrency(fields.currency))

    if (fields?.duration && fields?.target) {
      incrementStep(1)
    }
  }

  const onProjectFormSaved = () => {
    const fields = projectForm.getFieldsValue(true)
    dispatch(editingProjectActions.setName(fields.name))
    dispatch(editingProjectActions.setLink(fields.link))
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
    if (editingProject.name && editingFC?.duration && editingFC?.target) {
      setCurrentStep(1)
    }

    resetBudgetForm()
    resetProjectForm()
    resetTicketingForm()
  }, [])

  function deployProject() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!adminFeePercent || !editingFC) return

    dispatch(editingProjectActions.setLoading(true))

    const fee = feeForAmount(editingFC.target, adminFeePercent)

    if (!fee) return

    const targetWithFee = editingFC.target?.add(fee).toHexString()

    transactor(
      contracts.Juicer,
      'deploy',
      [
        userAddress,
        editingProject.name,
        editingProject.handle,
        editingProject.logoUri,
        editingProject.link || '',
        targetWithFee,
        BigNumber.from(editingFC.currency).toHexString(),
        BigNumber.from(editingFC.duration).toHexString(),
        BigNumber.from(editingFC.discountRate).toHexString(),
        {
          reservedRate: BigNumber.from(editingFC.reserved).toHexString(),
          bondingCurveRate: BigNumber.from(
            editingFC.bondingCurveRate,
          ).toHexString(),
        },
        constants.AddressZero,
      ],
      {
        onDone: () => dispatch(editingProjectActions.setLoading(false)),
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
          onSave={async () => {
            await ticketingForm.validateFields()
            onTicketingFormSaved()
            setTicketingFormModalVisible(false)
          }}
        />
      </Drawer>

      <Modal
        visible={deployProjectModalVisible}
        okText={'Deploy on ' + network}
        onOk={deployProject}
        confirmLoading={creatingProject}
        width={600}
        onCancel={() => setDeployProjectModalVisible(false)}
      >
        <ConfirmDeployProject />
      </Modal>
    </div>
  )
}
