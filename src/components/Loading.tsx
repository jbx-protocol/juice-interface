import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { SpinSize } from 'antd/lib/spin'
import { twMerge } from 'tailwind-merge'

export default function Loading({
  className,
  size,
}: {
  className?: string
  size?: SpinSize
}) {
  return (
    <div
      className={twMerge('flex h-full items-center justify-center', className)}
    >
      <Spin size={size ?? 'large'} indicator={<LoadingOutlined />}></Spin>
    </div>
  )
}
