// const axios = require('axios')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

/**
 * Deletes a record from a Sepana engine
 *
 * `node scripts/sepana/delete.js --id=<record-id> --engineId=<engine-id> --apiKey=<api-key>`
 */
async function main() {
  const { id, apiKey, engineId } = argv

  console.error(
    'This function is disabled while a Sepana `delete_query` bug is investigated',
    { id, apiKey, engineId },
  )

  // try {
  //   const res = await axios.delete(
  //     'https://api.sepana.io/v1/engine/data/delete',
  //     {
  //       headers: {
  //         'x-api-key': apiKey,
  //         'Content-Type': 'application/json',
  //       },
  //       data: {
  //         engine_id: engineId,
  //         delete_query: {
  //           query: {
  //             match: {
  //               id,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   )

  //   if (res.status === 200) {
  //     console.info(res.data.detail)
  //   } else {
  //     console.info(
  //       `Request completed ${res.status} - ${res.message}. ${res.data.detail}`,
  //     )
  //   }
  //   process.exit(0)
  // } catch (error) {
  //   console.error('Error deleting all Sepana records:', error.message)
  //   process.exit(1)
  // }
}

main()
