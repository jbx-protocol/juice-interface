import { BigNumber } from '@ethersproject/bignumber'
import { fromWad, parsePerMille, parseWad } from 'utils/formatCurrency'

import { Budget } from '../models/budget'
import { fromPerMille } from './formatCurrency'

export type SerializedBudget = Record<keyof Budget, string>

export const serializeBudget = (budget: Budget): SerializedBudget => ({
  project: budget.project,
  name: budget.name,
  link: budget.link,
  donationRecipient: budget.donationRecipient,
  id: budget.id.toString(),
  number: budget.number.toString(),
  previous: budget.previous.toString(),
  target: fromWad(budget.target),
  currency: budget.currency.toString(),
  total: fromWad(budget.total),
  start: budget.start.toString(),
  duration: budget.duration.toString(),
  tappedTarget: fromWad(budget.tappedTarget),
  tappedTotal: fromWad(budget.tappedTotal),
  reserved: fromPerMille(budget.reserved),
  donationAmount: fromPerMille(budget.donationAmount),
  weight: fromWad(budget.weight),
  discountRate: fromPerMille(budget.discountRate),
  configured: budget.configured.toString(),
})

export const deserializeBudget = (
  budget: SerializedBudget | null | undefined,
): Budget | null | undefined =>
  budget
    ? {
        ...budget,
        id: BigNumber.from(budget.id),
        number: BigNumber.from(budget.number),
        previous: BigNumber.from(budget.previous),
        target: parseWad(budget.target),
        currency: BigNumber.from(budget.currency),
        total: parseWad(budget.total),
        start: BigNumber.from(budget.start),
        duration: BigNumber.from(budget.duration),
        tappedTarget: parseWad(budget.tappedTarget),
        tappedTotal: parseWad(budget.tappedTotal),
        reserved: parsePerMille(budget.reserved),
        donationAmount: parsePerMille(budget.donationAmount),
        weight: parseWad(budget.weight),
        discountRate: parsePerMille(budget.discountRate),
        configured: BigNumber.from(budget.configured),
      }
    : budget
