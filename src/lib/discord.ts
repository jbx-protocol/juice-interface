import axios from 'axios'

const url = process.env.CONTACT_WEBHOOK_URL

export function createContactMessage(
  message: string,
  metadata: ContactMessageMetadata,
) {
  const body = {
    content: `<@&1070080230544392212>`, // Tags "Requests" role
    embeds: [
      {
        title: 'New Message from juicebox.money.',
        description: `At <t:${Math.floor(Date.now() / 1000)}>:`,
        color: 16098066,
        fields: [
          {
            name: 'Name',
            value: metadata.name ? metadata.name : 'No name provided.',
            inline: false,
          },
          {
            name: 'Contact',
            value: metadata.contact ? metadata.contact : 'No contact provided.',
            inline: true,
          },
          {
            name: 'Platform',
            value: metadata.contactPlatform
              ? metadata.contactPlatform
              : 'No platform provided.',
            inline: true,
          },
          {
            name: 'Subject',
            value: metadata.subject ? metadata.subject : 'No subject provided.',
            inline: false,
          },
          {
            name: 'Message',
            value: message,
            inline: false,
          },
        ],
      },
    ],
  }

  if (!url) {
    console.error(
      'Missing CONTACT_WEBHOOK_URL .env var required to send Discord alert: ',
      JSON.stringify(body),
    )
    throw new Error('Could not find CONTACT_WEBHOOK_URL .env var.')
  }

  return axios.post(url, JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export interface ContactMessageMetadata {
  name: string
  contact: string
  contactPlatform: string
  subject: string
}
