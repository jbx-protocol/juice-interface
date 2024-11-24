import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { t, Trans } from '@lingui/macro'
import { Callout } from 'components/Callout/Callout'
import { EmptyScreen } from 'components/Project/ProjectTabs/EmptyScreen'
import { RichPreview } from 'components/RichPreview/RichPreview'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useAboutPanel } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useAboutPanel'

export const AboutPanel = () => {
  const { description } = useAboutPanel()
  const { projectMetadata } = useProjectMetadataContext()

  const payDisclosure = projectMetadata?.payDisclosure
  const name = projectMetadata?.name

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
        {/* provide an anchorpoint */}
        <span id="notice"></span>
        {name && payDisclosure && (
          <Callout
            collapsible
            className="mt-6 border border-bluebs-100 bg-bluebs-25 text-bluebs-700 dark:border-bluebs-800 dark:bg-bluebs-950 dark:text-bluebs-400"
            iconComponent={<EnvelopeIcon className="h-6 w-6" />}
          >
            <>
              <div className="font-medium text-bluebs-700 dark:text-bluebs-300">
                <Trans>Notice from {name}</Trans>
              </div>
              <p className="mt-2 mb-0">{payDisclosure}</p>
            </>
          </Callout>
        )}
      </div>
    </div>
  )
}
