import { BigNumberish } from '@ethersproject/bignumber'
import useHandleForProjectId from 'hooks/v1/contractReader/HandleForProjectId'
import { CSSProperties, useState } from 'react'
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
  const [hover, setHover] = useState(false)
  const handle = useHandleForProjectId(projectId)

  return (
    <Link
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
      style={{ fontWeight: 400, textDecoration: hover ? 'underline' : 'none' }}
      to={`/p/${handle}`}
    >
      @{handle}
    </Link>
  )
}
