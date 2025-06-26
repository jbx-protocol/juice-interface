import { DatePicker, DatePickerProps } from 'antd'

import { classNames } from 'utils/classNames'

export const JuiceDatePicker = (props: DatePickerProps) => {
  // Get current timezone using browser API
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  // Get timezone abbreviation using Intl API
  const timezoneAbbr = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short'
  })
    .formatToParts(new Date())
    .find(part => part.type === 'timeZoneName')?.value || 'UTC'
  
  return (
    <div className="relative">
      <DatePicker
        {...props}
        className={classNames(
          'rounded-lg border-smoke-300 bg-smoke-50 text-black dark:border-slate-300 dark:bg-slate-600 dark:text-slate-100 dark:placeholder:text-slate-300',
          props.className,
        )}
      />
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Timezone: {timezone} ({timezoneAbbr})
      </div>
    </div>
  )
}
