import { t } from "@lingui/macro"
import { EmptyScreen } from "components/Project/ProjectTabs/EmptyScreen"
import { RichPreview } from "components/RichPreview/RichPreview"
import { useV4AboutPanel } from "./hooks/useV4AboutPanel"

export const V4AboutPanel = () => {
  const { description } = useV4AboutPanel()
  return (
    <div className="flex min-h-[384px] w-full flex-col gap-8 md:gap-10">
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
}
