import { PropsWithChildren } from 'react'

import { classNames } from 'utils/classNames'

export function CardSection({
  header,
  noShadow,
  children,
}: PropsWithChildren<{
  header?: string
  noShadow?: boolean
}>) {
  return (
    <div className={classNames(noShadow ? 'mb-0 mr-0' : 'mb-[10px] mr-[10px]')}>
      {header && <h2 className="m-0 font-medium">{header}</h2>}
      <div
        // TODO: Consider turning this into a component
        className={classNames(
          'overflow-hidden rounded-sm bg-smoke-75 p-5 dark:bg-slate-400',
          !noShadow
            ? // #E7E3DC is smoke-200
              // 2D293A is slate-600
              'shadow-[10px_10px_0px_0px_#E7E3DC] dark:shadow-[10px_10px_0px_0px_#2D293A]'
            : '',
        )}
      >
        {children}
      </div>
    </div>
  )
}
