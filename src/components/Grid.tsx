import { Col, ColProps, Row } from 'antd'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import { isReactNodeArray } from 'utils/isReactNodeArray'

const DEFAULT_GUTTER = 20

export default function Grid({
  className,
  children,
  list,
}: PropsWithChildren<{
  className?: string
  list?: boolean
}>) {
  const _gutter = DEFAULT_GUTTER
  const colProps: ColProps = {
    xs: 24,
    md: 12,
    style: { marginBottom: DEFAULT_GUTTER },
  }

  if (!children) return <></>
  if (!isReactNodeArray(children)) return <>{children}</>

  return list ? (
    <div className={twMerge('flex w-full flex-col', className)}>{children}</div>
  ) : (
    <div className={className}>
      {children.map(
        (child, i) =>
          i % 2 === 0 && (
            <Row gutter={_gutter} key={i}>
              <Col {...colProps}>{child}</Col>
              {i + 1 < children.length && (
                <Col {...colProps}>{children[i + 1]}</Col>
              )}
            </Row>
          ),
      )}
    </div>
  )
}
