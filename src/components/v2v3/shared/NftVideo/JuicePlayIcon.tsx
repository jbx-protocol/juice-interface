import { CaretRightOutlined } from '@ant-design/icons'
import { twJoin } from 'tailwind-merge'

export function JuicePlayIcon() {
  return (
    <div className="h-[30px] w-[30px] rounded-full bg-grey-400/[0.4]">
      <CaretRightOutlined
        className={twJoin(
          'text-white',
          'margin-auto mt-[3px] ml-[1px] h-[15px] w-full text-2xl',
        )}
      />
    </div>
  )
}
