import { Card } from 'antd'
import { NFTDelegate } from 'models/v2/nftDelegate'

type DelegatePickerModalCardProps = {
  delegate: NFTDelegate
  onClick: VoidFunction
}

export default function DelegatePickerModalCard({
  delegate,
  onClick,
}: DelegatePickerModalCardProps) {
  return (
    <div onClick={onClick}>
      <Card>
        <p>{delegate.address}</p>
        <p>{delegate.totalDelegated}</p>
      </Card>
    </div>
  )
}
