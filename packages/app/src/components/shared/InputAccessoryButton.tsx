import { colors } from 'constants/styles/colors'
import { CaretDownOutlined } from '@ant-design/icons'

export default function InputAccessoryButton({
  content,
  onClick,
  withArrow,
  placement,
}: {
  content: string | JSX.Element | undefined
  withArrow?: boolean
  onClick?: VoidFunction
  placement?: 'prefix' | 'suffix'
}) {
  return content ? (
    <div
      style={{
        cursor: 'pointer',
        color: colors.cta,
        background: colors.ctaHint,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        padding: '1px 6px',
        marginLeft: placement === 'suffix' ? 8 : 0,
        marginRight: placement === 'prefix' ? 8 : 0,
        borderRadius: 4,
      }}
      onClick={onClick}
    >
      {content}
      {withArrow ? (
        <CaretDownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
      ) : null}
    </div>
  ) : null
}
