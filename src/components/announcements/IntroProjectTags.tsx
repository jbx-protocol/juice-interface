import { Trans } from '@lingui/macro'
import ProjectTagsRow from 'components/ProjectTagsRow'
import { projectTagOptions } from 'models/project-tags'

export default function IntroProjectTags() {
  return (
    <div>
      <h1>
        <Trans>
          <span className="text-juice-500">NEW:</span> Project tags
        </Trans>
      </h1>
      <ProjectTagsRow tags={[...projectTagOptions]} />
      <br />
      <Trans>
        You can now add tags to describe your project, and help contributors
        find it. Anyone can search for projects by tag on the Explore page.
      </Trans>
    </div>
  )
}
