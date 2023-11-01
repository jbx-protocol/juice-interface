import Icon, {
  ExclamationCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { twMerge } from 'tailwind-merge'

type BannerVariant = 'warning' | 'info' | 'blue'
type TextAlignOption = 'left' | 'center' | 'right'

export default function Banner({
  title,
  body,
  actions,
  variant = 'info',
  textAlign = 'left',
}: {
  title?: string | JSX.Element
  body: string | JSX.Element
  actions?: JSX.Element
  variant?: BannerVariant
  textAlign?: TextAlignOption
}) {
  const variantClasses: {
    [k in BannerVariant]: { textClasses: string; backgroundClasses: string }
  } = {
    warning: {
      textClasses: 'text-warning-800  dark:text-warning-200',
      backgroundClasses:
        'bg-warning-200 dark:bg-warning-800 border border-warning-800 dark:border-warning-200',
    },
    info: {
      textClasses: '',
      backgroundClasses: 'bg-smoke-75 dark:bg-slate-400',
    },
    blue: {
      textClasses: 'text-bluebs-700 dark:text-bluebs-200',
      backgroundClasses: 'bg-bluebs-50 dark:bg-bluebs-900',
    },
  }
  const textAlignmentClass = `text-${textAlign}`

  const variantIcon: {
    [k in BannerVariant]: typeof Icon
  } = {
    warning: WarningOutlined,
    info: ExclamationCircleOutlined,
    blue: ExclamationCircleOutlined,
  }

  const IconComponent = variantIcon[variant]

  const { textClasses, backgroundClasses } = variantClasses[variant]

  return (
    <div
      className={twMerge(
        'py-4 px-12',
        textClasses,
        backgroundClasses,
        textAlignmentClass,
      )}
    >
      {title ? (
        <span className="mb-2 flex items-center gap-2">
          <IconComponent />
          <h2 className={twMerge('m-0 text-sm font-medium', textClasses)}>
            {title}
          </h2>
        </span>
      ) : null}
      <div>{body}</div>

      {actions && <div>{actions}</div>}
    </div>
  )
}
