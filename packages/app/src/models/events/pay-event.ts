export interface PayEvent {
  id: string
  fundingCycleId: string
  projectId: string
  caller: string
  beneficiary: string
  amount: string
  note: string
  timestamp: string
}
