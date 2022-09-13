import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { SpinSize } from 'antd/lib/spin'

export default function Loading({ size }: { size?: SpinSize }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Spin size={size ?? 'large'} indicator={<LoadingOutlined />}></Spin>
    </div>
  )
}
