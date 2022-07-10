import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { CSSProperties } from 'react'

export default function Loading({
  size,
  style,
}: {
  size?: number
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        ...style,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Spin
        size="large"
        indicator={<LoadingOutlined style={size ? { fontSize: size } : {}} />}
      ></Spin>
    </div>
  )
}
