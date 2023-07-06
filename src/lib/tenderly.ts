import axios from 'axios'
import { readNetwork } from 'constants/networks'
import { Contract } from 'ethers'
import { TransactionOptions } from 'models/transaction'

const API_KEY = process.env.NEXT_PUBLIC_TENDERLY_API_KEY
const ACCOUNT = process.env.NEXT_PUBLIC_TENDERLY_ACCOUNT
const PROJECT = process.env.NEXT_PUBLIC_TENDERLY_PROJECT_NAME

export const simulateTransaction = async ({
  contract,
  functionName,
  args,
  userAddress,
  options,
}: {
  contract: Contract
  functionName: string
  args: unknown[]
  userAddress: string | undefined
  options?: TransactionOptions | undefined
}) => {
  if (!(API_KEY && PROJECT && ACCOUNT)) {
    console.warn(
      'Missing Tenderly API key, project, or account for simulation.',
    )
    return
  }

  const unsignedTx =
    options?.value !== undefined
      ? await contract.populateTransaction[functionName](...args, {
          value: options.value,
        })
      : await contract.populateTransaction[functionName](...args)

  const body = {
    network_id: readNetwork.chainId,
    from: userAddress,
    to: contract.address,
    input: unsignedTx.data,
    value: options?.value?.toString() ?? 0,
    save_if_fails: true,
    save: true,
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

  const simulationUrl = `https://dashboard.tenderly.co/codalabs/project/simulator/${resp.data.simulation.id}`

  if (resp.data.simulation.status === false) {
    console.error(`View simulation on Tenderly: ${simulationUrl}`, resp.data)

    throw new Error('Transaction is going to fail')
  }

  console.info(`View simulation on Tenderly: ${simulationUrl}`, resp.data)
}
