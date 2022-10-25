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
    >
      {iconComponent !== null && (
        <span style={{ lineHeight: 1.6 }}>
          {iconComponent ?? <InfoCircleOutlined />}
        </span>
      )}
      <div
        style={{
          minWidth: 0,
          whiteSpace: childrenWhiteSpace,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </div>
      {collapsible && (
        <DownOutlined
          rotate={expanded ? 180 : 0}
          style={{ fontSize: '1rem', width: '1rem', flexShrink: 0 }}
        />
      )}
    </div>
  )
}
