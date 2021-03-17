import { colors } from 'constants/styles/colors'

export default function InputAccessoryButton({
  content,
  onClick,
  placement,
}: {
  content: string | JSX.Element | undefined
  onClick?: VoidFunction
  placement?: 'prefix' | 'suffix'
}) {
  return content ? (
    <div
      style={{
        cursor: 'pointer',
        color: colors.secondary,
        background: colors.secondaryHint,
        fontWeight: 500,
        padding: '1px 6px',
        marginLeft: placement === 'suffix' ? 8 : 0,
        marginRight: placement === 'prefix' ? 8 : 0,
        borderRadius: 4,
      }}
      onClick={onClick}
    >
      {content}
    </div>
  ) : null
}
