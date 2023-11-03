/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react'
import { SocialLinkButton } from './SocialLinkButton'

describe('SocialLinkButton', () => {
  it('renders', () => {
    render(<SocialLinkButton type="twitter" href="#" />)
  })

  it.each(['twitter', 'discord', 'telegram', 'website'])(
    'renders %s button',
    type => {
      const { getByText } = render(
        <SocialLinkButton type={type as any} href="#" />,
      )

      expect(
        getByText(type[0].toUpperCase() + type.slice(1)),
      ).toBeInTheDocument()
    },
  )

  it('sets href', () => {
    const href = 'https://google.com'
    const { getByRole } = render(
      <SocialLinkButton type="twitter" href={href} />,
    )
    const link = getByRole('link')
    expect(link).toHaveAttribute('href', href)
  })
})
