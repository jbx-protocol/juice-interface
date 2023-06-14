import React, { FunctionComponent } from 'react'

interface ComponentItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: FunctionComponent<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>
}

interface StackedComponentsProps {
  components: ComponentItem[]
  size: string
  offset?: string
}

const StackedComponents: React.FC<StackedComponentsProps> = ({
  components,
  size,
  offset = '20px',
}) => {
  return (
    <div className="relative z-0 flex">
      {components.map((item, index) => (
        <div
          style={{
            width: size,
            height: size,
            zIndex: -index,
            marginLeft: index !== 0 ? `-${offset}` : undefined,
          }}
          key={index}
        >
          <item.Component {...item.props} />
        </div>
      ))}
    </div>
  )
}

export default StackedComponents
