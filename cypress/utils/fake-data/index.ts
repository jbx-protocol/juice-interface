import {
  fakeGetTransactionByHashResponse,
  fakeSendTransactionResponse,
} from './fake-transaction'

export const FakeData = {
  Provider: {
    GetTransactionByHash: fakeGetTransactionByHashResponse,
    SendTransaction: fakeSendTransactionResponse,
    BlockNumber: '0x1',
  },
}
