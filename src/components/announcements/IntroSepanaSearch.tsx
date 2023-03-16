import { Trans } from '@lingui/macro'

export default function IntroSepanaSearch() {
  return (
    <div>
      <h1>
        <Trans>
          <span className="text-juice-500">NEW:</span> Improved search
        </Trans>
      </h1>
      <Trans>
        You can now search for projects by their name, description, and tags, as
        well as their @handle.
      </Trans>
    </div>
  )
}
