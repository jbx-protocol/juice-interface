import { BigNumber } from '@ethersproject/bignumber'
import { Button, ButtonProps, Drawer, Steps } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import Project from 'components/Owner/Project'
import { TicketsFormFields } from 'components/shared/forms/TicketsForm'
import { ContractName } from 'constants/contract-name'
import { emptyAddress } from 'constants/empty-address'
import { secondsMultiplier, SECONDS_IN_DAY } from 'constants/seconds-in-day'
import { colors } from 'constants/styles/colors'
import { layouts } from 'constants/styles/layouts'
import { UserContext } from 'contexts/userContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useAppSelector,
  useEditingBudgetSelector,
  useUserBudgetSelector,
} from 'hooks/AppSelector'
import useContractReader from 'hooks/ContractReader'
import { BudgetCurrency } from 'models/budget-currency'
import React, { useContext, useEffect, useState } from 'react'
import { editingBudgetActions } from 'redux/slices/editingBudget'
import { editingTicketsActions } from 'redux/slices/editingTickets'
import { addressExists } from 'utils/addressExists'
import { fromPerMille, fromWad } from 'utils/formatCurrency'

import AddLink, { AddLinkFormFields } from './AddLink'
import AdvancedSettings, {
  AdvancedSettingsFormFields,
} from './AdvancedSettings'
import ConfirmCreateProject from './ConfirmCreateProject'
import ConfirmIssueTickets from './ConfirmIssueTickets'
import EditTickets from './EditTickets'
import ProjectInfo, { ProjectInfoFormFields } from './ProjectInfo'

export default function PlayCreate() {
  const {
    transactor,
    contracts,
    onNeedProvider,
    userAddress,
    network,
  } = useContext(UserContext)
  const [step, setStep] = useState<number>(0)
  const [loadingIssueTickets, setLoadingIssueTickets] = useState<boolean>()
  const [projectInfoModalVisible, setProjectInfoModalVisible] = useState<
    boolean
  >(false)
  const [addLinkModalVisible, setAddLinkModalVisible] = useState<boolean>(false)
  const [advancedModalVisible, setAdvancedModalVisible] = useState<boolean>(
    false,
  )
  const [editTicketsModalVisible, setEditTicketsModalVisible] = useState<
    boolean
  >(false)
  const [issueTicketsModalVisible, setIssueTicketsModalVisible] = useState<
    boolean
  >(false)
  const [createProjectModalVisible, setCreateProjectModalVisible] = useState<
    boolean
  >(false)
  const [projectInfoForm] = useForm<ProjectInfoFormFields>()
  const [addLinkForm] = useForm<AddLinkFormFields>()
  const [ticketsForm] = useForm<TicketsFormFields>()
  const [advancedSettingsForm] = useForm<AdvancedSettingsFormFields>()
  const editingBudget = useEditingBudgetSelector()
  const editingTickets = useAppSelector(state => state.editingTickets)
  const creatingBudget = useAppSelector(state => state.editingBudget.loading)
  const userTickets = useAppSelector(state => state.userTickets.value)
  const userBudget = useUserBudgetSelector()
  const dispatch = useAppDispatch()

  // Navigate to project if exists
  useEffect(() => {
    if (userBudget) window.location.hash = userBudget.project
  }, [userBudget, userAddress])

  useEffect(() => {
    if (
      editingBudget?.name &&
      editingBudget?.duration &&
      editingBudget?.target
    ) {
      setStep(1)
    }
  }, [])

  const incrementStep = (num: number) => (num > step ? setStep(num) : null)

  const resetBudgetForm = () =>
    projectInfoForm.setFieldsValue({
      name: editingBudget?.name ?? '',
      target: fromWad(editingBudget?.target) ?? '0',
      duration:
        editingBudget?.duration.div(secondsMultiplier).toString() ?? '0',
      currency: (editingBudget?.currency.toString() ?? '0') as BudgetCurrency,
    })

  const resetAddLinkForm = () =>
    addLinkForm.setFieldsValue({ link: editingBudget?.link ?? '' })

  const resetAdvancedSettingsForm = () =>
    advancedSettingsForm.setFieldsValue({
      discountRate: fromPerMille(editingBudget?.discountRate),
      donationRecipient: addressExists(editingBudget?.donationRecipient)
        ? editingBudget?.donationRecipient
        : '',
      donationAmount: fromPerMille(editingBudget?.donationAmount),
      reserved: fromWad(editingBudget?.reserved),
    })

  const resetTicketsForm = () => ticketsForm.setFieldsValue(editingTickets)

  const onProjectInfoFormSaved = () => {
    const fields = projectInfoForm.getFieldsValue(true)
    dispatch(editingBudgetActions.setName(fields.name))
    dispatch(editingBudgetActions.setTarget(fields.target))
    dispatch(
      editingBudgetActions.setDuration(
        (parseInt(fields.duration) * secondsMultiplier).toString(),
      ),
    )
    dispatch(editingBudgetActions.setCurrency(fields.currency))
  }

  const onAddLinkFormSaved = () =>
    dispatch(editingBudgetActions.setLink(addLinkForm.getFieldValue('link')))

  const onAdvancedFormSaved = () => {
    const fields = advancedSettingsForm.getFieldsValue(true)
    dispatch(editingBudgetActions.setDiscountRate(fields.discountRate))
    dispatch(
      editingBudgetActions.setDonationRecipient(fields.donationRecipient),
    )
    dispatch(editingBudgetActions.setDonationAmount(fields.donationAmount))
    dispatch(editingBudgetActions.setReserved(fields.reserved))
  }

  const onTicketsFormSaved = () => {
    const fields = ticketsForm.getFieldsValue(true)
    dispatch(editingTicketsActions.set(fields))
  }

  useEffect(() => {
    resetBudgetForm()
    resetAddLinkForm()
    resetTicketsForm()
    resetAdvancedSettingsForm()
  }, [])

  const issueTickets = async () => {
    if (!transactor || !contracts) return onNeedProvider()

    if (!editingTickets.name || !editingTickets.symbol) return

    setLoadingIssueTickets(true)

    transactor(
      contracts.TicketStore,
      'issue',
      [editingTickets.name, editingTickets.symbol],
      {
        onDone: () => {
          setLoadingIssueTickets(false)
          setIssueTicketsModalVisible(false)
        },
      },
    )
  }

  const adminFeePercent = useContractReader<number>({
    contract: ContractName.BudgetStore,
    functionName: 'fee',
    formatter: (val: BigNumber) => val?.toNumber(),
  })

  function createProject() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!adminFeePercent || !editingBudget) return

    dispatch(editingBudgetActions.setLoading(true))

    const targetWithFee = editingBudget.target
      ?.add(editingBudget.target.mul(adminFeePercent).div(100))
      .toHexString()

    // TODO
    const bondingCurveRate = BigNumber.from(382).toHexString()

    transactor(
      contracts.BudgetStore,
      'configure',
      [
        targetWithFee,
        editingBudget.currency.toHexString(),
        editingBudget.duration.toHexString(),
        editingBudget.name,
        editingBudget.link || '',
        editingBudget.discountRate.toHexString(),
        bondingCurveRate,
        editingBudget.reserved.toHexString(),
        editingBudget.donationRecipient || emptyAddress,
        editingBudget.donationAmount.toHexString(),
      ],
      {
        onDone: () => {
          setCreateProjectModalVisible(false)
          dispatch(editingBudgetActions.setLoading(false))
        },
      },
    )
  }

  const stepButton = (
    text: string,
    onClick: VoidFunction,
    type: ButtonProps['type'] = 'default',
  ) => (
    <Button type={type} onClick={onClick}>
      {text}
    </Button>
  )

  return (
    <div>
      <div style={{ ...layouts.maxWidth, paddingBottom: 180 }}>
        <Project
          ticketSymbol={userTickets?.symbol ?? editingTickets.symbol}
          ticketAddress={undefined}
          budget={editingBudget}
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
        }}
      >
        <h1>Launch on Juice 🚀</h1>

        <Steps progressDot responsive current={step}>
          <Steps.Step
            title={stepButton('Set the basics', () => null)}
            onClick={() => {
              setProjectInfoModalVisible(true)
            }}
          />
          <Steps.Step
            title={stepButton('Add a link', () => null)}
            onClick={() => {
              incrementStep(1)
              setAddLinkModalVisible(true)
            }}
          />
          <Steps.Step
            title={stepButton('Tune the details', () => null)}
            onClick={() => {
              incrementStep(2)
              setAdvancedModalVisible(true)
            }}
          />
          <Steps.Step
            title={stepButton('Issue tickets', () => null)}
            onClick={() => {
              incrementStep(3)
              setEditTicketsModalVisible(true)
            }}
          />
          <Steps.Step
            title={stepButton('Deploy project', () => null, 'primary')}
            onClick={() => {
              incrementStep(4)
              setCreateProjectModalVisible(true)
            }}
          />
        </Steps>
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
        visible={addLinkModalVisible}
        placement="right"
        width={640}
        onClose={() => {
          resetAddLinkForm()
          setAddLinkModalVisible(false)
        }}
      >
        <AddLink
          form={addLinkForm}
          onSave={() => {
            onAddLinkFormSaved()
            setAddLinkModalVisible(false)
          }}
          onSkip={() => {
            resetAddLinkForm()
            setAddLinkModalVisible(false)
          }}
        />
      </Drawer>

      <Drawer
        visible={advancedModalVisible}
        placement="right"
        width={640}
        onClose={() => {
          resetAdvancedSettingsForm()
          setAdvancedModalVisible(false)
        }}
      >
        <AdvancedSettings
          form={advancedSettingsForm}
          onSave={() => {
            onAdvancedFormSaved()
            setAdvancedModalVisible(false)
          }}
          onSkip={() => {
            resetAdvancedSettingsForm()
            setAdvancedModalVisible(false)
          }}
        />
      </Drawer>

      <Drawer
        visible={editTicketsModalVisible}
        placement="right"
        width={640}
        onClose={() => {
          resetTicketsForm()
          setEditTicketsModalVisible(false)
        }}
      >
        <EditTickets
          form={ticketsForm}
          onSave={() => {
            onTicketsFormSaved()
            setEditTicketsModalVisible(false)
          }}
          onIssue={() => setIssueTicketsModalVisible(true)}
        />
      </Drawer>

      <Modal
        visible={issueTicketsModalVisible}
        okText="Issue tickets"
        onOk={issueTickets}
        onCancel={() => setIssueTicketsModalVisible(false)}
        confirmLoading={loadingIssueTickets}
      >
        <ConfirmIssueTickets
          name={editingTickets.name}
          symbol={editingTickets.symbol}
        />
      </Modal>

      <Modal
        visible={createProjectModalVisible}
        okText={'Deploy on ' + network}
        onOk={createProject}
        confirmLoading={creatingBudget}
        width={600}
        onCancel={() => setCreateProjectModalVisible(false)}
      >
        <ConfirmCreateProject adminFeePercent={adminFeePercent} />
      </Modal>
    </div>
  )
}
