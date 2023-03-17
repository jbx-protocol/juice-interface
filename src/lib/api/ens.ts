import axios from 'axios'

export function resolveAddress(address: string) {
  return axios
    .get<{ name: string }>(`/api/ens/resolve/${address}`)
    .then(data => data.data)
}
