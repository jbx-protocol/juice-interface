const fs = require('fs')

const args = process.argv.slice(2)

const infuraId = args[0]

if (!infuraId) console.log('WARNING: missing Infura ID')

const vars = `REACT_APP_INFURA_ID=${infuraId}`

fs.writeFileSync('packages/app/.env', vars)
