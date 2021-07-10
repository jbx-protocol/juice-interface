// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./../interfaces/IOperatable.sol";

abstract contract Operatable is IOperatable {
    modifier requirePermission(
        address _account,
        uint256 _domain,
        uint256 _index
    ) {
        require(
            msg.sender == _account ||
                operatorStore.hasPermission(
                    msg.sender,
                    _account,
                    _domain,
                    _index
                ),
            "Operatable: UNAUTHORIZED"
        );
        _;
    }

    modifier requirePermissionAllowingWildcardDomain(
        address _account,
        uint256 _domain,
        uint256 _index
    ) {
        require(
            msg.sender == _account ||
                operatorStore.hasPermission(
                    msg.sender,
                    _account,
                    _domain,
                    _index
                ) ||
                operatorStore.hasPermission(msg.sender, _account, 0, _index),
            "Operatable: UNAUTHORIZED"
        );
        _;
    }

    modifier requirePermissionAcceptingAlternateAddress(
        address _account,
        uint256 _domain,
        uint256 _index,
        address _alternate
    ) {
        require(
            msg.sender == _account ||
                operatorStore.hasPermission(
                    msg.sender,
                    _account,
                    _domain,
                    _index
                ) ||
                msg.sender == _alternate,
            "Operatable: UNAUTHORIZED"
        );
        _;
    }

    /// @notice A contract storing operator assignments.
    IOperatorStore public immutable override operatorStore;

    /** 
      @param _operatorStore A contract storing operator assignments.
    */
    constructor(IOperatorStore _operatorStore) {
        operatorStore = _operatorStore;
    }
}
