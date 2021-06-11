// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./../interfaces/IOperatable.sol";

abstract contract Operatable is IOperatable {
    modifier requirePermission(
        address _account,
        uint256 _domain,
        uint256 _index,
        bool _alsoAllowOpenDomainOperator
    ) {
        require(
            msg.sender == _account ||
                operatorStore.hasPermission(
                    _account,
                    _domain,
                    msg.sender,
                    _index
                ) ||
                (_alsoAllowOpenDomainOperator &&
                    operatorStore.hasPermission(
                        _account,
                        0,
                        msg.sender,
                        _index
                    )),
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
