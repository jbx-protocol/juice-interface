import { XMarkIcon } from '@heroicons/react/24/outline'
import { twMerge } from 'tailwind-merge'
import { ProtocolActivityList } from './ProtocolActivityList'
import { useProtocolActivity } from './ProtocolActivityContext'

export function ProtocolActivityPanel() {
  const { isOpen, close } = useProtocolActivity()

  return (
    <div
      className={twMerge(
        'sticky top-0 self-start bg-white transition-all duration-300 dark:bg-slate-900',
        'border-l-2 border-smoke-300 shadow-2xl dark:border-slate-700',
        'h-screen flex flex-col',
        isOpen ? 'w-[400px]' : 'w-0',
      )}
    >
      {isOpen && (
        <>
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-6 right-6 z-10 text-grey-400 hover:text-grey-600 dark:text-slate-200 dark:hover:text-slate-100"
            aria-label="Close protocol activity panel"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <ProtocolActivityList />
          </div>
        </>
      )}
    </div>
  )
}
