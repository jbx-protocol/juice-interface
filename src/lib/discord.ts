import axios from 'axios'

const DISCORD_WEBHOOK_BASE_URL = 'https://discord.com/api/webhooks/'
const DISCORD_WEBHOOK_ENDPOINT =
  '1069960445412249710/v653BVTT0hNwqDRuOPDRyNzp8IE1dFx183-xmM2tqp2rxUxjVUmSXGjy57S2XwJL39Pf'
const axiosInstance = axios.create({
  baseURL: DISCORD_WEBHOOK_BASE_URL,
})

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

  return axiosInstance.post(DISCORD_WEBHOOK_ENDPOINT, JSON.stringify(body), {
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
