import { LinkOutlined } from '@ant-design/icons'
import { BigNumberish } from '@ethersproject/bignumber'
import { Tooltip } from 'antd'
import useHandleForProjectId from 'hooks/v1/contractReader/HandleForProjectId'
import { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

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
        <Link
          style={{ fontWeight: 400 }}
          to={`/p/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{handle} <LinkOutlined />
        </Link>
      }
    >
      <span style={{ cursor: 'default', ...style }}>@{handle}</span>
    </Tooltip>
  ) : (
    <span style={style}>{handle}</span>
  )
}
