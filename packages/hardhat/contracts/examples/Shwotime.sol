// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@paulrberg/contracts/math/PRBMath.sol";

import "../abstract/JuiceboxProject.sol";

/** 
  @dev 
  Shwotime allows friends to commit to buying tickets to events together.
  They can commit to buying a ticket if a specified list of addresses also commit to buy the ticket.

  Not reliable for situations where networks dont entirely overlap.
*/
contract Shwotime is JuiceboxProject {
    using SafeERC20 for IERC20;

    struct Tix {
        address owner;
        uint256 max;
        uint256 sold;
        uint256 price;
        uint256 expiry;
        mapping(address => bool) committed;
        mapping(address => bool) paid;
        mapping(address => address[]) dependencies;
    }

    mapping(uint256 => Tix) public tickets;

    uint256 public ticketsCount = 0;

    IERC20 public dai;

    uint256 public fee;

    constructor(
        uint256 _projectId,
        ITerminalDirectory _terminalDirectory,
        IERC20 _dai,
        uint256 _fee
    ) JuiceboxProject(_projectId, _terminalDirectory) {
        dai = _dai;
        fee = _fee;
    }

    // Create tickets to sell.
    function createTickets(
        uint256 _price,
        uint256 _max,
        uint256 _expiry
    ) external {
        //Store the new ticket.
        ticketsCount++;
        Tix storage _tickets = tickets[ticketsCount];
        _tickets.price = _price;
        _tickets.max = _max;
        _tickets.sold = 0;
        _tickets.expiry = _expiry;
        _tickets.owner = msg.sender;
    }

    // commits to buying a ticket if the specified addresses also buy.
    function buyTicket(uint256 id, address[] calldata addresses) external {
        require(
            id > 0 && id <= ticketsCount,
            "Shwotime::buyTickets: NOT_FOUND"
        );

        //Mark the msg.sender as committed to buying.
        Tix storage _tickets = tickets[id];

        require(
            _tickets.expiry > block.timestamp,
            "Shwotime::buyTickets: EXPIRED"
        );
        require(
            _tickets.max >= _tickets.sold,
            "Shwotime::buyTickets: SOLD_OUT"
        );

        bool _transferFundsFromMsgSender = true;
        for (uint256 _i = 0; _i < addresses.length; _i++) {
            address _address = addresses[_i];
            if (!_tickets.committed[_address])
                _transferFundsFromMsgSender = false;
            if (_tickets.paid[_address]) continue;
            // Nest once.
            bool _transferFundsFromDependency = true;
            for (
                uint256 _j = 0;
                _j < _tickets.dependencies[_address].length;
                _j++
            ) {
                address _subAddress = _tickets.dependencies[_address][_j];
                if (
                    _subAddress != msg.sender &&
                    !_tickets.committed[_subAddress]
                ) _transferFundsFromDependency = false;
            }
            if (_transferFundsFromDependency) {
                // Transfer money from the committed buyer to this contract.
                dai.safeTransferFrom(_address, address(this), _tickets.price);
                _tickets.paid[_address] = true;
                _tickets.sold++;
            }
        }
        if (_transferFundsFromMsgSender) {
            // Transfer money from the msg sender to this contract.
            dai.safeTransferFrom(msg.sender, address(this), _tickets.price);
            //save the fact that msg.sender owes
            _tickets.paid[msg.sender] = true;
            _tickets.sold++;
        }

        // Check to see if its sold out once everyone has been given tickets.
        require(
            _tickets.max >= _tickets.sold,
            "Shwotime::buyTickets: SOLD_OUT"
        );

        _tickets.committed[msg.sender] = true;
    }

    //Allow a ticket owner to collect funds once the tickets expire.
    function collect(uint256 _id, string calldata _memo) external {
        require(_id > 0 && _id <= ticketsCount, "Shwotime::collect: NOT_FOUND");

        Tix storage _tickets = tickets[_id];

        require(
            msg.sender == _tickets.owner,
            "Shwotime::collect: UNAUTHORIZED"
        );

        require(
            _tickets.expiry <= block.timestamp,
            "Shwotime::collect: TOO_SOON"
        );

        uint256 _total = _tickets.price * _tickets.sold;
        uint256 _collectable = PRBMath.mulDiv(_total, 200 - fee, 200);
        dai.safeTransfer(msg.sender, _collectable);
        //Take your fee into Juicebox.
        _takeFee(_total - _collectable, msg.sender, _memo, false);
    }
}
