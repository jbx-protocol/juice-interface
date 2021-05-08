// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./../interfaces/IJuicer.sol";

/** 
  @notice A contract that inherits from JuiceProject can use Juice as a business-model-as-a-service.
  @dev The owner of the contract makes admin decisions such as:
    - Which address is the funding cycle owner, which can tap funds from the funding cycle.
    - Should this project's Tickets be migrated to a new Juicer. 
*/
abstract contract JuiceProject is IERC721Receiver, Ownable {
    using SafeMath for uint256;

    modifier onlyPm {
        require(msg.sender == pm, "JuiceProject: UNAUTHORIZED");
        _;
    }

    struct Mod {
        uint256 id;
        uint256 percent;
        address payable beneficiary;
    }

    /// @dev The ID of the project that is being managed.
    uint256 public projectId;

    /// @dev The address that can tap funds from the project and propose reconfigurations.
    address public pm;

    /// @dev The juicer that manages this project.
    IJuicer public juicer;

    Mod[] public mods;
    uint256 public modsId = 0;

    /** 
      @param _juicer The juicer that manages this project.
      @param _pm The project manager address that can tap funds and propose reconfigurations.
    */
    constructor(IJuicer _juicer, address _pm) {
        juicer = _juicer;
        pm = _pm;
    }

    /** 
      @notice Allows the project that is being managed to be set.
      @param _projectId The ID of the project that is being managed.
    */
    function setProjectId(uint256 _projectId) external {
        // The pm or the owner can set the project.
        require(
            msg.sender == pm || msg.sender == owner(),
            "JuiceProject: UNAUTHORIZED"
        );
        projectId = _projectId;
    }

    /**
        @notice This is how the funding cycle is configured, and reconfiguration over time.
        @param _target The new funding cycle target amount.
        @param _currency The currency of the target.
        @param _duration The new duration of your funding cycle.
        @param _discountRate A number from 0-1000 indicating how valuable a funding cycle is compared to the owners previous funding cycle,
        effectively creating a recency discountRate.
        If it's 100, each funding cycle will have equal weight.
        If the number is 130, each funding cycle will be treated as 1.3 times as valuable than the previous, meaning sustainers get twice as much redistribution shares.
        If it's 0.7, each funding cycle will be 0.7 times as valuable as the previous funding cycle's weight.
        @param _data the _discountRate, _bondingCurveRate, and _reservedRate are uint16s packed together in order.
        @dev _bondingCurveRate The rate from 0-1000 at which a project's Tickets can be redeemed for surplus.
        If its 500, tickets redeemed today are woth 50% of their proportional amount, meaning if there are 100 total tickets and $40 claimable, 10 tickets can be redeemed for $2.
        @dev _reservedRate The number from 0-1000 of this funding cycle's surplus to allocate to the owner.
        @param _ballot The new ballot that will be used to approve subsequent reconfigurations.
        @return fundingCycleId The ID of the funding cycle that was reconfigured.
    */
    function configure(
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        FundingCycleMetadata memory _data,
        IFundingCycleBallot _ballot
    ) external returns (uint256 fundingCycleId) {
        // The pm or the owner can propose configurations.
        require(
            msg.sender == pm || msg.sender == owner(),
            "JuiceProject: UNAUTHORIZED"
        );

        fundingCycleId = juicer.reconfigure(
            projectId,
            _target,
            _currency,
            _duration,
            _discountRate,
            _data,
            _ballot
        );
    }

    /**
      @notice Allows the PM to set the project's name, link, logo, and handle.
      @param _name The new name for the project.
      @param _handle The new unique handle for the project.
      @param _logoUri The new uri to an image representing the project.
      @param _link A link to more info about the project.
    */
    function setInfo(
        string memory _name,
        string memory _handle,
        string memory _logoUri,
        string memory _link
    ) external onlyPm {
        juicer.projects().setInfo(projectId, _name, _handle, _logoUri, _link);
    }

    /** 
      @notice Redeem tickets that have been transfered to this contract and use the claimed amount to fund this project.
      @param _account The account to redeem tickets for.
      @param _projectId The ID of the project who's tickets are being redeemed.
      @param _amount The amount of tickets being redeemed.
      @param _minReturnedETH The minimum amount of ETH expected in return.
      @param _note A note to leave on the emitted event.
      @return returnAmount The amount of ETH that was redeemed and used to fund the funding cycle.
    */
    function redeemTicketsAndFund(
        address _account,
        uint256 _projectId,
        uint256 _amount,
        uint256 _minReturnedETH,
        string memory _note
    ) external onlyPm returns (uint256 returnAmount) {
        require(
            projectId != 0,
            "JuiceProject::redeemTicketsAndFund: PROJECT_NOT_FOUND"
        );
        returnAmount = juicer.redeem(
            _account,
            _projectId,
            _amount,
            _minReturnedETH,
            address(this)
        );

        // Tickets come back to this project.
        juicer.pay{value: returnAmount}(projectId, address(this), _note);
    }

    receive() external payable {}

    /** 
      @notice Redeem tickets that have been transfered to this contract.
      @param _account The account to redeem tickets for.
      @param _projectId The ID of the project who's tickets are being redeemed.
      @param _amount The amount of tickets being redeemed.
      @param _beneficiary The address that is receiving the redeemed tokens.
      @param _minReturnedETH The minimum amount of ETH expected in return.
      @return _returnAmount The amount of ETH that was redeemed.
    */
    function redeemTickets(
        address _account,
        uint256 _projectId,
        uint256 _amount,
        address payable _beneficiary,
        uint256 _minReturnedETH
    ) external onlyPm returns (uint256 _returnAmount) {
        _returnAmount = juicer.redeem(
            _account,
            _projectId,
            _amount,
            _minReturnedETH,
            _beneficiary
        );
    }

    /** 
      @notice Taps the funds available.
      @param _amount The amount to tap.
      @param _currency The currency to tap.
      @param _beneficiary The address to transfer the funds to.
      @param _minReturnedETH The minimum number of Eth that the amount should be valued at.
    */
    function tap(
        uint256 _amount,
        uint256 _currency,
        address payable _beneficiary,
        uint256 _minReturnedETH
    ) external onlyPm {
        uint256 _modsCut = 0;
        uint256 _modsMinReturnedETH = 0;
        for (uint256 _i = 0; _i < mods.length; _i++) {
            // The amount to send towards mods.
            uint256 _modCut = FullMath.mulDiv(_amount, mods[_i].percent, 1000);
            // The minimum amount of ETH to send towards insurance.
            uint256 _modMinReturnedETH =
                FullMath.mulDiv(_minReturnedETH, mods[_i].percent, 1000);
            juicer.tap(
                projectId,
                _modCut,
                _currency,
                mods[_i].beneficiary,
                _modMinReturnedETH
            );
            _modsCut = _modsCut.add(_modCut);
            _modsMinReturnedETH = _modsMinReturnedETH.add(_modMinReturnedETH);
        }
        // Tap the funding cycle for the beneficiary.
        juicer.tap(
            projectId,
            _amount.sub(_modsCut),
            _currency,
            _beneficiary,
            _minReturnedETH.sub(_modsMinReturnedETH)
        );
    }

    /** 
        @notice Sets the address that can tap the funding cycle. 
        @param _pm The new project manager.
    */
    function setPm(address _pm) external onlyOwner {
        require(_pm != address(0), "JuiceProject::setPm: ZERO_ADDRESS");
        pm = _pm;
    }

    /** 
        @notice Transfer the ownership of the project to a new owner.  
        @dev This contract will no longer be able to reconfigure or tap funds from this project.
        @param _newOwner The new project owner.
    */
    function transferProjectOwnership(address _newOwner) external onlyOwner {
        juicer.projects().safeTransferFrom(address(this), _newOwner, projectId);
    }

    /**
      @notice Migrates the ability to mint and redeem this contract's Tickets to a new Juicer.
      @dev The destination must be in the current Juicer's allow list.
      @param _from The contract that currently manages your Tickets and it's funds.
      @param _to The new contract that will manage your Tickets and it's funds.
    */
    function migrate(IJuicer _from, IJuicer _to) public onlyOwner {
        require(_to != IJuicer(0), "JuiceProject::migrate: ZERO_ADDRESS");
        require(_from == juicer, "JuiceProject::migrate: INVALID");
        require(projectId != 0, "JuiceProject::migrate: PROJECT_NOT_FOUND");

        // Migrate.
        _from.migrate(projectId, _to);

        // Set the new juicer.
        juicer = _to;
    }

    /** 
      @notice Take a fee for this project.
      @param _amount The amount of the fee.
      @param _from The address who will receive tickets from this fee.
      @param _note A note that will be included in the published event.
    */
    function takeFee(
        uint256 _amount,
        address _from,
        string memory _note
    ) internal {
        require(projectId != 0, "JuiceProject::takeFee: PROJECT_NOT_FOUND");
        juicer.pay{value: _amount}(projectId, _from, _note);
    }

    /** 
      @notice Adds a mod to the list.
      @param _beneficiary The address being funded from your tapped amount.
      @param _percent The percent of your target amount to send to the beneficiary of this mod. Out of 1000.
    */
    function addMod(address payable _beneficiary, uint256 _percent)
        external
        onlyPm
    {
        modsId++;
        mods.push(Mod(modsId, _percent, _beneficiary));
    }

    /** 
      @notice Removes a mod from the list.
      @param _id The id of the mod to remove.
    */
    function removeMod(uint256 _id) external onlyPm {
        Mod[] memory _mods = mods;
        delete mods;
        for (uint256 _i = 0; _i < _mods.length; _i++) {
            if (_mods[_i].id != _id) mods.push(_mods[_i]);
        }
    }

    /** 
      @notice Allows this contract to receive a project.
    */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
