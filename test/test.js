const { expect } = require("chai");
const { ethers } = require("hardhat");

let greeter;
let owner;
let addr1;
let addr2;
let addrs;

before(async function () {
  const Greeter = await ethers.getContractFactory("Greeter");
    greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("Lottery", function () {
  it("Sample test 2", async function () {
    let ownerAddress= await greeter.address;
    console.log(ownerAddress)
    let result = await greeter.lotteryisActive();
    console.log(result);
    console.log(addr1.address)
    let result2 = await greeter.connect(addr1.address).lotteryisActive();
    console.log(result2);
    console.log(addr2.address)
  });
});