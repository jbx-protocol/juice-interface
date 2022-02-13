/* eslint-disable */
import { Trans } from '@lingui/macro'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import useV2ProjectMetadata from 'hooks/v2/ProjectMetadata'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Loading from 'components/shared/Loading'

import { BigNumber } from '@ethersproject/bignumber'

import { layouts } from 'constants/styles/layouts'

import V2Project from '../V2Project'
import Dashboard404 from './Dashboard404'
import useV2ContractReader from 'hooks/v2/contractReader/V2ContractReader'
import { PEEL_METADATA_DOMAIN } from 'constants/v2/metadataDomain'
import { V2ContractName } from 'models/v2/contracts'

export default function V2Dashboard() {
  const { projectId: projectIdParameter }: { projectId?: string } = useParams()
  const projectId = BigNumber.from(projectIdParameter)

  const { data: metadataURI, loading: metadataURILoading } =
    useV2ContractReader<string>({
      contract: V2ContractName.JBProjects,
      functionName: 'metadataContentOf',
      args: projectId ? [projectId.toHexString(), PEEL_METADATA_DOMAIN] : null,
    })

  const {
    data: metadata,
    error: metadataError,
    isLoading: metadataLoading,
  } = useV2ProjectMetadata(metadataURI)

  if (metadataLoading || metadataURILoading) return <Loading />

  if (projectId?.eq(0) || metadataError) {
    return <Dashboard404 projectId={projectId} />
  }

  const project = {
    projectId,
    metadata,
  }

  return (
    <V2ProjectContext.Provider value={project}>
      <div style={layouts.maxWidth}>
        <V2Project />
        <div
          style={{ textAlign: 'center', cursor: 'pointer', padding: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Trans>Back to top</Trans>
        </div>
      </div>
    </V2ProjectContext.Provider>
  )
}
