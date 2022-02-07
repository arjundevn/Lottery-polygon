const { expect } = require("chai");
const { ethers } = require("hardhat");

let lottery;
let owner;
let addr1;
let addr2;
let addrs;

before(async function () {
  const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy();
    await lottery.deployed();
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});


describe("Before Start of Lottery", function () {

  it("Owner address should be set", async function () {
    expect(await lottery.owner()).to.not.equal("0x0000000000000000000000000000000000000000");
  });

  it("Lottery status should not be active", async function () {
    expect(await lottery.lotteryisActive()).to.equal(false);
  });

  it("Start time of the lottery should not be set", async function () {
    expect(await lottery.startTime()).to.equal(0);
  });

  it("Stop time of the lottery should not be set", async function () {
    expect(await lottery.stopTime()).to.equal(0);
  });

  it("Tickets sold should be zero", async function () {
    expect(await lottery.totalTickets()).to.equal(0);
  });
});

describe("Start of Lottery", function () {
  
  it("Verify if only owner has activated the lottery", async function () {

    const newLotteryCall = await lottery.newLottery();
    await newLotteryCall.wait();
    expect(await lottery.lotteryisActive()).to.equal(true);
  });

  it("Lottery status should be active", async function () {
    expect(await lottery.lotteryisActive()).to.equal(true);
  });

  it("Start time of the lottery should get recorded", async function () {
    expect(await lottery.startTime()).to.not.equal(0);
  });

  it("Stop time of the lottery should get recorded", async function () {
    expect(await lottery.stopTime()).to.not.equal(0);
  });

  it("Duration of lottery should be 1 hour", async function () {
    expect(await lottery.stopTime()-await lottery.startTime()).to.equal(3600);
  });
});

describe("Buying ticket", function () {
  it("Ticket count should be incremented by 1", async function () {
    const ticketCounter= await lottery.totalTickets();
    const ticketBought = await lottery.buyTicket({ value: ethers.utils.parseEther("0.1") });
    await ticketBought.wait();
    expect(await lottery.totalTickets()-1).to.equal(ticketCounter);
  });

  it("0.1 ether should be transfered to the contract on ticket purchase", async function () {
    const balance = await ethers.provider.getBalance(lottery.address);
    const ticketBought = await lottery.buyTicket({ value: ethers.utils.parseEther("0.1") });
    await ticketBought.wait();
    expect(Number(await ethers.provider.getBalance(lottery.address))).to.equal(Number(balance*2));
  });
});

describe("End of lottery round (After 1 hr in prod)", function () {
  it("Verify if only owner has deactivated the lottery", async function () {
    const endLotteryCall = await lottery.endLottery();
    await endLotteryCall.wait();

    expect(await lottery.lotteryisActive()).to.equal(false);
  });
  
  it("Lottery status should be deactivated", async function () {
    expect(await lottery.lotteryisActive()).to.equal(false);
  });

  it("Start time should get resetted to zero", async function () {
    expect(await lottery.startTime()).to.equal(0);
  });

  it("Stop time should get resetted to zero", async function () {
    expect(await lottery.stopTime()).to.equal(0);
  });

  it("Amount disbursed to winner", async function () {
    const balanceofContract = await ethers.provider.getBalance(lottery.address);
    expect(balanceofContract).to.not.equal(0);
    // console.log(await ethers.getSigners()[0])
    // const balanceofContrac = await ethers.provider.getBalance(ethers.signers.getAddress(), blockTag = "latest");
    // // const balanceofWinner = await ethers.signer.getBalance(owner.address);
    // console.log(balanceofContrac)
    const amountDisbursal = await lottery.disburseAmountToWinner();
    await amountDisbursal.wait();
    expect(await ethers.provider.getBalance(lottery.address)).to.equal(0);
    console.log(balanceofContract);
  });
});
