import { BigNumber } from '@ethersproject/bignumber'
import { Button, Drawer, Steps } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import Project from 'components/Dashboard/Project'
import { secondsMultiplier } from 'constants/seconds-in-day'
import { colors } from 'constants/styles/colors'
import { layouts } from 'constants/styles/layouts'
import { UserContext } from 'contexts/userContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector, useEditingBudgetSelector } from 'hooks/AppSelector'
import { BudgetCurrency } from 'models/budget-currency'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { fromPerMille, fromWad } from 'utils/formatCurrency'
import { feeForAmount } from 'utils/math'

import ConfirmCreateProject from './ConfirmCreateProject'
import FundingDetails, { FundingDetailsFormFields } from './FundingDetails'
import ProjectDetails, { ProjectDetailsFormFields } from './ProjectDetails'
import ProjectInfo, { ProjectInfoFormFields } from './ProjectInfo'

export default function PlayCreate() {
  const {
    transactor,
    contracts,
    onNeedProvider,
    userAddress,
    network,
    adminFeePercent,
  } = useContext(UserContext)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [
    projectInfoModalVisible,
    setProjectInfoModalVisible,
  ] = useState<boolean>(false)
  const [
    projectDetailsModalVisible,
    setProjectDetailsModalVisible,
  ] = useState<boolean>(false)
  const [
    fundingDetailsModalVisible,
    setFundingDetailsModalVisible,
  ] = useState<boolean>(false)
  const [
    createProjectModalVisible,
    setCreateProjectModalVisible,
  ] = useState<boolean>(false)
  const [projectInfoForm] = useForm<ProjectInfoFormFields>()
  const [projectDetailsForm] = useForm<ProjectDetailsFormFields>()
  const [fundingDetailsForm] = useForm<FundingDetailsFormFields>()
  const editingBudget = useEditingBudgetSelector()
  const editingProject = useAppSelector(
    state => state.editingProject.projectIdentifier,
  )
  const creatingProject = useAppSelector(state => state.editingProject.loading)
  const dispatch = useAppDispatch()

  const setHandleFromName = (name: string) => {
    const handle = name.split(' ').join('').substr(0, 24) ?? ''
    dispatch(editingProjectActions.setHandle(handle))

    projectDetailsForm.setFieldsValue({
      handle,
    })
  }

  const incrementStep = (num: number) =>
    num > currentStep ? setCurrentStep(num) : null

  const resetBudgetForm = () =>
    projectInfoForm.setFieldsValue({
      name: editingProject?.name ?? '',
      target: fromWad(editingBudget?.target) ?? '0',
      duration:
        editingBudget?.duration.div(secondsMultiplier).toString() ?? '0',
      currency: (editingBudget?.currency.toString() ?? '0') as BudgetCurrency,
    })

  const resetProjectDetailsForm = () => {
    projectDetailsForm.setFieldsValue({
      link: editingProject?.link ?? '',
      handle: editingProject?.handle ?? '',
      logoUri: editingProject?.logoUri ?? '',
    })
  }

  const resetFundingDetailsForm = () =>
    fundingDetailsForm.setFieldsValue({
      discountRate: fromPerMille(editingBudget?.discountRate),
      reserved: fromPerMille(editingBudget?.reserved),
      bondingCurveRate: editingBudget?.bondingCurveRate.toString(),
    })

  const onProjectInfoFormSaved = () => {
    const fields = projectInfoForm.getFieldsValue(true)
    dispatch(editingProjectActions.setName(fields.name))
    dispatch(editingProjectActions.setTarget(fields.target))
    dispatch(
      editingProjectActions.setDuration(
        (parseInt(fields.duration) * secondsMultiplier).toString(),
      ),
    )
    dispatch(editingProjectActions.setCurrency(fields.currency))

    if (!editingProject.handle) setHandleFromName(fields.name)

    if (fields?.name && fields?.duration && fields?.target) {
      incrementStep(1)
    }
  }

  const onProjectDetailsFormSaved = () => {
    const fields = projectDetailsForm.getFieldsValue(true)
    dispatch(editingProjectActions.setLink(fields.link))
    dispatch(editingProjectActions.setHandle(fields.handle))
    dispatch(editingProjectActions.setLogoUri(fields.logoUri))
    incrementStep(2)
  }

  const onAdvancedFormSaved = () => {
    const fields = fundingDetailsForm.getFieldsValue(true)
    dispatch(editingProjectActions.setDiscountRate(fields.discountRate))
    dispatch(editingProjectActions.setReserved(fields.reserved))

    incrementStep(3)
  }

  useEffect(() => {
    if (
      editingProject.name &&
      editingBudget?.duration &&
      editingBudget?.target
    ) {
      setCurrentStep(1)
    }

    resetBudgetForm()
    resetProjectDetailsForm()
    resetFundingDetailsForm()

    setHandleFromName(editingProject?.name)
  }, [])

  function createProject() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!adminFeePercent || !editingBudget) return

    dispatch(editingProjectActions.setLoading(true))

    const fee = feeForAmount(editingBudget.target, adminFeePercent)

    if (!fee) return

    const targetWithFee = editingBudget.target?.add(fee).toHexString()

    // TODO
    const bondingCurveRate = BigNumber.from(382).toHexString()

    transactor(
      contracts.Juicer,
      'deploy',
      [
        userAddress,
        editingProject.name,
        editingProject.handle,
        editingProject.logoUri,
        targetWithFee,
        editingBudget.currency.toHexString(),
        editingBudget.duration.toHexString(),
        editingProject.link || '',
        editingBudget.discountRate.toHexString(),
        bondingCurveRate,
        editingBudget.reserved.toHexString(),
      ],
      {
        onDone: () => dispatch(editingProjectActions.setLoading(false)),
        onConfirmed: () => {
          setCreateProjectModalVisible(false)
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

  return (
    <div>
      <div style={{ ...layouts.maxWidth, paddingBottom: 180 }}>
        <Project
          isOwner={false}
          showCurrentDetail={currentStep > 2}
          budget={editingBudget}
          project={editingProject}
          projectId={BigNumber.from(0)}
        />
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 40,
          paddingTop: 20,
          paddingBottom: 20,
          background: colors.background,
          zIndex: 100,
        }}
      >
        <h1>Launch on Juice 🚀</h1>

        {buildSteps([
          {
            title: 'Set the basics',
            callback: () => setProjectInfoModalVisible(true),
          },
          {
            title: 'Project details',
            callback: () => setProjectDetailsModalVisible(true),
          },
          {
            title: 'Funding details',
            callback: () => setFundingDetailsModalVisible(true),
          },
          {
            title: 'Deploy project',
            callback: () => setCreateProjectModalVisible(true),
          },
        ])}
      </div>

      <Drawer
        visible={projectInfoModalVisible}
        placement="right"
        width={640}
        onClose={() => {
          resetBudgetForm()
          setProjectInfoModalVisible(false)
        }}
      >
        <ProjectInfo
          form={projectInfoForm}
          onSave={() => {
            onProjectInfoFormSaved()
            setProjectInfoModalVisible(false)
          }}
        />
      </Drawer>

      <Drawer
        visible={projectDetailsModalVisible}
        placement="right"
        width={640}
        onClose={() => {
          resetProjectDetailsForm()
          setProjectDetailsModalVisible(false)
          incrementStep(2)
        }}
      >
        <ProjectDetails
          form={projectDetailsForm}
          onSave={() => {
            onProjectDetailsFormSaved()
            setProjectDetailsModalVisible(false)
            incrementStep(2)
          }}
        />
      </Drawer>

      <Drawer
        visible={fundingDetailsModalVisible}
        placement="right"
        width={640}
        onClose={() => {
          resetFundingDetailsForm()
          setFundingDetailsModalVisible(false)
        }}
      >
        <FundingDetails
          form={fundingDetailsForm}
          onSave={() => {
            onAdvancedFormSaved()
            setFundingDetailsModalVisible(false)
          }}
        />
      </Drawer>

      <Modal
        visible={createProjectModalVisible}
        okText={'Deploy on ' + network}
        onOk={createProject}
        confirmLoading={creatingProject}
        width={600}
        onCancel={() => setCreateProjectModalVisible(false)}
      >
        <ConfirmCreateProject />
      </Modal>
    </div>
  )
}
