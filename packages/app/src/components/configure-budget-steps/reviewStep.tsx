import { Button, Divider, FormInstance, Space, Statistic } from 'antd'
import { Link } from 'react-router-dom'

import { Budget } from '../../models/budget'
import { AdvancedBudgetFormFields } from '../../models/forms-fields/advanced-budget-form'
import { BudgetFormFields } from '../../models/forms-fields/budget-form'
import { TicketsFormFields } from '../../models/forms-fields/tickets-form'
import { Step } from '../../models/step'
import { orEmpty } from '../../utils/orEmpty'

export function reviewStep({
  ticketsForm,
  budgetForm,
  budgetAdvancedForm,
  initializedTickets,
  initializedBudget,
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
  initializedTickets?: boolean
  initializedBudget?: Budget
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
                  initializedTickets
                    ? ticketsName
                    : ticketsForm.getFieldValue('name')
                    ? ticketsForm.getFieldValue('name') + 'Juice ticket'
                    : '--'
                }
              />
              <Statistic
                title="Symbol"
                value={
                  initializedTickets
                    ? ticketsSymbol
                    : ticketsForm.getFieldValue('symbol')
                    ? 't' + ticketsForm.getFieldValue('symbol')
                    : '--'
                }
              />
            </Space>
          </div>
          <Button
            disabled={initializedTickets}
            htmlType="submit"
            type="primary"
            onClick={initTickets}
            loading={loadingInitTickets}
          >
            Issue tickets
          </Button>
        </div>

        <Divider orientation="center" />

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
                initializedBudget
                  ? initializedBudget.discountRate.toString()
                  : budgetAdvancedForm.getFieldValue('discountRate')
              }
              suffix="%"
            />
            <Statistic
              title="Owner surplus"
              value={
                initializedBudget
                  ? initializedBudget.o.toString()
                  : budgetAdvancedForm.getFieldValue('ownerAllocation') ?? 0
              }
              suffix="%"
            />
            <Statistic
              title="Beneficiary surplus"
              value={
                initializedBudget
                  ? initializedBudget.b
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
                initializedBudget
                  ? initializedBudget.bAddress
                  : budgetAdvancedForm.getFieldValue('beneficiaryAddress'),
              )}
            />
          </Space>
          {initializedBudget ? (
            <Link to={{ hash: userAddress }}>
              <Button type="primary">Go to contract</Button>
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
      </div>
    ),
    info: [
      'Kick off your project by submitting a transaction to the blockchain that activates your contract.',
      "---",
      'By default, Juice will internally keep track of who has sent you payments so that they can claim your overflow.',
      "If you instead want Juice to track payments by distributing ERC-20 tickets of yours instead, you'll first have to submit a transaction issuing your tickets.",
      "This isn't required, and can be done later. The advantage of using ERC-20 tickets is so people can trade and stake their right to claim your overflow outside of the Juice ecosystem."
    ],
  }
}

function Content() {}
