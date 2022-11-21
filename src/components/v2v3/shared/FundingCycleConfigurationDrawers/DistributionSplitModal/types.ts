import * as Moment from 'moment'

export type SplitType = 'project' | 'address'

export type AddOrEditSplitFormFields = {
  projectId: string
  beneficiary: string
  percent: number
  amount: string | undefined
  lockedUntil: Moment.Moment | undefined | null
}
