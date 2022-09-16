import { V2ProjectContext } from 'contexts/v2/projectContext'
import NftRewardsProvider from 'providers/NftRewardsProvider'
import { useContext } from 'react'

export const V2NftRewardsProvider: React.FC = ({ children }) => {
  const { fundingCycleMetadata } = useContext(V2ProjectContext)

  return (
    <NftRewardsProvider dataSource={fundingCycleMetadata?.dataSource}>
      {children}
    </NftRewardsProvider>
  )
}
