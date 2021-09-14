import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import ERC20TokenBalance from 'components/shared/ERC20TokenBalance'
import ProjectTokenBalance from 'components/shared/ProjectTokenBalance'
import { ProjectContext } from 'contexts/projectContext'
import { TokenRef } from 'models/token-ref'
import { useContext } from 'react'

import SectionHeader from './SectionHeader'

export default function Balances() {
  const { owner } = useContext(ProjectContext)

  const tokens: TokenRef[] = [
    {
      type: 'project',
      value: '0x01',
    },
    {
      type: 'project',
      value: '0x02',
    },
    {
      type: 'project',
      value: '0x08',
    },
  ]

  return (
    <div>
      <SectionHeader
        text="Token balances"
        tip="Other tokens in this project's owner's wallet."
      />
      <Space direction="vertical" style={{ width: '100%', marginTop: 10 }}>
        {tokens.map(t =>
          t.type === 'erc20' ? (
            <ERC20TokenBalance
              key={t.value}
              wallet={owner}
              tokenAddress={t.value}
            />
          ) : (
            <ProjectTokenBalance
              key={t.value}
              wallet={owner}
              projectId={BigNumber.from(t.value)}
            />
          ),
        )}
      </Space>
    </div>
  )
}
