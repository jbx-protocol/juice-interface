import { ProjectIdentifier } from 'models/project-identifier'

export const deepEqProjectIdentifiers = (
  a?: ProjectIdentifier,
  b?: ProjectIdentifier,
) =>
  a?.handle === b?.handle &&
  a?.link === b?.link &&
  a?.logoUri === b?.logoUri &&
  a?.name === b?.name
