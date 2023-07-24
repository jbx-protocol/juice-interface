import dynamic from 'next/dynamic'
import { RichEditorProps } from './RichEditor'

export const RichEditor = dynamic<RichEditorProps>(
  () => import('./RichEditor').then(mod => mod.RichEditor),
  { ssr: false },
)
