import Icon, {
  ExclamationCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { classNames } from 'utils/classNames'

type BannerVariant = 'warning' | 'info'

export default function Banner({
  title,
  body,
  actions,
  variant = 'info',
}: {
  title: string | JSX.Element
  body: string | JSX.Element
  actions?: JSX.Element
  variant?: BannerVariant
}) {
  const variantClasses: {
    [k in BannerVariant]: { textClasses: string; backgroundClasses: string }
  } = {
    warning: {
      textClasses: 'text-warning-800  dark:text-warning-200',
      backgroundClasses:
        'bg-warning-200 dark:bg-warning-800 border border-solid border-warning-800 dark:border-warning-200',
    },
    info: {
      textClasses: '',
      backgroundClasses: 'bg-smoke-75 dark:bg-slate-400',
    },
  }

  const variantIcon: {
    [k in BannerVariant]: typeof Icon
  } = {
    warning: WarningOutlined,
    info: ExclamationCircleOutlined,
  }

  const IconComponent = variantIcon[variant]

  const { textClasses, backgroundClasses } = variantClasses[variant]

  return (
    <div className={classNames('py-4 px-12', textClasses, backgroundClasses)}>
      <span className="mb-2 flex items-center gap-2">
        <IconComponent />
        <h2 className={classNames('m-0 text-sm font-medium', textClasses)}>
          {title}
        </h2>
      </span>
      <div>{body}</div>

      {actions && <div>{actions}</div>}
    </div>
  )
}
