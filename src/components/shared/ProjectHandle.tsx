import { LinkOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Tooltip } from 'antd'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { CSSProperties, useCallback } from 'react'

export default function ProjectHandle({
  projectId,
  style,
  link,
}: {
  projectId: BigNumberish
  style?: CSSProperties
  link?: boolean
}) {
  const handle = useContractReader<string>({
    contract: ContractName.Projects,
    functionName: 'handleOf',
    args: projectId ? [BigNumber.from(projectId ?? 0).toHexString()] : null,
    formatter: useCallback(val => utils.parseBytes32String(val), []),
  })

  return link ? (
    <Tooltip
      title={
        <Link
          style={{ fontWeight: 400 }}
          to={`/${handle}`}
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
