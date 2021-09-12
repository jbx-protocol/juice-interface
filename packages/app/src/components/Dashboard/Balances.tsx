import { Space } from 'antd'
import TokenBalance from 'components/shared/TokenBalance'
import { ProjectContext } from 'contexts/projectContext'
import { TokenRef } from 'models/token-ref'
import { useContext } from 'react'
import SectionHeader from './SectionHeader'

export default function Balances() {
  const { owner } = useContext(ProjectContext)

  const tokens: TokenRef[] = [
    {
      symbol: 'JBX',
      address: '0x88d8c9E98E6EdE75252c2473abc9724965fe7474',
    },
  ]

  return (
    <div>
      <SectionHeader
        text="Token balances"
        tip="Other tokens in this project's owner's wallet."
      />
      <Space direction="vertical" style={{ width: '100%', marginTop: 10 }}>
        {tokens.map(t => (
          <TokenBalance key={t.address} wallet={owner} token={t} />
        ))}
      </Space>
    </div>
  )
}
