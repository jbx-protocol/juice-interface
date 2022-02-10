import { tokenSymbolText } from '../tokenSymbolText'

describe('tokenSymbolText', () => {
  it.each`
    tokenSymbol  | capitalize | plural   | includeTokenWord | result
    ${'JBX'}     | ${true}    | ${true}  | ${true}          | ${'JBX Tokens'}
    ${'JBX'}     | ${true}    | ${true}  | ${false}         | ${'JBX'}
    ${'JBX'}     | ${true}    | ${false} | ${true}          | ${'JBX Token'}
    ${'JBX'}     | ${true}    | ${false} | ${false}         | ${'JBX'}
    ${'JBX'}     | ${false}   | ${true}  | ${true}          | ${'JBX tokens'}
    ${'JBX'}     | ${false}   | ${true}  | ${false}         | ${'JBX'}
    ${'JBX'}     | ${false}   | ${false} | ${true}          | ${'JBX token'}
    ${'JBX'}     | ${false}   | ${false} | ${false}         | ${'JBX'}
    ${undefined} | ${true}    | ${true}  | ${true}          | ${'Tokens'}
    ${undefined} | ${true}    | ${true}  | ${false}         | ${'Tokens'}
    ${undefined} | ${true}    | ${false} | ${true}          | ${'Token'}
    ${undefined} | ${true}    | ${false} | ${false}         | ${'Token'}
    ${undefined} | ${false}   | ${true}  | ${true}          | ${'tokens'}
    ${undefined} | ${false}   | ${true}  | ${false}         | ${'tokens'}
    ${undefined} | ${false}   | ${false} | ${true}          | ${'token'}
    ${undefined} | ${false}   | ${false} | ${false}         | ${'token'}
  `(
    'returns $result when tokenSymbol=$tokenSymbol, capitalize=$capitalize, plural=$plural, $includeTokenWord=includeTokenWord',
    ({ tokenSymbol, capitalize, plural, includeTokenWord, result }) => {
      expect(
        tokenSymbolText({ tokenSymbol, capitalize, plural, includeTokenWord }),
      ).toBe(result)
    },
  )
})
