import { BigNumber } from 'ethers'

/** 
  @member amount The total amount the fee was taken from, as a fixed point number with the same number of decimals as the terminal in which this struct was created.
  @member fee The percent of the fee, out of MAX_FEE.
  @member feeDiscount The discount of the fee.
  @member beneficiary The address that will receive the tokens that are minted as a result of the fee payment.
*/
export type JBFee = {
  amount: BigNumber
  fee: number
  feeDiscount: number
  beneficiary: string
}
