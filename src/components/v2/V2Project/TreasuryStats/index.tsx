import ProjectBalance from './ProjectBalance'
import DistributedRatio from './DistributedRatio'

export default function TreasuryStats() {
  const spacing = 10

  return (
    <>
      <ProjectBalance style={{ marginBottom: spacing }} />
      <DistributedRatio style={{ marginBottom: spacing }} />
    </>
  )
}
