import { Trans } from '@lingui/macro'
import { ProjectTagsRow } from 'components/ProjectTagsRow'
import { projectTagOptions } from 'models/project-tags'

export default function IntroProjectTags() {
  return (
    <div>
      <h1 className="font-heading text-2xl">
        <Trans>
          <span className="text-juice-500">NEW:</span> Project tags
        </Trans>
      </h1>
      <ProjectTagsRow tags={[...projectTagOptions]} />
      <div className="mt-2">
        <Trans>
          You can now add tags to describe your project, and help supporters
          find it. Anyone can search for projects by tag on the Explore page.
        </Trans>
      </div>
    </div>
  )
}
