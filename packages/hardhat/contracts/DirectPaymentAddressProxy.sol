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

    // Receive funds and hold them in the contract until they are ready to be transferred.
    receive() external payable { 
      // Do nothing.
    }

    // Transfers all funds held in the contract to the direct payment address.
    function tap() external override {
        uint256 amount = address(this).balance;

        payable(address(directPaymentAddress)).transfer(amount);

        emit ProxyTap(
            msg.sender,
            address(directPaymentAddress),
            amount
        );     
    }

    /** 
      @notice Transfers tickets held by this contract to a beneficiary.
      @param _beneficiary Address of the beneficiary tickets will be transferred to.
    */
    function transferTickets(address _beneficiary, uint256 _amount) external override onlyOwner {
        address from = address(this);

        ticketBooth.transfer(
            from,
            projectId,
            _amount,
            _beneficiary
        );

        emit ProxyTransferTickets(
            from,
            owner(),
            _beneficiary,
            projectId,
            _amount
        );            
    }

}