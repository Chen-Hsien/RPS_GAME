const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("RPS Contract", function () {
  let RPS;
  let rps;
  let owner, addr1, addr2;

  beforeEach(async function () {
    RPS = await ethers.getContractFactory("RPS");
    [owner, addr1, addr2] = await ethers.getSigners();
    rps = await RPS.deploy(owner.address);
    console.log("RPS deployed to:", rps.target);
    // random words testing contract
    RPS_randomNumber_test = await ethers.getContractFactory("RPS_TEST");
    RPS_randomNumber_test = await RPS_randomNumber_test.deploy(owner.address);
  });

  describe("Deployment", function () {
    it("should set the right owner", async function () {
      expect(await rps.contractOwner()).to.equal(owner.address);
    });
  });

  describe("Play Game", function () {
    it("should allow a player to play when bet is correct", async function () {
      const tx = await rps
        .connect(addr1)
        .play(0, { value: ethers.parseEther("0.05") });
      await expect(
        rps.connect(addr1).play(0, { value: ethers.parseEther("0.05") })
      )
        .to.emit(rps, "GamePlayed")
        .withArgs(1, addr1, anyValue, 0, anyValue);
    });

    it("should fail when the bet amount is incorrect", async function () {
      await expect(
        rps.connect(addr1).play(0, { value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("Bet needs to be 0.05 ETH.");
    });

    it("should return funds on a win", async function () {
      // Mock the randomness to force a draw
      const tx = await RPS_randomNumber_test.connect(addr1).play(1, {
        value: ethers.parseEther("0.05"),
      });
      await expect(() => tx).to.changeEtherBalance(
        addr1,
        ethers.parseEther("0")
      );
    });

    it("should return funds on a draw", async function () {
      // Mock the randomness to force a draw
      const tx = await RPS_randomNumber_test.connect(addr1).play(0, {
        value: ethers.parseEther("0.05"),
      });
      await expect(() => tx).to.changeEtherBalance(
        addr1,
        ethers.parseEther("0")
      );
    });

    it("should take funds on a loss", async function () {
      const tx = await RPS_randomNumber_test.connect(addr1).play(2, {
        value: ethers.parseEther("0.05"),
      });
      await expect(() => tx).to.changeEtherBalance(
        RPS_randomNumber_test,
        ethers.parseEther("0.05")
      );
    });
  });
  describe("Withdraw", function () {
    it("should revert if the contract has no funds", async function () {
      await expect(rps.connect(owner).withdraw()).to.be.revertedWith(
        "No funds available to withdraw."
      );
    });

    it("should allow the owner to withdraw funds", async function () {
      const value = ethers.parseEther("0.05");

      // lose funds to the contract
      await RPS_randomNumber_test.connect(addr1).play(2, {
        value: value,
      });

      // Check the contract's balance
      const contractBalanceBefore = await ethers.provider.getBalance(
        RPS_randomNumber_test.target
      );
      expect(contractBalanceBefore).to.equal(value);

      // Withdraw funds as the owner
      const withdrawTx = await RPS_randomNumber_test.connect(owner).withdraw();
      await withdrawTx.wait();

      // Check the contract's balance after withdrawal
      const contractBalanceAfter = await ethers.provider.getBalance(
        RPS_randomNumber_test.target
      );
      expect(contractBalanceAfter).to.equal(0);

      // Check the owner's balance
      const ownerBalanceAfter = await owner.provider.getBalance(owner.address);
      expect(ownerBalanceAfter).to.be.gt(value); // Owner's balance should have increased
    });

    it("should not allow non-owners to withdraw funds", async function () {
      const value = ethers.parseEther("0.05");

      // lose funds to the contract
      await RPS_randomNumber_test.connect(addr1).play(2, {
        value: value,
      });

      // Try to withdraw as a non-owner be revert with custom error
      await expect(rps.connect(addr1).withdraw()).to.be.revertedWith(
        "Caller is not the owner"
      );
    });
  });
});
