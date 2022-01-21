import { LinkOutlined } from '@ant-design/icons'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Tooltip } from 'antd'
import { utils } from 'ethers'
import useContractReaderV1 from 'hooks/v1/ContractReaderV1'
import { JuiceboxV1ContractName } from 'models/contracts/juiceboxV1'
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
  const handle = useContractReaderV1<string>({
    contract: JuiceboxV1ContractName.Projects,
    functionName: 'handleOf',
    args: projectId ? [BigNumber.from(projectId ?? 0).toHexString()] : null,
    formatter: useCallback(val => utils.parseBytes32String(val), []),
  })

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
