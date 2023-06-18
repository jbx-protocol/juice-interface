import { Transition } from '@headlessui/react'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useHasTouch } from 'hooks/useHasTouch'
import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { SmallNftSquare } from './SmallNftSquare'

export const HoverPreview: React.FC<PropsWithChildren> = ({ children }) => {
  const hasTouch = useHasTouch()
  const [hovering, setHovering] = useState(false)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const toggleHover = useCallback(() => {
    setHovering(hovering => !hovering)
  }, [])

  const handleToggle = hasTouch
    ? { onTouchStart: toggleHover }
    : { onClick: toggleHover }

  const {
    nftRewards: { rewardTiers },
    loading: nftsLoading,
  } = useContext(NftRewardsContext)

  const checkBoundaries = useCallback(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect()
      const overflowsRight = rect.right > window.innerWidth
      const overflowsLeft = rect.left < 0

      if (overflowsRight) {
        tooltipRef.current.style.right = '-100%'
        tooltipRef.current.style.setProperty('left', 'auto', 'important')
      } else if (overflowsLeft) {
        tooltipRef.current.style.setProperty('left', '100%', 'important')
        tooltipRef.current.style.right = 'auto'
      } else {
        tooltipRef.current.style.left = ''
        tooltipRef.current.style.right = ''
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', checkBoundaries)
    return () => window.removeEventListener('resize', checkBoundaries)
  }, [checkBoundaries])

  useEffect(() => {
    if (hovering) {
      requestAnimationFrame(checkBoundaries)
    }
  }, [checkBoundaries, hovering, tooltipRef])

  useEffect(() => {
    if (hasTouch && hovering) {
      const handleBodyTouchStart = (e: TouchEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          toggleHover()
        }
      }

      document.body.addEventListener('touchstart', handleBodyTouchStart)

      return () => {
        document.body.removeEventListener('touchstart', handleBodyTouchStart)
      }
    }
  }, [hasTouch, hovering, toggleHover])

  const NftComponents = useMemo(() => {
    if (!rewardTiers?.length) return []
    if (rewardTiers.length === 1) {
      return [
        <SmallNftSquare
          key={rewardTiers[0].id}
          nftReward={rewardTiers[0]}
          loading={nftsLoading}
          className="col-span-2 h-70 w-70 rounded-none"
        />,
      ]
    }
    return rewardTiers
      .slice(0, 4)
      .map(nft => (
        <SmallNftSquare
          key={nft.id}
          nftReward={nft}
          loading={nftsLoading}
          className="h-32 w-32 rounded-none"
        />
      ))
  }, [nftsLoading, rewardTiers])

  if (!NftComponents.length) return <>{children}</>

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <div
        onMouseEnter={() => !hasTouch && setHovering(true)}
        onMouseLeave={() => !hasTouch && setHovering(false)}
        {...handleToggle}
      >
        {children}
      </div>
      <Transition
        as={Fragment}
        show={hovering}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="absolute top-full left-1/2 z-20 -translate-x-1/2 transform"
          ref={tooltipRef}
        >
          <div className="z-10 mx-auto h-0 w-0 border-l-[20px] border-b-[24px] border-r-[20px] border-white border-l-transparent border-r-transparent dark:border-slate-950 dark:border-l-transparent dark:border-r-transparent" />
          <div className="grid min-w-max grid-cols-2 gap-4 rounded-lg bg-white p-5 shadow-lg dark:bg-slate-950">
            {NftComponents}
          </div>
        </div>
      </Transition>
    </div>
  )
}
