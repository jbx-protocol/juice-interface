pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./interfaces/IOperatorStore.sol";

contract Operators is IOperatorStore {
    /// @notice A mapping of the addresses that are designated operators of each account.
    mapping(address => mapping(address => bool)) public override isOperator;

    constructor() public {}

    /** 
      @notice Allows the specified operator tap funds and redeem tickets on the msg.sender's behalf.
      @param _operator The operator to give permission to.
    */
    function addOperator(address _operator) external override {
        isOperator[msg.sender][_operator] = true;
        emit AddOperator(msg.sender, _operator);
    }

    /** 
      @notice Revokes the ability for the specified operator to tap funds and redeem tickets on the msg.sender's behalf.
      @param _operator The operator to give permission to.
    */
    function removeOperator(address _account, address _operator)
        external
        override
    {
        // Revoke the operator if there's no msg.sender.
        if (_operator == address(0)) _operator = msg.sender;

        // Only an account or a specified operator can remove an operator. A specified operator can only remove themselves
        require(
            msg.sender == _account ||
                (isOperator[_account][msg.sender] && _operator == msg.sender),
            "Juicer::removeOperator: UNAUTHORIZED"
        );
        isOperator[_account][_operator] = false;
        emit RemoveOperator(_account, msg.sender, _operator);
    }
}
