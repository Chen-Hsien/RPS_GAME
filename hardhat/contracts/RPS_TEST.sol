// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RPS_TEST is ReentrancyGuard {
    enum Hand {
        Rock,
        Paper,
        Scissors
    }
    enum Result {
        Win,
        Lose,
        Draw
    }

    event GamePlayed(
        uint256 gameid,
        address indexed user_address,
        Hand computer_pose,
        Hand user_pose,
        Result result
    );

    // modifier to check if the caller is the owner of the contract
    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Caller is not the owner");
        _;
    }

    // Contract onwer
    address public contractOwner;

    // Minimum bet amount 50000000000000000 wei
    uint256 public constant MIN_BET = 0.05 ether;
    uint256 private gameid = 0;

    // Testing Variable
    Hand public testComputerHand = Hand.Rock;

    constructor(address _owner) {
        contractOwner = _owner;
    }

    // This function allows a player to play the game
    function play(Hand _playerHand) external payable {
        require(msg.value == MIN_BET, "Bet needs to be 0.05 ETH.");

        // Hand computerHand = generateComputerHand();
        // Testing
        Hand computerHand = testComputerHand;
        Result result = determineWinner(_playerHand, computerHand);

        if (result == Result.Win || result == Result.Draw) {
            payable(msg.sender).transfer(msg.value);
        }

        emit GamePlayed(gameid, msg.sender, computerHand, _playerHand, result);
        gameid++;
    }

    // Internal function to randomly generate the computer's hand
    function generateComputerHand() internal view returns (Hand) {
        uint256 random = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        ) % 3;
        return Hand(random);
    }

    // Internal function to determine the winner of the game
    function determineWinner(
        Hand _playerHand,
        Hand _computerHand
    ) internal pure returns (Result) {
        if (_playerHand == _computerHand) {
            return Result.Draw;
        }

        if (
            (_playerHand == Hand.Rock && _computerHand == Hand.Scissors) ||
            (_playerHand == Hand.Paper && _computerHand == Hand.Rock) ||
            (_playerHand == Hand.Scissors && _computerHand == Hand.Paper)
        ) {
            return Result.Win;
        }

        return Result.Lose;
    }

    function withdraw() public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available to withdraw.");
        payable(msg.sender).transfer(balance);
    }
}
