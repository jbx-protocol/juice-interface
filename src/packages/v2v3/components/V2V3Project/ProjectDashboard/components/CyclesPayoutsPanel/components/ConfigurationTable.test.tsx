/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { ConfigurationTable } from './ConfigurationTable'

describe('ConfigurationTable', () => {
  it('renders', () => {
    const { container } = render(
      <ConfigurationTable
        title={'title'}
        data={{
          foo: {
            name: 'foo',
            old: 'old',
            new: 'new',
          },
          bar: {
            name: 'bar',
            new: 'new',
          },
          baz: {
            name: 'baz',
            old: 'old',
            new: 'new',
          },
        }}
      />,
    )
    expect(container).toMatchSnapshot()
  })
})
