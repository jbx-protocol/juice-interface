import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { CV_V2, CV_V3 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { CV2V3 } from 'models/v2v3/cv'
import { useRouter } from 'next/router'
import { useContext } from 'react'

const CV_LABELS: Record<CV2V3, string> = {
  [CV_V2]: 'V2',
  [CV_V3]: 'V3',
}

/**
 * A Select component to switch between V2 and V3 contracts.
 */
export function ContractVersionSelect() {
  const { setCv, cv, cvs } = useContext(V2V3ContractsContext)
  const router = useRouter()

  /**
   * Adds the `cv` query param to the URL if V2 is selected.
   */
  function updateRoute(value: CV2V3) {
    router.replace(
      {
        pathname: window.location.pathname,
        search: value === CV_V2 ? `?cv=${CV_V2}` : '',
      },
      undefined,
      { shallow: true },
    )
  }

  const SELECT_OPTIONS: ContractVersionOption[] =
    cvs?.map(cv => ({
      label: CV_LABELS[cv],
      value: cv,
    })) ?? []

  const contractVersionOption = SELECT_OPTIONS.find(
    option => option.value === cv,
  )

  if (!cv) return null

  if (SELECT_OPTIONS.length < 2) {
    // only show version badge for v2 projects
    if (cvs?.includes(CV_V2)) {
      return <ProjectVersionBadge versionText={`V${cv}`} className="mr-2" />
    }

    return null
  }

  return (
    <JuiceListbox
      buttonClassName="border-0 bg-transparent dark:bg-transparent font-normal py-0"
      options={SELECT_OPTIONS}
      value={contractVersionOption}
      onChange={v => {
        setCv?.(v.value)
        updateRoute(v.value)
      }}
    />
  )
}

interface ContractVersionOption {
  label: string
  value: CV2V3
}
