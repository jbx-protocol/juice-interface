import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { readProvider } from 'constants/readProvider'

const JUICEBOX_V2_TXT_RECORD_KEY = 'juicebox'

export const getProjectIdFromENSName = async (ensName: string) => {
  const resolver = await readProvider.getResolver(ensName)

  const projectId = await resolver?.getText(JUICEBOX_V2_TXT_RECORD_KEY)
  if (!projectId) return null

  return projectId
}

export default function useProjectENSNameResolver({
  ensName,
}: {
  ensName?: string
}) {
  const [loading, setLoading] = useState<boolean>(false)
  const [projectId, setProjectId] = useState<BigNumber | null>(null)

  useEffect(() => {
    const resolve = async () => {
      try {
        if (!ensName) throw new Error('No ENS name')

        setLoading(true)
        const newProjectId = await getProjectIdFromENSName(ensName)
        if (!newProjectId)
          throw new Error(`No project ID for ENS name: ${ensName}`)

        setProjectId(BigNumber.from(newProjectId))
      } catch {
        setProjectId(null)
      } finally {
        setLoading(false)
      }
    }

    resolve()
  }, [ensName])

  return { loading, projectId }
}
