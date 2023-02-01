import axios from 'axios'

const DISCORD_WEBHOOK_BASE_URL = 'https://discord.com/api/webhooks/'
const axiosInstance = axios.create({
  baseURL: DISCORD_WEBHOOK_BASE_URL,
})

export function createContactMessage(
  name: string,
  contact: string,
  contactPlatform: string,
  subject: string,
  message: string,
) {
  const body = {
    content: `<@&1070080230544392212>`, // Tags "Requests" role
    embeds: [
      {
        title: 'New Message from juicebox.money',
        description: `At ${new Date().toUTCString()}:`,
        color: 16098066,
        fields: [
          {
            name: 'Name',
            value: name,
            inline: true,
          },
          {
            name: 'Contact',
            value: contact,
            inline: true,
          },
          {
            name: 'Platform',
            value: contactPlatform,
            inline: true,
          },
          {
            name: 'Subject',
            value: subject,
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

  return axiosInstance.post(
    '1069960445412249710/v653BVTT0hNwqDRuOPDRyNzp8IE1dFx183-xmM2tqp2rxUxjVUmSXGjy57S2XwJL39Pf',
    JSON.stringify(body),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}
