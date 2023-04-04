import { Trans } from '@lingui/macro'
import { ProjectTagsRow } from 'components/ProjectTagsRow'
import Link from 'next/link'

export default function IntroProjectTags() {
  return (
    <div>
      <h1 className="font-heading text-2xl">
        <Trans>
          <span className="text-juice-500">NEW:</span> Project tags
        </Trans>
      </h1>
      <ProjectTagsRow />
      <div className="mt-2">
        <Trans>
          You can now add tags in{' '}
          <Link href={'/settings?page=general'} as={'/settings?page=general'}>
            settings
          </Link>{' '}
          to describe your project, and help supporters find it. Anyone can
          search for projects by tag on the Explore page.
        </Trans>
      </div>
    </div>
  )
}
