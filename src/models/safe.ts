export type GnosisSafe = {
  address: string
  nonce: number
  owners: string[]
  threshold: number
}

export type GnosisSignature = {
  owner: string
  submissionDate: string
  transactionHash: string
  signature: string
  signatureType: string
}

export interface SafeTransactionType {
  nonce: number
  origin: string
  data?: string
  dataDecoded?: {
    method: string
    parameters: object[]
  }
  isExecuted: boolean
  safeTxGas: number
  safeTxHash: string
  submissionDate: string
  executionDate: string
  confirmations?: GnosisSignature[]
  threshold?: number
  safe: string
  to: string
}
