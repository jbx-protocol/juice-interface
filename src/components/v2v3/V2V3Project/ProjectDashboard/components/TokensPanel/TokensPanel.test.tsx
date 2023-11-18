/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { useTokensPanel } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useTokensPanel'
import { TokensPanel } from './TokensPanel'

jest.mock(
  'components/v2v3/V2V3Project/ProjectDashboard/hooks/useYourBalanceMenuItems/useYourBalanceMenuItems',
  () => ({
    useYourBalanceMenuItems: jest.fn().mockReturnValue({
      items: [],
      redeemModalVisible: false,
      setRedeemModalVisible: jest.fn(),
      claimTokensModalVisible: false,
      setClaimTokensModalVisible: jest.fn(),
      mintModalVisible: false,
      setMintModalVisible: jest.fn(),
      transferUnclaimedTokensModalVisible: false,
      setTransferUnclaimedTokensModalVisible: jest.fn(),
    }),
  }),
)

jest.mock(
  'components/v2v3/V2V3Project/V2V3ManageTokensSection/AccountBalanceDescription/V2V3BurnOrRedeemModal',
  () => ({
    V2V3BurnOrRedeemModal: jest
      .fn()
      .mockImplementation(() => <div>V2V3BurnOrRedeemModal</div>),
  }),
)
jest.mock(
  'components/v2v3/V2V3Project/V2V3ManageTokensSection/AccountBalanceDescription/V2V3ClaimTokensModal',
  () => ({
    V2V3ClaimTokensModal: jest
      .fn()
      .mockImplementation(() => <div>V2V3ClaimTokensModal</div>),
  }),
)
jest.mock(
  'components/v2v3/V2V3Project/V2V3ManageTokensSection/AccountBalanceDescription/V2V3MintModal',
  () => ({
    V2V3MintModal: jest.fn().mockImplementation(() => <div>V2V3MintModal</div>),
  }),
)
jest.mock('./components/TransferUnclaimedTokensModalWrapper', () => ({
  TransferUnclaimedTokensModalWrapper: jest
    .fn()
    .mockImplementation(() => <div>TransferUnclaimedTokensModalWrapper</div>),
}))

jest.mock('components/v2v3/V2V3Project/ProjectDashboard/hooks/useTokensPanel')
jest.mock('./components/ReservedTokensSubPanel', () => ({
  ReservedTokensSubPanel: jest
    .fn()
    .mockImplementation(() => <div>ReservedTokensSubPanel</div>),
}))
jest.mock('components/EthereumAddress', () =>
  jest.fn().mockImplementation(() => <div>EthereumAddress</div>),
)
jest.mock('../TokenHoldersModal/TokenHoldersModal', () => ({
  TokenHoldersModal: jest
    .fn()
    .mockImplementation(() => <div>TokenHoldersModal</div>),
}))
jest.mock('./components/RedeemTokensButton', () => ({
  RedeemTokensButton: jest
    .fn()
    .mockImplementation(() => <div>RedeemTokensButton</div>),
}))

describe('TokensPanel', () => {
  const DefaultUseTokensPanelResult = {
    userTokenBalance: 0,
    userTokenBalanceLoading: false,
    projectToken: 'projectToken',
    projectTokenAddress: 'projectTokenAddress',
    totalSupply: 0,
  }
  beforeEach(() => {
    ;(useTokensPanel as jest.Mock).mockReturnValue(DefaultUseTokensPanelResult)
  })
  it('renders', () => {
    render(<TokensPanel />)
  })
  it('doesnt render Your balance card if userTokenBalanceLoading is true', () => {
    ;(useTokensPanel as jest.Mock).mockReturnValue({
      ...DefaultUseTokensPanelResult,
      userTokenBalanceLoading: true,
    })
    const { queryByText } = render(<TokensPanel />)
    expect(queryByText('Your balance')).toBeNull()
  })
  it('doesnt render Your balance card if userTokenBalance is undefined', () => {
    ;(useTokensPanel as jest.Mock).mockReturnValue({
      ...DefaultUseTokensPanelResult,
      userTokenBalance: undefined,
    })
    const { queryByText } = render(<TokensPanel />)
    expect(queryByText('Your balance')).toBeNull()
  })

  it('renders Your balance card if userTokenBalance is defined and userTokenBalanceLoading is false', () => {
    ;(useTokensPanel as jest.Mock).mockReturnValue({
      ...DefaultUseTokensPanelResult,
      userTokenBalance: 100,
    })
    const { getByText } = render(<TokensPanel />)
    expect(getByText('Your balance')).toBeInTheDocument()
  })
})
