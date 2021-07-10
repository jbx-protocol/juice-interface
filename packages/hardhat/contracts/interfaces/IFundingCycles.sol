// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./IPrices.sol";
import "./IProjects.sol";
import "./IFundingCycleBallot.sol";

/// @notice The funding cycle structure represents a project stewarded by an address, and accounts for which addresses have helped sustain the project.
struct FundingCycle {
    // A unique number that's incremented for each new funding cycle, starting with 1.
    uint256 id;
    // The ID of the project contract that this funding cycle belongs to.
    uint256 projectId;
    // The number of this funding cycle for the project.
    uint256 number;
    // The ID of a previous funding cycle that this one is based on.
    uint256 basedOn;
    // The time when this funding cycle was last configured.
    uint256 configured;
    // The number of cycles that this configuration should last for before going back to the last permanent.
    uint256 cycleLimit;
    // A number determining the amount of redistribution shares this funding cycle will issue to each sustainer.
    uint256 weight;
    // The ballot contract to use to determine a subsequent funding cycle's reconfiguration status.
    IFundingCycleBallot ballot;
    // The time when this funding cycle will become active.
    uint256 start;
    // The number of seconds until this funding cycle's surplus is redistributed.
    uint256 duration;
    // The amount that this funding cycle is targeting in terms of the currency.
    uint256 target;
    // The currency that the target is measured in.
    uint256 currency;
    // The percentage of each payment to send as a fee to the Juicebox admin.
    uint256 fee;
    // A percentage indicating how much more weight to give a funding cycle compared to its predecessor.
    uint256 discountRate;
    // The amount of available funds that have been tapped by the project in terms of the currency.
    uint256 tapped;
    // A packed list of extra data. The first 8 bytes are reserved for versioning.
    uint256 metadata;
}

struct FundingCycleProperties {
    uint256 target;
    uint256 currency;
    uint256 duration;
    uint256 cycleLimit;
    uint256 discountRate;
    IFundingCycleBallot ballot;
}

interface IFundingCycles {
    event Configure(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        uint256 reconfigured,
        FundingCycleProperties _properties,
        uint256 metadata,
        address caller
    );

    event Tap(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        uint256 amount,
        uint256 newTappedAmount,
        address caller
    );

    event Init(
        uint256 indexed fundingCycleId,
        uint256 indexed projectId,
        uint256 number,
        uint256 previous,
        uint256 weight,
        uint256 start
    );

    function latestIdOf(uint256 _projectId) external view returns (uint256);

    function count() external view returns (uint256);

    function BASE_WEIGHT() external view returns (uint256);

    function MAX_CYCLE_LIMIT() external view returns (uint256);

    function get(uint256 _fundingCycleId)
        external
        view
        returns (FundingCycle memory);

    function queuedOf(uint256 _projectId)
        external
        view
        returns (FundingCycle memory);

    function currentOf(uint256 _projectId)
        external
        view
        returns (FundingCycle memory);

    function currentBallotStateOf(uint256 _projectId)
        external
        view
        returns (BallotState);

    function configure(
        uint256 _projectId,
        FundingCycleProperties calldata _properties,
        uint256 _metadata,
        uint256 _fee,
        bool _configureActiveFundingCycle
    ) external returns (FundingCycle memory fundingCycle);

    function tap(uint256 _projectId, uint256 _amount)
        external
        returns (FundingCycle memory fundingCycle);
}
