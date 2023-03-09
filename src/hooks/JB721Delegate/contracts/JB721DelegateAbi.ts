import { ContractInterface } from '@ethersproject/contracts'
import {
  JB721_DELEGATE_V1,
  JB721_DELEGATE_V1_1,
} from 'constants/delegateVersions'
import { ContractJson } from 'models/contracts'
import { JB721DelegateVersion } from 'models/nftRewards'
import { useEffect, useState } from 'react'

export async function loadJB721DelegateJson<T>(
  path: string,
  version: JB721DelegateVersion,
): Promise<T | undefined> {
  const versionString =
    version === JB721_DELEGATE_V1
      ? 'v1'
      : version === JB721_DELEGATE_V1_1
      ? 'v1-1'
      : undefined
  if (!versionString) return

  return await import(
    `@jbx-protocol/juice-721-delegate-v${versionString}/${path}`
  )
}

export function useJB721DelegateAbi({
  version,
  path,
}: {
  version: JB721DelegateVersion
  path: string
}) {
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined)

  useEffect(() => {
    loadJB721DelegateJson<ContractJson>(path, version).then(json =>
      setAbi(json?.abi),
    )
  }, [version, path])

  return abi
}
