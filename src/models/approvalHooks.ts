export enum V4ApprovalStatus {
  'Empty' = 0,
  'Upcoming' = 1,
  'Active' = 2,
  'ApprovalExpected' = 3,
  'Approved' = 4,
  'Failed' = 5,
}

export type ApprovalHook = {
  address: string
  name: string
  description?: string
  unknown?: boolean
  durationSeconds?: number // Length in seconds (only applies to non-custom approval hooks)
}
