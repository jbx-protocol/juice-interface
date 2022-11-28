import axios from 'axios'

export function resolveAddress(address: string) {
  return axios.get(`/api/ens/resolve/${address}`).then(data => data.data.name)
}
