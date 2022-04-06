import { BigNumberish } from '@ethersproject/bignumber'
import useHandleForProjectId from 'hooks/v1/contractReader/HandleForProjectId'
import { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

export default function V1ProjectHandle({
  projectId,
  style,
  link,
}: {
  projectId: BigNumberish
  style?: CSSProperties
  link?: boolean
}) {
  const handle = useHandleForProjectId(projectId)

  return (
    <Link to={`/p/${handle}`} className="hover-action">
      @{handle}
    </Link>
  )
}
