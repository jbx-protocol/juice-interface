import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { classNames } from 'utils/classNames'

type ArrowDirection = 'left' | 'right'

export function ArrowIcon({
  direction,
  onClick,
}: {
  direction: ArrowDirection
  onClick: VoidFunction
}) {
  return (
    <div
      className={classNames(
        'hidden rounded-full md:absolute',
        direction === 'left' ? 'left-10' : 'right-10',
      )}
      onClick={onClick}
    >
      {direction === 'left' ? <LeftOutlined /> : <RightOutlined />}
    </div>
  )
}
