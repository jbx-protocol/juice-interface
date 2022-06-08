import { Card, Image } from 'antd'

type StakingTokenRangeProps = {
  image: string
  tokenMin: number
  tokenMax: number
}

export default function StakingTokenRange({
  image,
  tokenMin,
  tokenMax,
}: StakingTokenRangeProps) {
  return (
    <Card>
      <Image src={image} alt="token" />
      <p>
        {tokenMin} - {tokenMax}
      </p>
    </Card>
  )
}
