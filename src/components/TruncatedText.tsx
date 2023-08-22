import { Tooltip } from 'antd'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface TruncatedTextProps {
  text: ReactNode
  className?: string
  placement?:
    | 'top'
    | 'topRight'
    | 'right'
    | 'bottomRight'
    | 'bottom'
    | 'bottomLeft'
    | 'left'
    | 'topLeft'
}

export const TruncatedText: React.FC<
  React.PropsWithChildren<TruncatedTextProps>
> = ({ text, className, placement }) => {
  const [show, setShow] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  const checkTruncated = () => {
    if (!textRef.current) return

    const { scrollWidth, clientWidth } = textRef.current
    setIsTruncated(scrollWidth > clientWidth)
  }

  useEffect(() => {
    checkTruncated()
    window.addEventListener('resize', checkTruncated)

    return () => {
      window.removeEventListener('resize', checkTruncated)
    }
  }, [])

  const open = show && isTruncated

  return (
    <Tooltip open={open} title={text} placement={placement}>
      <div
        ref={textRef}
        className={`truncate ${className}`}
        aria-label={isTruncated && typeof text === 'string' ? text : undefined}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        {text}
      </div>
    </Tooltip>
  )
}
