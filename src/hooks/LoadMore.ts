import { RefObject, useEffect, useState } from 'react'

export const useLoadMoreContent = ({
  loadMoreContainerRef,
  hasNextPage,
}: {
  loadMoreContainerRef: RefObject<HTMLDivElement>
  hasNextPage: boolean | undefined
}) => {
  const [visible, setIsVisible] = useState<boolean>(false)

  // When we scroll within 200px of our loadMoreContainerRef, fetch the next page.
  useEffect(() => {
    if (loadMoreContainerRef.current) {
      const observer = new IntersectionObserver(
        entries => {
          setIsVisible(false)
          if (entries.find(e => e.isIntersecting) && hasNextPage) {
            setIsVisible(true)
          }
        },
        {
          rootMargin: '200px',
        },
      )
      observer.observe(loadMoreContainerRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [hasNextPage, loadMoreContainerRef])

  return [visible]
}
