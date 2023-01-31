import { getByIdHandler } from 'lib/sepana/handlers/getById'
import { isPID } from 'utils/project'

export default getByIdHandler('projects', { idValidator: isPID })
