/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { CurrentUpcomingSubPanel } from './CurrentUpcomingSubPanel'

describe('CurrentUpcomingSubPanel', () => {
  it.each(['current', 'upcoming'] as ('current' | 'upcoming')[])(
    'renders %p',
    type => {
      const { container } = render(<CurrentUpcomingSubPanel id={type} />)
      expect(container).toMatchSnapshot()
    },
  )
})
