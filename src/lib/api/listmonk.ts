import axios from 'axios'
import { ListmonkListData, ListmonkMessageData } from 'lib/listmonk'
import { SignatureLike } from '@ethersproject/bytes'

export function broadcastMessage(
  messageData: ListmonkMessageData,
  signature: SignatureLike,
) {
  return axios.post(`/api/listmonk/broadcast`, {
    messageData,
    signature,
  })
}

export function createList(
  listData: ListmonkListData,
  signature: SignatureLike,
) {
  return axios.post(`/api/listmonk/createList`, {
    listData,
    signature,
  })
}
