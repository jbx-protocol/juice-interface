import { KeypAuth } from '@usekeyp/js-sdk'
import NextAuth, { AuthOptions } from 'next-auth'

const NextAuthOptions = KeypAuth({
  clientId: process.env.KEYP_CLIENT_ID, // From dev portal
  secret: process.env.NEXTAUTH_SECRET, // Random string
  redirectUrl: 'http://localhost:3001/',
}) as unknown as AuthOptions // Must cast here as KeypAuth typing unexpectedly conflicts with expected AuthOptions, though it appears to be an error.

export default NextAuth(NextAuthOptions)
