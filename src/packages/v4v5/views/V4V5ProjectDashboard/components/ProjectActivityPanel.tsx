import { ProjectActivityList } from './ProjectActivityList'

export function ProjectActivityPanel() {
  return (
    <div
      className="sticky top-0 self-start bg-white dark:bg-slate-900 border-l-2 border-smoke-300 shadow-2xl dark:border-slate-700 h-screen flex flex-col w-[420px]"
    >
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <ProjectActivityList />
      </div>
    </div>
  )
}
