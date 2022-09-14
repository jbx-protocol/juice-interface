import { BigNumberish } from '@ethersproject/bignumber'
import useHandleForProjectId from 'hooks/v1/contractReader/HandleForProjectId'
import Link from 'next/link'
import { CSSProperties } from 'react'

export default function V1ProjectHandle({
  projectId,
  handle,
  style,
}: {
  projectId: BigNumberish
  handle?: string | null
  style?: CSSProperties
}) {
  const _handle = useHandleForProjectId(!handle ? projectId : undefined)
  const handleToRender = handle ?? _handle

  return (
    <Link href={`/p/${handleToRender}`}>
      <a
        className="text-primary hover-text-action-primary hover-text-decoration-underline"
        style={{ fontWeight: 500, ...style }}
      >
        @{handleToRender}
      </a>
    </Link>
  )
}
