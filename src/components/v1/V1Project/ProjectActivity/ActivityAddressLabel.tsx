import FormattedAddress from 'components/FormattedAddress'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import V2V3ProjectHandle from 'components/v2v3/shared/V2V3ProjectHandle'
import { DistributeToPayoutModEvent } from 'generated/graphql'
import { useAddressIsProjectPayer } from 'hooks/AddressIsProjectPayer'
import React from 'react'

const ActivityAddressLabel = ({ e }: { e: DistributeToPayoutModEvent }) => {
  const { data } = useAddressIsProjectPayer(e.modBeneficiary)
  const project = data && data.length > 0 ? data[0].project : null
  return (
    <div style={{ fontWeight: 500 }}>
      {e.modProjectId?.gt(0) ? (
        <span>
          <V1ProjectHandle projectId={e.modProjectId} />
        </span>
      ) : (
        <>
          {project ? (
            <>
              <V2V3ProjectHandle
                projectId={project.id}
                handle={project.handle}
              />{' '}
              <span>{`(v${project.cv} payer)`}</span>
            </>
          ) : (
            <FormattedAddress address={e.modBeneficiary} />
          )}
        </>
      )}
      :
    </div>
  )
}

export default ActivityAddressLabel
