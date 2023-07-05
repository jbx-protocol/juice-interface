import React, { FunctionComponent } from 'react'
import { twMerge } from 'tailwind-merge'

export interface StackComponentItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: FunctionComponent<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>
}

interface StackedComponentsProps {
  className?: string
  components: StackComponentItem[]
  size: string
  offset?: string
  onClick?: VoidFunction
}

const StackedComponents: React.FC<StackedComponentsProps> = ({
  className,
  components,
  size,
  offset = '20px',
  onClick,
}) => {
  return (
    <div
      className={twMerge('relative z-0 flex min-w-0 items-center', className)}
      onClick={onClick}
    >
      {components.map((item, index) => (
        <div
          style={{
            width: size,
            height: size,
            zIndex: -index,
            marginLeft: index !== 0 ? `-${offset}` : undefined,
          }}
          className="flex-shrink-0"
          key={index}
        >
          <item.Component {...item.props} />
        </div>
      ))}
    </div>
  )
}

export default StackedComponents
