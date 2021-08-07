// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./interfaces/ITicketBooth.sol";
import "./interfaces/ITerminalDirectory.sol";
import "./interfaces/IProxyPaymentAddress.sol";
import "./interfaces/IProxyPaymentAddressManager.sol";

import "./ProxyPaymentAddress.sol";

/** 
  @notice
  Manages deploying proxy payment addresses for Juicebox projects.
*/
contract ProxyPaymentAddressManager is IProxyPaymentAddressManager {
    // --- private stored properties --- //

    // A mapping from project id to proxy payment addresses.
    mapping(uint256 => IProxyPaymentAddress[]) private _addressesOf;

    // --- public immutable stored properties --- //

    /// @notice The directory that will be injected into proxy payment addresses.
    ITerminalDirectory public immutable override terminalDirectory;

    /// @notice The ticket boot that will be injected into proxy payment addresses.
    ITicketBooth public immutable override ticketBooth;

    constructor(
        ITerminalDirectory _terminalDirectory,
        ITicketBooth _ticketBooth
    ) {
        terminalDirectory = _terminalDirectory;
        ticketBooth = _ticketBooth;
    }

    /** 
      @notice 
      A list of all proxy payment addresses for the specified project ID.

      @param _projectId The ID of the project to get proxy payment addresses for.

      @return A list of proxy payment addresses for the specified project ID.
    */
    function addressesOf(uint256 _projectId)
        external
        view
        override
        returns (IProxyPaymentAddress[] memory)
    {
        return _addressesOf[_projectId];
    }    

    /** 
      @notice Deploys a proxy payment address.
      @param _projectId ID of the project funds will be fowarded to.
      @param _memo Memo that will be attached withdrawal transactions.
    */
    function deploy(uint256 _projectId, string memory _memo) external override returns(address) {
        require(
            _projectId > 0,
            "ProxyPaymentAddressManager::deploy: ZERO_PROJECT"
        );

        // Create the proxy payment address contract.
        ProxyPaymentAddress proxyPaymentAddress = new ProxyPaymentAddress(
            terminalDirectory,
            ticketBooth,
            _projectId,
            _memo
        );

        // Transfer ownership to the caller of this tx.
        proxyPaymentAddress.transferOwnership(msg.sender);

        // Push it to the list for the corresponding project.
        _addressesOf[_projectId].push(proxyPaymentAddress);

        emit Deploy(_projectId, _memo, msg.sender);

        // Return the address of the proxy payment address.
        return address(proxyPaymentAddress);
    }

}