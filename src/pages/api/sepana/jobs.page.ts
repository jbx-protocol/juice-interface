import { getJobs } from 'lib/sepana/jobs'
import { NextApiHandler } from 'next'

// Returns search database health report
const handler: NextApiHandler = async (req, res) => {
  const idsParam = req.query['ids']

  if (typeof idsParam !== 'string') {
    res.status(400).send('bad request')
    return
  }

  const idsArr = idsParam.split(',')

  if (!Array.isArray(idsArr)) {
    res.status(400).send('bad request')
    return
  }

  const jobs = await getJobs(idsArr)

  res.status(200).json({
    jobs: jobs.map(j => j.data),
  })
}

export default handler
