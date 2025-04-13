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
  durationSeconds?: number // Length in seconds (only applies to 0, 1, 3 and 7 day ballots)
}
