import { Contract } from '@ethersproject/contracts'
import axios from 'axios'
import { readNetwork } from 'constants/networks'

const API_KEY = process.env.NEXT_PUBLIC_TENDERLY_API_KEY
const ACCOUNT = process.env.NEXT_PUBLIC_TENDERLY_ACCOUNT
const PROJECT = process.env.NEXT_PUBLIC_TENDERLY_PROJECT_NAME

export const simulateTransaction = async ({
  contract,
  functionName,
  args,
  userAddress,
}: {
  contract: Contract
  functionName: string
  args: unknown[]
  userAddress: string | undefined
}) => {
  if (!(API_KEY && PROJECT && ACCOUNT)) return

  const unsignedTx = await contract.populateTransaction[functionName](...args)

  const body = {
    network_id: readNetwork.chainId,
    from: userAddress,
    to: contract.address,
    input: unsignedTx.data,
    value: 0,
    save_if_fails: true,
  }

  const headers = {
    headers: {
      'content-type': 'application/JSON',
      'X-Access-Key': API_KEY,
    },
  }
  const resp = await axios.post(
    `https://api.tenderly.co/api/v1/account/${ACCOUNT}/project/${PROJECT}/simulate`,
    body,
    headers,
  )

  if (resp.data.simulation.status === false) {
    console.error(resp.data)

    throw new Error('Transaction is going to fail')
  }
}
