import {
  BaseEventEntity,
  BaseEventEntityJson,
  parseBaseEventEntityJson,
} from '../base/base-event-entity'
import {
  BaseProjectEntity,
  BaseProjectEntityJson,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface ProjectCreateEvent
  extends BaseEventEntity,
    BaseProjectEntity {}

export type ProjectCreateEventJson = Partial<
  Record<keyof ProjectCreateEvent, string> &
    BaseProjectEntityJson &
    BaseEventEntityJson
>

export const parseProjectCreateEventJson = (
  j: ProjectCreateEventJson,
): Partial<ProjectCreateEvent> => ({
  ...parseBaseProjectEntityJson(j),
  ...parseBaseEventEntityJson(j),
})
