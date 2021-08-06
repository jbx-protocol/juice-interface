// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IDirectPaymentAddress.sol";
import "./interfaces/IDirectPaymentAddressProxy.sol";
import "./interfaces/ITicketBooth.sol";

/** 
  @notice
  A contract that can receive funds directly and forward them to a direct payment address.
*/
contract DirectPaymentAddressProxy is IDirectPaymentAddressProxy, Ownable {
    // --- public immutable stored properties --- //

    /// @notice The direct payment address to foward funds to.
    IDirectPaymentAddress public immutable override directPaymentAddress;

    /// @notice The ticket booth to use when transferring tickets held by this contract to a beneficiary.
    ITicketBooth public immutable override ticketBooth;

    /// @notice The ID of the project tickets should be redeemed for.
    uint256 public immutable override projectId;

    constructor(
        IDirectPaymentAddress _directPaymentAddress,
        ITicketBooth _ticketBooth,
        uint256 _projectId
    ) {
        directPaymentAddress = _directPaymentAddress;
        ticketBooth = _ticketBooth;
        projectId = _projectId;
    }

    // Receive funds and transfer them to the direct payment address.
    receive() external payable {
        payable(address(directPaymentAddress)).transfer(msg.value);

        emit ProxyForward(
            msg.sender,
            address(directPaymentAddress),
            msg.value
        );        
    }

    /** 
      @notice Transfers tickets held by this contract to a beneficiary.
      @param _beneficiary Address of the beneficiary tickets will be transferred to.
    */
    function transferTickets(address _beneficiary) external override onlyOwner {
        address from = address(this);
        uint256 amount = ticketBooth.stakedBalanceOf(from, projectId);

        ticketBooth.transfer(
            from,
            projectId,
            amount,
            _beneficiary
        );

        emit TransferTickets(
            from,
            owner(),
            _beneficiary,
            projectId,
            amount
        );            
    }

}