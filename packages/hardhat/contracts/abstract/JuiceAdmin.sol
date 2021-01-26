// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import {
    UniswapV2Router02
} from "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./../interfaces/IJuicer.sol";
import "./../interfaces/ITickets.sol";

abstract contract JuiceAdmin is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct BudgetConfigurationProposal {
        uint256 target;
        uint256 duration;
        IERC20 want;
        string brief;
        string link;
        uint256 bias;
        uint256 o;
        uint256 b;
        address bAddress;
    }

    /// @notice The Juicer contract that is being used.
    IJuicer public juicer;

    /// @dev The latest proposed Budget configuration.
    BudgetConfigurationProposal public proposedBudgetReconfiguration;

    /// @dev The deadline for approving the latest Budget configuration proposal.
    uint256 public proposalDeadline;

    /// @dev The router to use to execute swaps.
    UniswapV2Router02 public router;

    event WithdrawFees(IERC20 token, uint256 amount, address to);

    constructor(
        IJuicer _juicer,
        string memory _name,
        string memory _symbol,
        IERC20 _rewardToken,
        UniswapV2Router02 _router
    ) internal {
        _juicer.budgetStore().claimOwnership();
        _juicer.ticketStore().claimOwnership();
        appointJuicer(_juicer);
        setJuicer(_juicer);
        juicer.issueTickets(_name, _symbol, _rewardToken);
        router = _router;
    }

    /**
        @notice This allows the contract owner to collect funds from your Budget.
        @param _budgetId The ID of the Budget to collect funds from.
        @param _amount The amount to tap into.
        @param _beneficiary The address to tap funds into.
    */
    function tapBudget(
        uint256 _budgetId,
        uint256 _amount,
        address _beneficiary
    ) external onlyOwner {
        juicer.tapBudget(_budgetId, _amount, _beneficiary);
    }

    /**
        @notice This is how the tapper can propose a reconfiguration to this contract's Budget.
        @dev The proposed changes will have to be approved by the redeemer.
        @param _target The new Budget target amount.
        @param _duration The new duration of your Budget.
        @param _want The new token that your Budget wants.
        @param _brief A brief description about your Budget.
        @param _link A link to information about the Budget.
        @param _bias A number from 70-130 indicating how valuable a Budget is compared to the owners previous Budget,
        effectively creating a recency bias.
        If it's 100, each Budget will have equal weight.
        If the number is 130, each Budget will be treated as 1.3 times as valuable than the previous, meaning sustainers get twice as much redistribution shares.
        If it's 0.7, each Budget will be 0.7 times as valuable as the previous Budget's weight.
        @param _o The percentage of this Budget's surplus to allocate to the owner.
        @param _b The percentage of this Budget's surplus to allocate towards a beneficiary address. This can be another contract, or an end user address.
        An example would be a contract that allocates towards a specific purpose, such as Gitcoin grant matching.
        @param _bAddress The address of the beneficiary contract where a specified percentage is allocated.
        @return _budgetId The ID of the Budget that was reconfigured.
    */
    function proposeBudgetReconfiguration(
        uint256 _target,
        uint256 _duration,
        IERC20 _want,
        string calldata _brief,
        string calldata _link,
        uint256 _bias,
        uint256 _o,
        uint256 _b,
        address _bAddress
    ) external onlyOwner returns (uint256) {
        proposedBudgetReconfiguration.target = _target;
        proposedBudgetReconfiguration.duration = _duration;
        proposedBudgetReconfiguration.want = _want;
        proposedBudgetReconfiguration.brief = _brief;
        proposedBudgetReconfiguration.link = _link;
        proposedBudgetReconfiguration.bias = _bias;
        proposedBudgetReconfiguration.o = _o;
        proposedBudgetReconfiguration.b = _b;
        proposedBudgetReconfiguration.bAddress = _bAddress;
        proposalDeadline = block.timestamp.add(25920);
    }

    /** 
        @notice Allows the contract owner to approve a proposed Budget reconfiguration
        @dev The changes will take effect after your active Budget expires.
        You may way to override this to create new permissions around who gets to decide
        the new Budget parameters.
        @return _budgetId The ID of the reconfigured Budget.
    */
    function approveBudgetReconfiguration()
        external
        onlyOwner
        returns (uint256)
    {
        require(
            proposalDeadline > block.timestamp,
            "Admin::approveBudgetReconfiguration: NO_ACTIVE_PROPOSAL"
        );

        // Increse the allowance so that Fountain can transfer excess want tokens from this contract's wallet into a Budget.
        proposedBudgetReconfiguration.want.safeApprove(
            address(juicer),
            100000000000000E18
        );

        proposalDeadline = 0;

        return
            juicer.configureBudget(
                proposedBudgetReconfiguration.target,
                proposedBudgetReconfiguration.duration,
                proposedBudgetReconfiguration.want,
                proposedBudgetReconfiguration.brief,
                proposedBudgetReconfiguration.link,
                proposedBudgetReconfiguration.bias,
                proposedBudgetReconfiguration.o,
                proposedBudgetReconfiguration.b,
                proposedBudgetReconfiguration.bAddress
            );
    }

    /** 
      @notice Redeem tickets that have been transfered to this contract.
      @param _issuer The issuer who's tickets are being redeemed.
      @param _amount The amount being redeemed.
      @param _minRewardAmount The minimum amount of rewards tokens expected in return.
      @param _minSwappedAmount The minimum amount of this contract's latest `want` token that should be
             swapped to from the redeemed reward.
      @param _juicer The Juicer to redeem from.
    */
    function redeemTickets(
        address _issuer,
        uint256 _amount,
        uint256 _minRewardAmount,
        uint256 _minSwappedAmount,
        IJuicer _juicer
    ) external {
        IERC20 _rewardToken =
            _juicer.redeem(_issuer, _amount, _minRewardAmount, address(this));

        Budget.Data memory _budget =
            _juicer.budgetStore().getCurrentBudget(address(this));

        require(
            _rewardToken.approve(address(router), _amount),
            "MoneyPoolAdmin::redeemTickets: APPROVE_FAILED."
        );

        address[] memory path = new address[](2);
        path[0] = address(_rewardToken);
        path[1] = router.WETH();
        path[2] = address(_budget.want);
        uint256[] memory _amounts =
            router.swapExactTokensForTokens(
                _amount,
                _minSwappedAmount,
                path,
                address(this),
                block.timestamp
            );

        // Surplus goes back to the issuer.
        _juicer.payOwner(address(this), _amounts[2], _budget.want, _issuer);
    }

    function setJuicer(IJuicer _juicer) public onlyOwner {
        require(_juicer != IJuicer(0), "JuiceAdmin::setJuicer: ZERO_ADDRESS");
        juicer = _juicer;
    }

    function appointJuicer(IJuicer _juicer) public onlyOwner {
        ITicketStore _ticketStore = _juicer.ticketStore();
        IBudgetStore _budgetStore = _juicer.budgetStore();
        _ticketStore.grantRole_(
            _ticketStore.DEFAULT_ADMIN_ROLE_(),
            address(_juicer)
        );
        _budgetStore.grantRole_(
            _budgetStore.DEFAULT_ADMIN_ROLE_(),
            address(_juicer)
        );
        _juicer.setAdmin(address(this));
    }

    function deprecateJuicer(IJuicer _juicer) external onlyOwner {
        IBudgetStore _budgetStore = _juicer.budgetStore();
        ITicketStore _ticketStore = _juicer.ticketStore();
        _ticketStore.revokeRole_(
            _ticketStore.DEFAULT_ADMIN_ROLE_(),
            address(_juicer)
        );
        _budgetStore.revokeRole_(
            _budgetStore.DEFAULT_ADMIN_ROLE_(),
            address(_juicer)
        );
    }
}
