import axios from 'axios'
import {
  ListmonkListData,
  ListmonkMessageData,
  ListmonkSubscriptionData,
} from 'lib/listmonk'
import { SignatureLike } from '@ethersproject/bytes'

export function broadcastMessage(
  messageData: ListmonkMessageData,
  signature: SignatureLike,
) {
  return axios.post(`/api/listmonk/broadcastMessage`, {
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

export function createSubscription(
  subscriptionData: ListmonkSubscriptionData,
  subscribeToJBUpdates?: boolean,
) {
  return axios.post(`/api/listmonk/createSubscription`, {
    subscriptionData,
    subscribeToJBUpdates,
  })
}
