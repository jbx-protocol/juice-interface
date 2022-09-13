import { detailedTimeString } from '../formatTime'

describe('formatTime utilities', () => {
  describe('detailedTimeString', () => {
    it.each`
      timeSeconds | roundToMinutes | output
      ${1}        | ${false}       | ${'1s'}
      ${59}       | ${false}       | ${'59s'}
      ${59}       | ${true}        | ${'--'}
      ${60}       | ${false}       | ${'1m'}
      ${60}       | ${true}        | ${'1m'}
      ${3600}     | ${false}       | ${'1h'}
      ${3601}     | ${false}       | ${'1h 1s'}
      ${3661}     | ${false}       | ${'1h 1m 1s'}
      ${3659}     | ${false}       | ${'1h 59s'}
      ${3659}     | ${true}        | ${'1h'}
      ${86400}    | ${false}       | ${'1d'}
      ${86460}    | ${false}       | ${'1d 1m'}
      ${86461}    | ${false}       | ${'1d 1m 1s'}
      ${86461}    | ${true}        | ${'1d 1m'}
      ${86401}    | ${false}       | ${'1d 1s'}
      ${86399}    | ${false}       | ${'23h 59m 59s'}
      ${5184000}  | ${false}       | ${'60d'}
    `(
      'returns "$output" when timeSeconds is "$timeSeconds" and roundToMinutes is "$roundToMinutes"',
      ({ timeSeconds, roundToMinutes, output }) => {
        expect(detailedTimeString({ timeSeconds, roundToMinutes })).toBe(output)
      },
    )
  })
})
