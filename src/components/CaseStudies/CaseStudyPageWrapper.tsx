import { PropsWithChildren } from 'react'

export function CaseStudyPageWrapper({
  children,
}: PropsWithChildren<Record<never, never>>) {
  return <article>{children}</article>
}
