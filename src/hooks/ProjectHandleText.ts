import { t } from '@lingui/macro'
import useProjectHandle from './v2v3/contractReader/ProjectHandle'

/**
 * Return text to present to the user as the project's 'handle'.
 *
 * If a handle wasn't specified, try loading it using the V2V3 contracts.
 * - Note: V1 projects *always* have handles. This hook assumes that, if no handle arg is given, it's a v2v3 project.
 * - @TODO probably not the safest assumption. We should probably add cv or pv to this hook.
 *
 * If a project doesn't have a handle, return some formatted text that includes the project ID.
 */
export function useProjectHandleText({
  projectId,
  handle,
}: {
  projectId: number | undefined
  handle?: string | null
}) {
  if (!projectId) return {}

  // fetch handle if not provided
  const { data: _handle } = useProjectHandle({
    projectId: !handle ? projectId : undefined,
  })

  const resolvedHandle = handle ?? _handle

  const handleText = resolvedHandle
    ? `@${resolvedHandle}`
    : t`Project #${projectId}`

  return {
    handleText,
    handle: resolvedHandle,
  }
}
