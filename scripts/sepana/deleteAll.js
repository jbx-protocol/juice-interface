const axios = require('axios')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

async function main() {
  const { apiKey, engineId } = argv

  try {
    const res = await axios.delete(
      'https://api.sepana.io/v1/engine/data/delete',
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        data: {
          engine_id: engineId,
          delete_query: {
            query: {
              match_all: {},
            },
          },
        },
      },
    )

    if (res.status === 200) {
      console.info(res.data.detail)
    } else {
      console.info(
        `Request completed ${res.status} - ${res.message}. ${res.data.detail}`,
      )
    }
    process.exit(0)
  } catch (error) {
    console.error('Error deleting all Sepana records:', error.message)
    process.exit(1)
  }
}

main()
