import { NextRouter } from 'next/router'
import React from 'react'

type AnnouncementCondition = ({
  router,
  isProjectOwner,
}: {
  router: NextRouter
  isProjectOwner: boolean
}) => boolean

export type Announcement = {
  id: string
  conditions: AnnouncementCondition[]
  expire?: number // millis timestamp
  content: React.FC
  cta?: {
    text?: string
    fn?: (router: NextRouter) => void
  }
}
