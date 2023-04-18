import { createClient } from '@supabase/supabase-js'
import { Client, GatewayIntentBits, GuildMember, Snowflake } from 'discord.js'
import { authCheck } from 'lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from 'types/database.types'

const {
  DISCORD_BOT_TOKEN,
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  JUICEBOX_GUILD_ID,
} = process.env

const client = new Client({ intents: [GatewayIntentBits.GuildMembers] })
const supabase = createClient<Database>(
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
)

const getDiscordUsers = async () => {
  const guild = await client.guilds.fetch(JUICEBOX_GUILD_ID)

  if (!guild) {
    throw new Error('Guild not found: Juicebox')
  }
  const role = (await guild.roles.fetch()).find(r => r.name === 'Contributor')
  if (!role) {
    throw new Error('Role not found: Contributor')
  }
  const members = await guild.members.fetch()

  return members.filter(member => member.roles.cache.has(role.id))
}

const insertUserToSupabase = async (
  user: GuildMember['user'],
): Promise<void> => {
  const { id, username, avatar } = user

  // Fetch existing user data from the table
  const { data: existingUser } = await supabase
    .from('contributors')
    .select('*')
    .eq('id', id)
    .single()

  const isDiscordAvatar = existingUser?.is_discord_avatar ?? avatar !== null
  const avatarUrl = isDiscordAvatar
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.jpg`
    : null

  await supabase.from('contributors').upsert(
    {
      id,
      name: username,
      is_discord_avatar: isDiscordAvatar,
      avatar_url: avatarUrl,
    },
    { onConflict: 'id' },
  )
}

const removeOldUsers = async (userIds: Snowflake[]): Promise<void> => {
  await supabase.from('contributors').delete().not('id', 'in', userIds)
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }
  if (!authCheck(req, res)) return

  try {
    await client.login(DISCORD_BOT_TOKEN)
    await Promise.all([client.guilds.fetch('775859454780244028')])
    const users = await getDiscordUsers()
    await Promise.all(users.map(({ user }) => insertUserToSupabase(user)))

    const userIds = users.map(user => user.user.id)
    await removeOldUsers(userIds)

    res
      .status(200)
      .json({ message: 'Users added to Supabase table successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler
