import { Card, Image } from 'antd'

type StakingTokenRangeProps = {
  tokenSvg: string
  tokenMin: number
  tokenMax: number
}

export default function StakingTokenRange({
  tokenSvg,
  tokenMin,
  tokenMax,
}: StakingTokenRangeProps) {
  return (
    <Card>
      <Image src={tokenSvg} alt="token" />
      <p>
        {tokenMin} - {tokenMax}
      </p>
    </Card>
  )
}
