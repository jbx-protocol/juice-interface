import { PropsWithChildren } from 'react'

export function CaseStudyPageWrapper({
  children,
}: PropsWithChildren<Record<never, never>>) {
  return <article className="px-4 md:px-0">{children}</article>
}
