import { BigNumber } from '@ethersproject/bignumber'
import { Button, Drawer, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import Project from 'components/Owner/Project'
import { ContractName } from 'constants/contract-name'
import { emptyAddress } from 'constants/empty-address'
import { SECONDS_IN_DAY } from 'constants/seconds-in-day'
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
import { addressExists } from 'utils/addressExists'
import { fromPerMille, fromWad } from 'utils/formatCurrency'

import { BudgetAdvancedFormFields } from '../forms/BudgetAdvancedForm'
import { BudgetFormFields } from '../forms/BudgetForm'
import { TicketsFormFields } from '../forms/TicketsForm'
import ConfirmCreateProject from './ConfirmCreateProject'
import ConfirmIssueTickets from './ConfirmIssueTickets'
import EditProject from './EditProject'
import EditTickets from './EditTickets'

export default function PlayCreate() {
  const { transactor, contracts, onNeedProvider, userAddress } = useContext(
    UserContext,
  )
  const [ticketsName, setTicketsName] = useState<string>()
  const [ticketsSymbol, setTicketsSymbol] = useState<string>()
  const [loadingIssueTickets, setLoadingIssueTickets] = useState<boolean>()
  const [editProjectModalVisible, setEditProjectModalVisible] = useState<
    boolean
  >(false)
  const [editTicketsModalVisible, setEditTicketsModalVisible] = useState<
    boolean
  >(false)
  const [issueTicketsModalVisible, setIssueTicketsModalVisible] = useState<
    boolean
  >(false)
  const [createProjectModalVisible, setCreateProjectModalVisible] = useState<
    boolean
  >(false)
  const [budgetForm] = useForm<BudgetFormFields>()
  const [budgetAdvancedForm] = useForm<BudgetAdvancedFormFields>()
  const [ticketsForm] = useForm<TicketsFormFields>()
  const editingBudget = useEditingBudgetSelector()
  const creatingBudget = useAppSelector(state => state.editingBudget.loading)
  const userTickets = useAppSelector(state => state.userTickets.value)
  const userBudget = useUserBudgetSelector()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (userTickets && userBudget && userAddress)
      window.location.hash = userAddress
  }, [userBudget, userAddress, userTickets])

  const adminFeePercent = useContractReader<number>({
    contract: ContractName.BudgetStore,
    functionName: 'fee',
    formatter: (val: BigNumber) => val?.toNumber(),
  })

  const resetBudgetForm = () =>
    budgetForm.setFieldsValue({
      name: editingBudget?.name ?? '',
      target: fromWad(editingBudget?.target) ?? '0',
      duration:
        editingBudget?.duration
          .div(process.env.NODE_ENV === 'production' ? SECONDS_IN_DAY : 1)
          .toString() ?? '0',
      currency: (editingBudget?.currency.toString() ?? '0') as BudgetCurrency,
    })

  const resetBudgetAdvancedForm = () =>
    budgetAdvancedForm.setFieldsValue({
      link: editingBudget?.link ?? '',
      discountRate: fromPerMille(editingBudget?.discountRate),
      donationRecipient: addressExists(editingBudget?.donationRecipient)
        ? editingBudget?.donationRecipient
        : '',
      donationAmount: fromPerMille(editingBudget?.donationAmount),
      reserved: fromWad(editingBudget?.reserved),
    })

  const resetTicketsForm = () =>
    ticketsForm.setFieldsValue({
      name: ticketsName,
      symbol: ticketsSymbol,
    })

  const onBudgetFormSaved = () => {
    const fields = budgetForm.getFieldsValue(true)
    dispatch(editingBudgetActions.setName(fields.name))
    dispatch(editingBudgetActions.setTarget(fields.target))
    dispatch(
      editingBudgetActions.setDuration(
        (
          parseInt(fields.duration) *
          (process.env.NODE_ENV === 'production' ? SECONDS_IN_DAY : 1)
        ).toString(),
      ),
    )
    dispatch(editingBudgetActions.setCurrency(fields.currency))
  }

  const onBudgetAdvancedFormSaved = () => {
    const fields = budgetAdvancedForm.getFieldsValue(true)
    dispatch(editingBudgetActions.setLink(fields.link))
    dispatch(editingBudgetActions.setDiscountRate(fields.discountRate))
    dispatch(editingBudgetActions.setBAddress(fields.donationRecipient))
    dispatch(editingBudgetActions.setB(fields.beneficiary))
    dispatch(editingBudgetActions.setP(fields.reserved))
  }

  const onTicketsFormSaved = () => {
    const fields = ticketsForm.getFieldsValue(true)
    setTicketsName(fields.name)
    setTicketsSymbol(fields.symbol)
  }

  useEffect(() => {
    resetBudgetForm()
    resetBudgetAdvancedForm()
  }, [])

  const issueTickets = async () => {
    if (!transactor || !contracts) return onNeedProvider()

    if (!ticketsName || !ticketsSymbol) return

    setLoadingIssueTickets(true)

    transactor(contracts.TicketStore, 'issue', [ticketsName, ticketsSymbol], {
      onDone: () => {
        setLoadingIssueTickets(false)
        setIssueTicketsModalVisible(false)
      },
    })
  }

  function createProject() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!adminFeePercent || !editingBudget) return

    dispatch(editingBudgetActions.setLoading(true))

    const targetWithFee = editingBudget.target
      ?.add(editingBudget.target.mul(adminFeePercent).div(100))
      .toHexString()

    transactor(
      contracts.BudgetStore,
      'configure',
      [
        targetWithFee,
        editingBudget.currency.toHexString(),
        editingBudget.duration.toHexString(),
        editingBudget.name,
        editingBudget.link ?? '',
        editingBudget.discountRate.toHexString(),
        editingBudget.reserved.toHexString(),
        editingBudget.donationRecipient ?? emptyAddress,
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

  return (
    <div style={{ ...layouts.maxWidth }}>
      <div style={{ marginBottom: 80 }}>
        <Project
          ticketSymbol={userTickets?.symbol ?? ticketsSymbol}
          ticketAddress={undefined}
          budget={editingBudget}
        />
      </div>

      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.background,
          padding: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <h3 style={{ margin: 0, color: 'white' }}>Review your budget</h3>
        <Space direction="horizontal" size="middle">
          {userTickets ? null : (
            <Button
              type="ghost"
              onClick={() => setEditTicketsModalVisible(true)}
            >
              Tickets
            </Button>
          )}
          {userBudget ? null : (
            <Button
              type="ghost"
              onClick={() => setEditProjectModalVisible(true)}
            >
              Edit project
            </Button>
          )}
          {userBudget && userAddress ? (
            <Button
              type="primary"
              onClick={() => (window.location.hash = userAddress)}
            >
              Go to dashboard
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => setCreateProjectModalVisible(true)}
            >
              Create project
            </Button>
          )}
        </Space>
      </div>

      <Drawer
        visible={editProjectModalVisible}
        placement="right"
        width={640}
        onClose={() => {
          resetBudgetForm()
          setEditProjectModalVisible(false)
        }}
      >
        <EditProject
          budgetForm={budgetForm}
          budgetAdvancedForm={budgetAdvancedForm}
          onSave={() => {
            onBudgetFormSaved()
            onBudgetAdvancedFormSaved()
            setEditProjectModalVisible(false)
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
        <ConfirmIssueTickets name={ticketsName} symbol={ticketsSymbol} />
      </Modal>

      <Modal
        visible={createProjectModalVisible}
        okText="Create project"
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
