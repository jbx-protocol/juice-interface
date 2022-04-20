export enum V1BallotState {
  'Approved' = 0,
  'Active' = 1,
  'Failed' = 2,
  'Standby' = 3,
}

export enum V2BallotState {
  'Active' = 0,
  'Approved' = 1,
  'Failed' = 2,
}

export type BallotStrategy = {
  address: string
  name: string
  description?: string
  unknown?: boolean
}
