import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { useContext } from 'react'

const TooltipDescription = () => {
  return (
    <Trans>
      This Juicebox V2 project also has a project on Juicebox V1. The project
      owner is allowing you to swap your V1 tokens for V2 tokens.
    </Trans>
  )
}

export function TokenSwapDescription({
  v1ProjectHandle,
}: {
  v1ProjectHandle: string
}) {
  const { projectMetadata } = useContext(V3ProjectContext)

  return (
    <div>
      <p style={{ marginBottom: '0.5rem' }}>
        <Trans>
          You have{' '}
          <span style={{ fontWeight: 600 }}>{projectMetadata?.name}</span>{' '}
          tokens on <a href={`/p/${v1ProjectHandle}`}>Juicebox V1</a>. You can
          swap your{' '}
          <span style={{ fontWeight: 600 }}>{projectMetadata?.name}</span> V1
          tokens for V2 tokens
        </Trans>{' '}
        <TooltipIcon tip={<TooltipDescription />} />
      </p>
    </div>
  )
}
