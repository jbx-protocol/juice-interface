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
    mapping(uint256 => IProxyPaymentAddress[]) private _proxyPaymentAddressesOf;

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
    function proxyPaymentAddressesOf(uint256 _projectId)
        external
        view
        override
        returns (IProxyPaymentAddress[] memory)
    {
        return _proxyPaymentAddressesOf[_projectId];
    }    

    /** 
      @notice Deploys a proxy payment address.
      @param _projectId ID of the project funds will be fowarded to.
      @param _memo Memo that will be attached withdrawal transactions.
    */
    function deployProxyPaymentAddress(uint256 _projectId, string memory _memo) external override {
        require(
            _projectId > 0,
            "ProxyPaymentAddressManager::deployProxyPaymentAddress: ZERO_PROJECT"
        );

        ProxyPaymentAddress proxyPaymentAddress =  new ProxyPaymentAddress(
            terminalDirectory,
            ticketBooth,
            _projectId,
            _memo
        );

        proxyPaymentAddress.transferOwnership(msg.sender);

        // Deploy the contract and push it to the list.
        _proxyPaymentAddressesOf[_projectId].push(proxyPaymentAddress);

        emit DeployProxyPaymentAddress(_projectId, _memo, msg.sender);
    }

}