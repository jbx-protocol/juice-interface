const fs = require('fs')

const path = __dirname + '/../src/generated/graphql.ts'

try {
  // Load generated file
  let contents = fs.readFileSync(path).toString()

  // Replace generic string type with PV type for pv properties
  contents = contents.replaceAll("pv: Scalars['String']", 'pv: PV')
  contents = contents.replaceAll('pv: string', 'pv: PV')

  // Add import of PV type
  contents = `import { PV } from 'models/pv';\n` + contents

  // Overwrite original file
  fs.writeFileSync(path, contents)

  console.info('✔ PV types overwritten in generated graphql types')
} catch (e) {
  console.error('Error overriding PV types in generated graphql types', e)
}
