import { Divider } from 'antd'
import { ReactNode, useCallback, useContext, useMemo } from 'react'
import { classNames } from 'utils/classNames'
import { CheckedCircle, RadialBackgroundIcon } from './components'
import { SelectionContext } from './Selection'

const Container: React.FC<{
  isSelected: boolean
  isDefocused: boolean
  isDisabled: boolean
}> = ({ isDefocused, isSelected, isDisabled, children }) => {
  const borderColorClassNames = useMemo(() => {
    if (isSelected) return 'border-haze-500'
    return classNames(
      !isDisabled ? 'hover:border-smoke-500 dark:hover:border-slate-100' : '',
      isDefocused
        ? 'border-smoke-200 dark:border-slate-500'
        : 'border-smoke-300 dark:border-slate-300',
    )
  }, [isDefocused, isDisabled, isSelected])

  const backgroundColorClassNames = useMemo(() => {
    if (isDefocused) return 'bg-smoke-50 dark:bg-slate-800'
    return 'dark:bg-slate-600'
  }, [isDefocused])

  return (
    <div
      className={classNames(
        'transition-colors border rounded-sm border-solid',
        borderColorClassNames,
        backgroundColorClassNames,
      )}
    >
      {children}
    </div>
  )
}

export interface SelectionCardProps {
  name: string
  title: ReactNode
  icon?: ReactNode
  titleBadge?: ReactNode
  description?: ReactNode
  isSelected?: boolean
  isDisabled?: boolean
  checkPosition?: 'left' | 'right'
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  name,
  title,
  icon,
  description,
  checkPosition = 'right',
  isDisabled = false,
  children,
}) => {
  const { selection, defocusOnSelect, setSelection } =
    useContext(SelectionContext)
  const isSelected = selection === name

  const onClick = useCallback(() => {
    if (isDisabled) return
    if (isSelected) {
      setSelection?.(undefined)
      return
    }
    setSelection?.(name)
  }, [isDisabled, isSelected, name, setSelection])

  const defocused =
    (!!defocusOnSelect && !!selection && !isSelected) || isDisabled

  /**
   * Undefined means default color.
   */
  const titleColorClassNames = useMemo(() => {
    if (defocused) return 'text-grey-400 dark:text-slate-400'
  }, [defocused])

  return (
    <Container
      isSelected={isSelected}
      isDefocused={defocused}
      isDisabled={isDisabled}
    >
      <div
        role="button"
        className={classNames(
          'py-6 select-none',
          isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
        onClick={onClick}
      >
        <div className="px-4">
          <div className="flex gap-4">
            {checkPosition === 'left' && (
              <CheckedCircle checked={isSelected} defocused={defocused} />
            )}
            <div>
              {icon && (
                <RadialBackgroundIcon isDefocused={defocused} icon={icon} />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div
                className={classNames(
                  'font-medium text-lg m-0 mt-1',
                  titleColorClassNames,
                )}
              >
                {title}
              </div>
              {isSelected && description && <div>{description}</div>}
            </div>
            {checkPosition === 'right' && (
              <CheckedCircle checked={isSelected} defocused={defocused} />
            )}
          </div>
        </div>
      </div>
      {isSelected && children && (
        <div className="pb-7">
          <Divider className="mt-0 mb-8" />
          <div className={`px-[calc(42px+32px)]`}>{children}</div>
        </div>
      )}
    </Container>
  )
}
