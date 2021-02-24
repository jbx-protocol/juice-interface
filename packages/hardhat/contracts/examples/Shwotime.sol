// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../abstract/JuiceProject.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

/** 
  @dev 
  Shwotime allows friends to commit to buying tickets to events together.
  They can commit to buying a ticket if a specified list of addresses also commit to buy the ticket.

  Not reliable for situations where networks dont entirely overlap.
*/
contract Shwotime is JuiceProject {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct Tickets {
        address owner;
        uint256 max;
        uint256 sold;
        uint256 price;
        uint256 expiry;
        mapping(address => bool) committed;
        mapping(address => bool) paid;
        mapping(address => address[]) dependencies;
    }

    mapping(uint256 => Tickets) public tickets;

    uint256 public ticketsCount = 0;

    IERC20 public dai;

    uint256 public fee;

    constructor(
        string memory _ticketName,
        string memory _ticketSymbol,
        IERC20 _dai,
        uint256 _fee
    ) public JuiceProject(_ticketName, _ticketSymbol) {
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
        Tickets storage _tickets = tickets[ticketsCount];
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
        Tickets storage _tickets = tickets[id];

        require(
            _tickets.expiry > block.timestamp,
            "Shwotime::buyTickets: EXPIRED"
        );
        require(
            _tickets.max >= _tickets.sold,
            "Shwotime::buyTickets: SOLD_OUT"
        );

        bool _transferFundsFromMsgSender = true;
        for (uint256 i = 0; i < addresses.length; i++) {
            address _address = addresses[i];
            if (!_tickets.committed[_address])
                _transferFundsFromMsgSender = false;
            if (_tickets.paid[_address]) continue;
            // Nest once.
            bool _transferFundsFromDependency = true;
            for (
                uint256 j = 0;
                j < _tickets.dependencies[_address].length;
                j++
            ) {
                address _subAddress = _tickets.dependencies[_address][j];
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
    function collect(IJuicer _juicer, uint256 id) external {
        require(id > 0 && id <= ticketsCount, "Shwotime::collect: NOT_FOUND");

        Tickets storage _tickets = tickets[id];

        require(
            msg.sender == _tickets.owner,
            "Shwotime::collect: UNAUTHORIZED"
        );

        require(
            _tickets.expiry <= block.timestamp,
            "Shwotime::collect: TOO_SOON"
        );

        uint256 _total = _tickets.price.mul(_tickets.sold);
        uint256 _collectable = _total.mul(uint256(100).sub(fee)).div(100);
        dai.safeTransfer(msg.sender, _collectable);
        //Take your fee into Juice.
        takeFee(_juicer, _total.sub(_collectable), msg.sender);
    }
}
