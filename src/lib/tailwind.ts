import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tailwind = resolveConfig(tailwindConfig) as any

export default tailwind
