/*
 * Deployment script for ABDK Multisig Wallet Smart Contract.
 * Copyright © 2017-2019 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

if (!web3.eth.contract ([{"constant":false,"inputs":[{"name":"_ownerIndex","type":"uint8"},{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"suggest","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"_salt","type":"uint256"}],"name":"checkHash","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"suggestRevealAndApprove","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_byteCode","type":"bytes"},{"name":"_salt","type":"bytes32"}],"name":"createSmartContract2","outputs":[{"name":"_contractAddress","type":"address"},{"name":"_returnedData","type":"bytes"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"_salt","type":"uint256"}],"name":"execute","outputs":[{"name":"_status","type":"bool"},{"name":"_returnedData","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"suggestAndReveal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"suggestApproveAndExecute","outputs":[{"name":"_status","type":"bool"},{"name":"_returnedData","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"_salt","type":"uint256"}],"name":"approveAndExecute","outputs":[{"name":"_status","type":"bool"},{"name":"_returnedData","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"isApproved","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"suggestAndApprove","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"hashOf","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint8"}],"name":"getOwnerAt","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_approvalsRequired","type":"uint8"}],"name":"setApprovalsRequired","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"cancelSuggestion","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"_salt","type":"uint256"}],"name":"calculateHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"approvalsCount","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"revokeApproval","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ownersCount","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"_salt","type":"uint256"}],"name":"reveal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"},{"name":"_owner","type":"address"}],"name":"isApprovedBy","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_byteCode","type":"bytes"}],"name":"createSmartContract","outputs":[{"name":"_contractAddress","type":"address"},{"name":"_returnedData","type":"bytes"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"approvalsRequired","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"uint256"},{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"hash","type":"bytes32"}],"name":"Suggestion","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"uint256"},{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"},{"indexed":false,"name":"salt","type":"uint256"}],"name":"Revelation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"uint256"},{"indexed":true,"name":"owner","type":"address"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"uint256"},{"indexed":true,"name":"owner","type":"address"}],"name":"ApprovalRevocation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"uint256"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"returnedData","type":"bytes"}],"name":"Execution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"contractAddress","type":"address"},{"indexed":false,"name":"returnedData","type":"bytes"}],"name":"SmartContractCreation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"ownerIndex","type":"uint8"},{"indexed":true,"name":"oldOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnerChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newApprovalsRequired","type":"uint8"}],"name":"ApprovalsRequiredChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"uint256"}],"name":"SuggestionCancellation","type":"event"}]).new (
  {from: web3.eth.accounts[0], data: "0x608060405260006101015534801561001657600080fd5b503361002157600080fd5b600180546001600160a01b031916339081178255600081815261010060208190526040808320805460ff199081168717909155610102805461ff00191690931716851790915551919290917fd2788ca980f13f21037a6ee3d78579fe938e92275d840811c6979141b4d2209a908390a4611863806100a06000396000f3fe60806040526004361061014b5760003560e01c8063a0a3621e116100b6578063b759f9541161006f578063b759f95414610acc578063b948854614610af6578063c4f1195814610b0b578063c87f3a2e14610bda578063e9d12e8214610c13578063ea1d59c914610cb75761014b565b8063a0a3621e146108fa578063a408266314610943578063a5e2e44f14610970578063a738ea561461099a578063abaf742a14610a62578063b1e130fc14610aa25761014b565b80635f67de10116101085780635f67de10146106215780636a3b1e97146106e75780636efaa8f7146107ad5780637910867b1461087c5780637bd1f010146108a65780637e551b75146108d05761014b565b806305424669146101b657806335d14d21146101f45780633803dbce1461023057806338cafed414610313578063396250fa146103d95780634e0dbb2714610510575b6040805134808252602082018381523693830184905233937f87de3cfd3de44d9b830a98f5554f3ff79f1fafd7b3579d113ce92d82d3def2a19360009260608201848480828437600083820152604051601f909101601f1916909201829003965090945050505050a2005b3480156101c257600080fd5b506101f2600480360360408110156101d957600080fd5b50803560ff1690602001356001600160a01b0316610ccc565b005b34801561020057600080fd5b5061021e6004803603602081101561021757600080fd5b5035610e48565b60408051918252519081900360200190f35b34801561023c57600080fd5b506102ff600480360360a081101561025357600080fd5b8135916001600160a01b036020820135169160408201359190810190608081016060820135600160201b81111561028957600080fd5b82018360208201111561029b57600080fd5b803590602001918460018302840111600160201b831117156102bc57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295505091359250610ebe915050565b604080519115158252519081900360200190f35b34801561031f57600080fd5b5061021e6004803603606081101561033657600080fd5b6001600160a01b0382351691602081013591810190606081016040820135600160201b81111561036557600080fd5b82018360208201111561037757600080fd5b803590602001918460018302840111600160201b8311171561039857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610eef945050505050565b61047f600480360360408110156103ef57600080fd5b810190602081018135600160201b81111561040957600080fd5b82018360208201111561041b57600080fd5b803590602001918460018302840111600160201b8311171561043c57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295505091359250610f10915050565b60405180836001600160a01b03166001600160a01b0316815260200180602001828103825283818151815260200191508051906020019080838360005b838110156104d45781810151838201526020016104bc565b50505050905090810190601f1680156105015780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b34801561051c57600080fd5b506105df600480360360a081101561053357600080fd5b8135916001600160a01b036020820135169160408201359190810190608081016060820135600160201b81111561056957600080fd5b82018360208201111561057b57600080fd5b803590602001918460018302840111600160201b8311171561059c57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295505091359250610fea915050565b604080518315158152602080820183815284519383019390935283519192916060840191850190808383600083156104d45781810151838201526020016104bc565b34801561062d57600080fd5b5061021e6004803603606081101561064457600080fd5b6001600160a01b0382351691602081013591810190606081016040820135600160201b81111561067357600080fd5b82018360208201111561068557600080fd5b803590602001918460018302840111600160201b831117156106a657600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506111cf945050505050565b3480156106f357600080fd5b506105df6004803603606081101561070a57600080fd5b6001600160a01b0382351691602081013591810190606081016040820135600160201b81111561073957600080fd5b82018360208201111561074b57600080fd5b803590602001918460018302840111600160201b8311171561076c57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506111f7945050505050565b3480156107b957600080fd5b506105df600480360360a08110156107d057600080fd5b8135916001600160a01b036020820135169160408201359190810190608081016060820135600160201b81111561080657600080fd5b82018360208201111561081857600080fd5b803590602001918460018302840111600160201b8311171561083957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550509135925061122f915050565b34801561088857600080fd5b506102ff6004803603602081101561089f57600080fd5b5035611257565b3480156108b257600080fd5b5061021e600480360360208110156108c957600080fd5b5035611290565b3480156108dc57600080fd5b5061021e600480360360208110156108f357600080fd5b50356112ad565b34801561090657600080fd5b506109276004803603602081101561091d57600080fd5b503560ff166112ce565b604080516001600160a01b039092168252519081900360200190f35b34801561094f57600080fd5b506101f26004803603602081101561096657600080fd5b503560ff16611301565b34801561097c57600080fd5b506101f26004803603602081101561099357600080fd5b5035611374565b3480156109a657600080fd5b5061021e600480360360808110156109bd57600080fd5b6001600160a01b0382351691602081013591810190606081016040820135600160201b8111156109ec57600080fd5b8201836020820111156109fe57600080fd5b803590602001918460018302840111600160201b83111715610a1f57600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092955050913592506113de915050565b348015610a6e57600080fd5b50610a8c60048036036020811015610a8557600080fd5b503561147a565b6040805160ff9092168252519081900360200190f35b348015610aae57600080fd5b506101f260048036036020811015610ac557600080fd5b50356114a1565b348015610ad857600080fd5b506101f260048036036020811015610aef57600080fd5b503561154a565b348015610b0257600080fd5b50610a8c6115f5565b348015610b1757600080fd5b506101f2600480360360a0811015610b2e57600080fd5b8135916001600160a01b036020820135169160408201359190810190608081016060820135600160201b811115610b6457600080fd5b820183602082011115610b7657600080fd5b803590602001918460018302840111600160201b83111715610b9757600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092955050913592506115ff915050565b348015610be657600080fd5b506102ff60048036036040811015610bfd57600080fd5b50803590602001356001600160a01b03166116f7565b61047f60048036036020811015610c2957600080fd5b810190602081018135600160201b811115610c4357600080fd5b820183602082011115610c5557600080fd5b803590602001918460018302840111600160201b83111715610c7657600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611751945050505050565b348015610cc357600080fd5b50610a8c611828565b333014610cd857600080fd5b60008260ff1611610ce857600080fd5b6001600160a01b0381166000908152610100602052604090205460ff1615610d0f57600080fd5b6000808360ff166101008110610d2157fe5b01546001600160a01b03908116915082168114610e43576001600160a01b03811615610d6d576001600160a01b038116600090815261010060205260409020805460ff19169055610d85565b610102805460ff8082166001011660ff199091161790555b8160008460ff166101008110610d9757fe5b0180546001600160a01b0319166001600160a01b03928316179055821615610de4576001600160a01b038216600090815261010060205260409020805460ff191660ff8516179055610dfe565b610102805460ff19811660ff918216600019019091161790555b816001600160a01b0316816001600160a01b03168460ff167fd2788ca980f13f21037a6ee3d78579fe938e92275d840811c6979141b4d2209a60405160405180910390a45b505050565b336000908152610100602052604081205460ff16610e6557600080fd5b81610e6f57600080fd5b61010180546001810190915560008181526101036020526040808220859055518491339184917f0554ae85ef9019a9def2965db3592dcffb98b9aecad6892a7aa18f7858df81bf91a492915050565b6000858152610103602052604081205480610ed857600080fd5b610ee4868686866113de565b149695505050505050565b600080610efd8585856111cf565b9050610f088161154a565b949350505050565b60006060333014610f2057600080fd5b8284516020860134f56040513d808252919350915060208201816000823e016040818152602080835283518184015283516001600160a01b038616937f32c3469eb6d8cd094f741a84ddde28d09b99a5e1506252f2ae00a1f1a47dd9ed938693919283929183019185019080838360005b83811015610fa9578181015183820152602001610f91565b50505050905090810190601f168015610fd65780820380516001836020036101000a031916815260200191505b509250505060405180910390a29250929050565b336000908152610100602052604081205460609060ff1661100a57600080fd5b6000878152610103602052604090206110268888888888610ebe565b61102f57600080fd5b61010254600282015460ff61010090920482169116101561104f57600080fd5b6000808255600182015560028101805460ff1916905560405185516001600160a01b038916918891889190819060208401908083835b602083106110a45780518252601f199092019160209182019101611085565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d8060008114611106576040519150601f19603f3d011682016040523d82523d6000602084013e61110b565b606091505b508093508194505050336001600160a01b0316887f60178d187c5044ae08471e75952824a384598c7321ec7dc5fdd9dae54c1aac458585604051808315151515815260200180602001828103825283818151815260200191508051906020019080838360005b83811015611189578181015183820152602001611171565b50505050905090810190601f1680156111b65780820380516001836020036101000a031916815260200191505b50935050505060405180910390a3509550959350505050565b6000806111e76111e286868660006113de565b610e48565b9050610f088186868660006115ff565b60006060600061121261120d87878760006113de565b611290565b9050611222818787876000610fea565b9250925050935093915050565b6000606061123c8761154a565b6112498787878787610fea565b915091509550959350505050565b600081815261010360205260408120805461127157600080fd5b6101025460029091015460ff6101009092048216911610159050919050565b60008061129c83610e48565b90506112a78161154a565b92915050565b60008181526101036020526040812080546112c757600080fd5b5492915050565b6000808260ff16116112df57600080fd5b60008260ff1661010081106112f057fe5b01546001600160a01b031692915050565b33301461130d57600080fd5b6101025460ff828116610100909204161461137157610102805460ff8316610100810261ff00199092169190911790915560408051918252517f0463d14aca4fcb4ce8d1ad79e2937a32e2e380f8eb5a1b2d189acd6096c27b499181900360200190a15b50565b33301461138057600080fd5b600081815261010360205260409020805461139a57600080fd5b60008082556001820181905560028201805460ff1916905560405183917f96518e0344403c74425b974a489c60762964fe577347f827b97c56a4cd40082f91a25050565b60008484848460405160200180856001600160a01b03166001600160a01b031660601b815260140184815260200183805190602001908083835b602083106114375780518252601f199092019160209182019101611418565b51815160209384036101000a6000190180199092169116179052920193845250604080518085038152938201905282519201919091209998505050505050505050565b600081815261010360205260408120805461149457600080fd5b6002015460ff1692915050565b336000908152610100602052604090205460ff16806114bf57600080fd5b60008281526101036020526040902080546114d957600080fd5b60018181015460ff84169190911b9081166114f357600080fd5b6001820180548218905560028201805460ff19811660ff91821660001901909116179055604051339085907ff8b685d09e317ebca969e82d37bf2c3feeca6b790075c18f0f23fe12ebec0de490600090a350505050565b336000908152610100602052604090205460ff168061156857600080fd5b600082815261010360205260409020805461158257600080fd5b60018181015460ff84169190911b9081161561159d57600080fd5b600182810180548317905560028301805460ff19811660ff91821690930116919091179055604051339085907f5c5eba18d22f000d8abde369b6bed499233b5f42bad94d08eff5b60de7e663c090600090a350505050565b6101025460ff1681565b336000908152610100602052604090205460ff1661161c57600080fd5b6116298585858585610ebe565b61163257600080fd5b836001600160a01b0316336001600160a01b0316867f54e09f26fe1830b4c7cfe6c02e5fd2844415fd599e2c85ee3c8ef38da46379988686866040518084815260200180602001838152602001828103825284818151815260200191508051906020019080838360005b838110156116b457818101518382015260200161169c565b50505050905090810190601f1680156116e15780820380516001836020036101000a031916815260200191505b5094505050505060405180910390a45050505050565b600082815261010360205260408120805461171157600080fd5b6001600160a01b0383166000908152610100602052604090205460ff168061173857600080fd5b60019182015460ff9091169190911b1615159392505050565b6000606033301461176157600080fd5b82516020840134f06040513d808252919350915060208201816000823e016040818152602080835283518184015283516001600160a01b038616937f32c3469eb6d8cd094f741a84ddde28d09b99a5e1506252f2ae00a1f1a47dd9ed938693919283929183019185019080838360005b838110156117e95781810151838201526020016117d1565b50505050905090810190601f1680156118165780820380516001836020036101000a031916815260200191505b509250505060405180910390a2915091565b61010254610100900460ff168156fea165627a7a7230582016a71472e4e49349e0b44cf3a9cc5445e1fb0186eade5079118f1b76e98286470029", gas: 3000000},
  function (e, r) {
    if (e) throw e;
    if (typeof r.address !== "undefined") {
      console.log (
        "Deployed at " + r.address + " (tx: " + r.transactionHash + ")");
    }
  }).transactionHash) {
  console.log ("Deployment failed.  Probably web3.eth.accounts[0] is locked.");
}
