import { ImageProps } from 'next/image'
import { stopPropagation } from 'react-stop-propagation'
import { classNames } from 'utils/classNames'

export const RewardImage = ({
  src,
  ...props
}: ImageProps & { src: string }) => {
  return (
    <img
      {...props}
      src={src}
      className={classNames('object-cover object-center', props.className)}
      onClick={stopPropagation(props.onClick)}
    />
  )
}
