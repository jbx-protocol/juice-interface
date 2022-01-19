import { LinkOutlined } from '@ant-design/icons'
import { BigNumberish } from '@ethersproject/bignumber'
import { Tooltip } from 'antd'
import useHandleForProjectId from 'hooks/contractReader/HandleForProjectId'
import { CSSProperties } from 'react'

export default function ProjectHandle({
  projectId,
  style,
  link,
}: {
  projectId: BigNumberish
  style?: CSSProperties
  link?: boolean
}) {
  const handle = useHandleForProjectId(projectId)

  return link ? (
    <Tooltip
      title={
        <a
          style={{ fontWeight: 400 }}
          href={`/#/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{handle} <LinkOutlined />
        </a>
      }
    >
      <span style={{ cursor: 'default', ...style }}>@{handle}</span>
    </Tooltip>
  ) : (
    <span style={style}>{handle}</span>
  )
}
