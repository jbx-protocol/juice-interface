import { Button, Divider, FormInstance, Space, Statistic } from 'antd'
import { Link } from 'react-router-dom'

import { Budget } from '../../models/budget'
import { AdvancedBudgetFormFields } from '../../models/forms-fields/advanced-budget-form'
import { BudgetFormFields } from '../../models/forms-fields/budget-form'
import { TicketsFormFields } from '../../models/forms-fields/tickets-form'
import { Step } from '../../models/step'
import { addressExists } from '../../utils/addressExists'
import { orEmpty } from '../../utils/orEmpty'

export function reviewStep({
  ticketsForm,
  budgetForm,
  budgetAdvancedForm,
  ticketsInitialized,
  activeBudget,
  ticketsName,
  ticketsSymbol,
  initTickets,
  activateContract,
  loadingInitTickets,
  loadingCreateBudget,
  userAddress,
}: {
  ticketsForm: FormInstance<TicketsFormFields>
  budgetForm: FormInstance<BudgetFormFields>
  budgetAdvancedForm: FormInstance<AdvancedBudgetFormFields>
  ticketsInitialized?: boolean
  activeBudget?: Budget
  ticketsName?: string
  ticketsSymbol?: string
  initTickets: VoidFunction
  activateContract: VoidFunction
  loadingInitTickets?: boolean
  loadingCreateBudget?: boolean
  userAddress?: string
}): Step {
  return {
    title: 'Review',
    content: (
      <div>
        <Space size="large" direction="vertical">
          <h1 style={{ fontSize: '2rem' }}>Budget</h1>
          <div>
            <Space size="large">
              <Statistic
                title="Duration"
                value={budgetForm.getFieldValue('duration')}
                suffix="days"
              />
              <Statistic
                title="Amount"
                value={budgetForm.getFieldValue('target')}
                suffix="DAI"
              />
              <Statistic
                title="Link"
                value={budgetForm.getFieldValue('link')}
              />
            </Space>
          </div>
          <Space size="large" align="end">
            <Statistic
              style={{
                minWidth: 100,
              }}
              title="Discount rate"
              value={
                activeBudget
                  ? activeBudget.discountRate.toString()
                  : budgetAdvancedForm.getFieldValue('discountRate')
              }
              suffix="%"
            />
            <Statistic
              title="Owner surplus"
              value={
                activeBudget
                  ? activeBudget.o.toString()
                  : budgetAdvancedForm.getFieldValue('ownerAllocation') ?? 0
              }
              suffix="%"
            />
            <Statistic
              title="Beneficiary surplus"
              value={
                activeBudget
                  ? activeBudget.b
                  : budgetAdvancedForm.getFieldValue('beneficiaryAllocation') ??
                    0
              }
              suffix="%"
            />
          </Space>
          <Space size="large" align="end">
            <Statistic
              title="Beneficiary address"
              valueStyle={{
                fontSize: '1rem',
                lineBreak: 'anywhere',
              }}
              value={orEmpty(
                activeBudget
                  ? addressExists(activeBudget.bAddress)
                    ? activeBudget.bAddress
                    : '--'
                  : budgetAdvancedForm.getFieldValue('beneficiaryAddress'),
              )}
            />
          </Space>
          {activeBudget ? (
            <Link to={{ hash: userAddress }}>
              <Button type="primary">Go to your budget</Button>
            </Link>
          ) : (
            <Button
              htmlType="submit"
              type="primary"
              onClick={activateContract}
              loading={loadingCreateBudget}
            >
              Activate contract
            </Button>
          )}
        </Space>

        <Divider orientation="center" />

        <div>
          <h1 style={{ fontSize: '2rem' }}>Tickets</h1>
          <div
            style={{
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <Space size="large">
              <Statistic
                title="Name"
                value={
                  ticketsInitialized
                    ? ticketsName
                    : ticketsForm.getFieldValue('name')
                    ? ticketsForm.getFieldValue('name') + 'Juice ticket'
                    : '--'
                }
              />
              <Statistic
                title="Symbol"
                value={
                  ticketsInitialized
                    ? ticketsSymbol
                    : ticketsForm.getFieldValue('symbol')
                    ? 't' + ticketsForm.getFieldValue('symbol')
                    : '--'
                }
              />
            </Space>
          </div>
          <Button
            disabled={ticketsInitialized}
            htmlType="submit"
            type="primary"
            onClick={initTickets}
            loading={loadingInitTickets}
          >
            Issue tickets
          </Button>
        </div>
      </div>
    ),
    info: [
      'Kick off your project by submitting a transaction to the blockchain that activates your contract.',
      '---',
      'By default, Juice will internally keep track of who has sent you payments so that they can claim your overflow.',
      "If you instead want Juice to track payments by distributing ERC-20 tickets of yours instead, you'll first have to submit a transaction issuing your tickets.",
      "This isn't required, and can be done later. The advantage of using ERC-20 tickets is so people can trade and stake their right to claim your overflow outside of the Juice ecosystem.",
    ],
  }
}
