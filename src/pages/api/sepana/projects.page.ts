import { createServerSupabaseClient } from '@supabase/auth-helpers-shared'
import { NextApiHandler } from 'next'

// Searches Juicebox projects matching text query param
const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res })

  const { text, pageSize } = req.query

  if (typeof text !== 'string') {
    res.status(400).send('Query is not a string')
    return
  }

  try {
    const results = await supabase
      .from('projects')
      .select('*')
      .textSearch('name', text, {
        config: 'english',
      })
      .limit(parseInt((pageSize as string) ?? 0)) // TODO check sql injection possibility

    res.status(200).json(results)
  } catch (e) {
    res.status(500).send(e)
  }
}

export default handler
