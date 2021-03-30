import { ProjectIdentifier } from 'models/projectIdentifier'

export const deepEqProjectIdentifiers = (
  a?: ProjectIdentifier,
  b?: ProjectIdentifier,
) =>
  a?.handle === b?.handle &&
  a?.link === b?.link &&
  a?.logoUri === b?.logoUri &&
  a?.name === b?.name
