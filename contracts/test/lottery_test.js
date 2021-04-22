const lotteryTest = artifacts.require("Lottery");
const web3 = require('web3');
const BigNumber = web3.utils.BN;

/*
* uncomment accounts to access the test accounts made available by the
* Ethereum client
* See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
*/

let lottery

contract("lotteryTest", function (accounts) {
  beforeEach(async () => {
    lottery = await lotteryTest.new();
    console.log(lottery);
  })

  it("should assert true", async function () {
    await lotteryTest.deployed();
    return assert.isTrue(true);
  });

  it("get manager lottery", async function () {
    const manager = lottery.manager().call();
  });

  it("entry lottrey", async function () {
    await lottery.enterLottery({
      from: accounts[0],
      value: web3.utils.toWei( '0.1', 'ether'),
    });
  });

  it("get winner lottery", async function(){
    await lottery.pickWinner({
      from: accounts[0],
    })
  })

});
