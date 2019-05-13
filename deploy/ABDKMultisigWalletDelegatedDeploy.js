/*
 * Deployment script for ABDK Multisig Wallet Smart Contract.
 * Copyright © 2017-2019 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

if (!web3.eth.contract ([{"inputs":[{"name":"_delegate","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"ownerIndex","type":"uint8"},{"indexed":true,"name":"oldOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnerChange","type":"event"}]).new (
  delegate,
  {from: web3.eth.accounts[0], data: "0x608060405260006101015534801561001657600080fd5b506040516020806101fd8339810180604052602081101561003657600080fd5b50513361004257600080fd5b61010480546001600160a01b03199081166001600160a01b038416179091556001805433921682178155600082815261010060208190526040808320805460ff199081168617909155610102805461ff001916909317168417909155519091907fd2788ca980f13f21037a6ee3d78579fe938e92275d840811c6979141b4d2209a908390a450610126806100d76000396000f3fe6080604052366075576040805134808252602082018381523693830184905233937f87de3cfd3de44d9b830a98f5554f3ff79f1fafd7b3579d113ce92d82d3def2a19360009260608201848480828437600083820152604051601f909101601f1916909201829003965090945050505050a260f8565b610104546040516000916060916001600160a01b0390911690839036908083838082843760405192019450600093509091505080830381855af49150503d806000811460dc576040519150601f19603f3d011682016040523d82523d6000602084013e60e1565b606091505b5090925090508160f057600080fd5b805160208201f35b00fea165627a7a7230582006581e83b7535232017d18d1aa4261d1b9e8ad21bc8cbd87236cfe86135772020029", gas: 1000000},
  function (e, r) {
    if (e) throw e;
    if (typeof r.address !== "undefined") {
      console.log (
        "Deployed at " + r.address + " (tx: " + r.transactionHash + ")");
    }
  }).transactionHash) {
  console.log ("Deployment failed.  Probably web3.eth.accounts[0] is locked.");
}
