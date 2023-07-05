/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-redeclare */

import devAssert from 'assert'

let assert: typeof devAssert
if ('production' === process.env.NODE_ENV) {
  assert = ((a, b) => {
    if (!!a) return
    console.error(b)
  }) as typeof devAssert
} else {
  assert = devAssert
}

export default assert
