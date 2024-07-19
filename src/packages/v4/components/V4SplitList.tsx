import { BigNumber } from "@ethersproject/bignumber"
import SplitList, { V2V3SplitListProps } from "packages/v2v3/components/shared/SplitList"
import { V4Split } from "../models/v4Split"
import { v4SplitToV2V3Split } from "../utils/v4Splits"

type V4SplitListProps = Omit<V2V3SplitListProps, 'splits' | 'currency' | 'totalValue'> & {
  splits: V4Split[]
  totalValue: bigint | undefined
  currency?: bigint

}

export default function V4SplitList(props: V4SplitListProps) {
  return (
    <SplitList 
      {...{
        ...props,
        splits: props.splits.map(v4SplitToV2V3Split),
        currency: props.currency ? BigNumber.from(props.currency) : undefined,
        totalValue: props.totalValue ? BigNumber.from(props.totalValue) : undefined,
      }}
    />
  )
}
