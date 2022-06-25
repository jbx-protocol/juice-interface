import { BigNumber } from '@ethersproject/bignumber'
import useProjectENSNameResolver from 'hooks/ProjectENSNameResolver'
import { useParams } from 'react-router-dom'
import Loading from 'components/Loading'

import V2Dashboard from '.'
import Project404 from '../../../components/Project404'

const parseProjectIdParameter = (projectIdParameter?: string) => {
  try {
    return BigNumber.from(projectIdParameter)
  } catch (e) {
    return undefined
  }
}

export default function V2DashboardGateway() {
  const {
    projectId: projectIdParameter,
    ensName,
  }: { projectId?: string; ensName?: string } = useParams()

  const { loading, projectId: projectIdForName } = useProjectENSNameResolver({
    ensName,
  })

  if (loading) return <Loading />

  const projectId =
    projectIdForName ?? parseProjectIdParameter(projectIdParameter)
  if (!projectId) return <Project404 projectId={projectId} ensName={ensName} />

  return <V2Dashboard projectId={projectId.toNumber()} />
}
