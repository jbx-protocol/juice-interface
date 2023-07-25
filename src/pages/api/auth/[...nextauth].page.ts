import { KeypAuth } from '@usekeyp/js-sdk'
import NextAuth, { AuthOptions } from 'next-auth'

const NextAuthOptions = KeypAuth({
  clientId: process.env.KEYP_CLIENT_ID, // From dev portal
  secret: process.env.KEYP_COOKIE_SECRET, // Random string
  redirectUrl: 'http://localhost:3000/api/auth/callback/keyp', // TODO
}) as unknown as AuthOptions

export default NextAuth(NextAuthOptions)
