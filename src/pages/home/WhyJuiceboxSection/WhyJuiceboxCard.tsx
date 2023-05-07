import useMobile from 'hooks/useMobile'
import { useRef } from 'react'
import { twJoin } from 'tailwind-merge'

export function WhyJuiceboxCard({
  className,
  iconWrapperClassName,
  icon,
  heading,
  content,
}: {
  className: string
  iconWrapperClassName: string
  icon: JSX.Element
  heading: string | JSX.Element
  content: string | JSX.Element
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const xAxis = (rect.width / 2 - (e.clientX - rect.left)) / 25
    const yAxis = (rect.height / 2 - (e.clientY - rect.top)) / 25
    cardRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'rotateX(0) rotateY(0)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={!isMobile ? handleMouseMove : undefined}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      className={twJoin(
        'max-w-xs flex-shrink-0 rounded-lg px-5 py-8 text-center shadow-sm',
        className,
      )}
      style={{
        transformStyle: 'preserve-3d',
        transformOrigin: 'center',
      }}
    >
      <div className="flex w-full justify-center">
        <div
          className={twJoin(
            'mb-4 flex h-14 w-14 items-center justify-center rounded-full',
            iconWrapperClassName,
          )}
        >
          {icon}
        </div>
      </div>
      <h3 className="mb-2 text-2xl text-grey-900">{heading}</h3>
      <p className="mb-0 text-sm text-grey-900">{content}</p>
    </div>
  )
}
