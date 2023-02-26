import axios from 'axios'
import { ListmonkMessageData } from 'lib/listmonk'
import { SignatureLike } from '@ethersproject/bytes'

export function broadcastMessage(
  message: ListmonkMessageData,
  signature: SignatureLike,
) {
  return axios.post(`/api/listmonk/broadcast`, {
    message,
    signature,
  })
}
