import React, { CSSProperties, useEffect, useRef, useState } from 'react'

import createStyles from '../../utils/createStyles'

interface Option {
  label: React.ReactNode
  value: any
}

interface Props {
  options: Option[]
  orientation: 'vertical' | 'horizontal'
  onChange: (index: number) => void
  selectedIndex: number
}

const VeNftController: React.FC<Props> = ({
  onChange,
  options,
  orientation,
  selectedIndex,
}) => {
  const cellContainer = useRef<HTMLDivElement>(null)
  const gradientDirection = orientation === 'vertical' ? 'bottom' : 'right'

  const [transform, setTransform] = useState(0)

  useEffect(() => {
    if (cellContainer.current) {
      let node = cellContainer.current.childNodes[
        selectedIndex
      ] as HTMLDivElement

      if (orientation === 'horizontal') {
        setTransform(-node.offsetLeft - node.offsetWidth)
      } else {
        setTransform(-node.offsetTop - node.offsetHeight)
      }
    }
  }, [orientation, selectedIndex])

  const cellStyle: CSSProperties = {
    textAlign: 'center',
    fontSize: 20,
    padding: 8,
  }

  return (
    <div
      style={{
        ...styles.container,
        width: orientation === 'horizontal' ? 416 : 80,
        height: orientation === 'horizontal' ? 64 : 416,
      }}
    >
      <div
        style={{
          ...styles.innerContainer,
          backgroundImage: `linear-gradient(to ${gradientDirection}, #173b4f, #19485c, #1b5668, #1f6473, #25727d, #25727d, #25727d, #25727d, #1f6473, #1b5668, #19485c, #173b4f)`,
        }}
      >
        <div
          style={{
            ...styles.optionsContainer,
            left: orientation === 'horizontal' ? 'calc(50% + 16px)' : undefined,
            top: orientation === 'vertical' ? 'calc(50% + 32px)' : undefined,
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
            transform:
              orientation === 'horizontal'
                ? `translateX(${transform}px)`
                : `translateY(${transform}px)`,
          }}
          ref={cellContainer}
        >
          {options.map((option, i) => (
            <div
              key={option.value}
              role="button"
              style={{ ...cellStyle, cursor: 'pointer' }}
              onClick={() => onChange(i)}
            >
              {option.label}
            </div>
          ))}
          <div style={cellStyle} />
          <div style={cellStyle} />
        </div>
      </div>

      {/* Arrows */}
      {orientation === 'vertical' && (
        <div
          style={{
            ...styles.arrow,
            top: 'calc(50% - 16px)',
            right: orientation === 'vertical' ? -24 : undefined,
          }}
        >
          &lt;-
        </div>
      )}
      {orientation === 'horizontal' && (
        <div
          style={{
            ...styles.arrow,
            left: 'calc(50% - 16px)',
            bottom: orientation === 'horizontal' ? -24 : undefined,
          }}
        >
          ^^
        </div>
      )}
    </div>
  )
}

const styles = createStyles({
  container: {
    flex: 1,
    position: 'relative',
    backgroundImage:
      'linear-gradient(to right bottom, #010e20, #001422, #011923, #051c23, #0b2023)',
    borderRadius: 4,
    padding: 8,
    height: '100%',
  },
  innerContainer: {
    overflow: 'hidden',
    padding: 12,
    height: '100%',
    borderRadius: 4,
  },
  optionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%',
    alignItems: 'center',
    position: 'relative',
    transition: 'transform 0.3s',
  },
  arrow: {
    position: 'absolute',
  },
})

export default VeNftController
