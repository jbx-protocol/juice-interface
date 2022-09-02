import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'
import React from 'react'
import { V2ArchiveProject } from './ArchiveV2Project'

export function V2ArchiveProjectSettingsPage() {
  const editV2ProjectDetailsTx = useEditV2ProjectDetailsTx()
  return <V2ArchiveProject editV2ProjectDetailsTx={editV2ProjectDetailsTx} />
}
