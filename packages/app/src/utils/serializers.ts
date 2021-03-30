import { BigNumber } from '@ethersproject/bignumber'
import { fromWad, parsePerMille, parseWad } from 'utils/formatCurrency'

import { Budget } from '../models/budget'
import { fromPerMille } from './formatCurrency'

export type SerializedBudget = Record<keyof Budget, string>

export const serializeBudget = (budget: Budget): SerializedBudget => ({
  projectId: budget.projectId.toString(),
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
  weight: fromWad(budget.weight),
  fee: fromPerMille(budget.fee),
  bondingCurveRate: budget.bondingCurveRate.toString(),
  discountRate: fromPerMille(budget.discountRate),
  configured: budget.configured.toString(),
  ballot: budget.ballot,
})

export const deserializeBudget = (
  budget: SerializedBudget | null | undefined,
): Budget | null | undefined =>
  budget
    ? {
        ...budget,
        projectId: BigNumber.from(budget.projectId),
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
        weight: parseWad(budget.weight),
        fee: parsePerMille(budget.fee),
        bondingCurveRate: BigNumber.from(budget.bondingCurveRate),
        discountRate: parsePerMille(budget.discountRate),
        configured: BigNumber.from(budget.configured),
      }
    : budget
