const fs = require('fs')

const { colors } = require('../src/constants/styles/colors.js')

console.log('🎨 Compiling:', colors)

fs.writeFileSync(
  __dirname + '/../src/styles/colors.less',
  Object.entries(colors).reduce(
    (acc, [key, val]) => acc + `@${key}: ${val}; \n`,
    '',
  ),
  err => {
    throw err
  },
)

fs.writeFileSync(
  __dirname + '/../src/styles/colors.scss',
  Object.entries(colors).reduce(
    (acc, [key, val]) => acc + `$${key}: ${val}; \n`,
    '',
  ),
  err => {
    throw err
  },
)
