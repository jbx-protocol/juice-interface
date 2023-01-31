export type SPEngine = 'projects' | 'timelines'

export function idForEngine(t: SPEngine): string {
  switch (t) {
    case 'projects':
      if (!process.env.SEPANA_PROJECTS_ENGINE_ID) {
        throw new Error('Missing SEPANA_PROJECTS_ENGINE_ID')
      }
      return process.env.SEPANA_PROJECTS_ENGINE_ID
    case 'timelines':
      if (!process.env.SEPANA_TIMELINES_ENGINE_ID) {
        throw new Error('Missing SEPANA_TIMELINES_ENGINE_ID')
      }
      return process.env.SEPANA_TIMELINES_ENGINE_ID
  }
}
