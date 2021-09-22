import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Spin size="large" indicator={<LoadingOutlined />}></Spin>
    </div>
  )
}
