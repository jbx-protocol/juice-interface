/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { pairToDatum } from './pairToDatum'

describe('pairToDatum', () => {
  it('returns the correct datum when upcoming is null', () => {
    const name = 'Name'
    const current = 'Current'
    const upcoming = null

    const expected = {
      name,
      new: current,
    }

    expect(pairToDatum(name, current, upcoming)).toEqual(expected)
  })

  it('returns the correct datum when upcoming is defined', () => {
    const name = 'Name'
    const current = 'Current'
    const upcoming = 'Upcoming'

    const expected = {
      name,
      old: current,
      new: upcoming,
    }

    expect(pairToDatum(name, current, upcoming)).toEqual(expected)
  })
})
