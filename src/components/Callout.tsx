import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import {
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export default function Callout({
  style,
  transparent,
  children,
  iconComponent,
  collapsible = false,
}: PropsWithChildren<{
  style?: CSSProperties
  transparent?: boolean
  iconComponent?: JSX.Element | null
  collapsible?: boolean
}>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  // Whether the callout is collapsed. Only relevant if collapsible is true.
  const [expanded, setExpanded] = useState<boolean>(false)

  // Whether the callout is collapsed. Only relevant if collapsible is true.
  const childrenWhiteSpace = useMemo(() => {
    if (collapsible) {
      return expanded ? 'normal' : 'nowrap'
    }
    return 'normal'
  }, [collapsible, expanded])

  // react callback handler to expand the callout text
  const handleToggleExpand = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  return (
    <div
      style={{
        color: colors.text.primary,
        padding: '1rem',
        backgroundColor: transparent ? undefined : colors.background.l2,

        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        cursor: collapsible ? 'pointer' : undefined,
        userSelect: collapsible ? 'none' : undefined,

        ...style,
      }}
      onClick={collapsible ? handleToggleExpand : undefined}
      role={collapsible ? 'button' : undefined}
    >
      {iconComponent !== null && (
        <span
          style={{
            lineHeight: 1.6,
            flexGrow: 0,
            flexShrink: 0,
          }}
        >
          {iconComponent ?? <InfoCircleOutlined />}
        </span>
      )}
      <div
        style={{
          display: 'grid', // Unsure why, but this stops it from being 100% width
          flexShrink: 1,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            whiteSpace: childrenWhiteSpace,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {children}
        </div>
      </div>
      {collapsible && (
        <DownOutlined
          rotate={expanded ? 180 : 0}
          style={{
            flexShrink: 0,
            flexGrow: 0,
            lineHeight: 1.6,
            width: '1rem',
            fontSize: '1rem',
          }}
        />
      )}
    </div>
  )
}
