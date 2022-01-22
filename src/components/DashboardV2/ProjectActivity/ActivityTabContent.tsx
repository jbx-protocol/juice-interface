import { Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import React, { useContext } from 'react'

import Loading from '../../shared/Loading'

interface Props {
  count: number
  isLoading: boolean
  isLoadingNextPage: boolean
  hasNextPage?: boolean
  onLoadMore: () => void
}

const ActivityTabContent: React.FC<Props> = ({
  children,
  count,
  hasNextPage,
  isLoading,
  isLoadingNextPage,
  onLoadMore,
}) => {
  const { colors } = useContext(ThemeContext).theme

  let postContent: React.ReactNode

  if (isLoading || isLoadingNextPage) {
    postContent = (
      <div>
        <Loading />
      </div>
    )
  } else if (count === 0 && !isLoading) {
    postContent = (
      <div
        style={{
          color: colors.text.secondary,
          paddingTop: 20,
          borderTop: '1px solid ' + colors.stroke.tertiary,
        }}
      >
        <Trans>No activity yet</Trans>
      </div>
    )
  } else if (hasNextPage) {
    postContent = (
      <div
        style={{
          textAlign: 'center',
          color: colors.text.secondary,
          cursor: 'pointer',
        }}
        onClick={() => onLoadMore()}
      >
        <Trans>Load more</Trans>
      </div>
    )
  } else {
    postContent = (
      <div
        style={{
          textAlign: 'center',
          padding: 10,
          color: colors.text.secondary,
        }}
      >
        <Trans>{count} total</Trans>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      {children}
      {postContent}
    </div>
  )
}

export default ActivityTabContent
