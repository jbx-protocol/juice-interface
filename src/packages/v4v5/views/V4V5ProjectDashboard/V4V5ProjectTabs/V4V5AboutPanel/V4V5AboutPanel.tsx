import { t } from "@lingui/macro"
import { EmptyScreen } from "components/Project/ProjectTabs/EmptyScreen"
import { RichPreview } from "components/RichPreview/RichPreview"
import { forwardRef } from "react"
import { useV4V5AboutPanel } from "./hooks/useV4V5AboutPanel"

export const V4V5AboutPanel = forwardRef<HTMLDivElement>((props, ref) => {
  const { description } = useV4V5AboutPanel()
  return (
    <div ref={ref} className="flex min-h-[384px] w-full flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-4 whitespace-pre-wrap">
        {description ? (
          <RichPreview source={description} />
        ) : (
          <>
            <EmptyScreen subtitle={t`This project has no description`} />
          </>
        )}
      </div>
    </div>
  )
})

V4V5AboutPanel.displayName = 'V4V5AboutPanel'
