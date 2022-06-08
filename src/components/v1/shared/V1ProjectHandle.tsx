import { BigNumberish } from '@ethersproject/bignumber'
import useHandleForProjectId from 'hooks/v1/contractReader/HandleForProjectId'
import { CSSProperties } from 'react'
import Link from 'next/link'

export default function V1ProjectHandle({
  projectId,
  style,
}: {
  projectId: BigNumberish
  style?: CSSProperties
}) {
  const handle = useHandleForProjectId(projectId)

  return (
    <Link
      href={`/p/${handle}`}
      style={{ fontWeight: 500, ...style }}
      className="text-primary hover-text-action-primary hover-text-decoration-underline"
    >
      @{handle}
    </Link>
  )
}
