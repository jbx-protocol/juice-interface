import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { SpinSize } from 'antd/lib/spin'

export default function Loading({ size }: { size?: SpinSize }) {
  return (
    <div className="flex h-full items-center justify-center">
      <Spin size={size ?? 'large'} indicator={<LoadingOutlined />}></Spin>
    </div>
  )
}
