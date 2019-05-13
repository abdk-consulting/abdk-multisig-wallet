ABDK Multisig Wallet
====================

Copyright (c) 2017-2019, [ABDK Consulting](https://abdk.consulting/)

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software must
   display the following acknowledgement: This product includes software
   developed by ABDK Consulting.
4. Neither the name of ABDK Consulting nor the names of its contributors may be
   used to endorse or promote products derived from this software without
   specific prior written permission.

THIS SOFTWARE IS PROVIDED BY ABDK CONSULTING ''AS IS'' AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
SHALL ABDK CONSULTING BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
OF SUCH DAMAGE.

Overview
--------

ABDK Multisig Wallet is an Ethereum smart contract that allows multiple (up to
255) parties to collectively own an Ethereum address.  The owners may suggest
transactions to be executed from wallet's address, approve suggested
transactions, and execute transaction that collected enough approvals.

The smart contract is available in two versions:
[stand alone](ABDKMultisigWallet.sol) and
[delegated](ABDKMultisigWalletDelegated.sol).

Stand alone version is more expansive to deploy, but slightly cheaper to use.
Delegated version is about ten times cheaper to deploy than stand alone version,
but more expensive to use and requires stand alone version to be already
deployed on the same blockchain.

Features
--------

Here is the list of high-level features offered by ABDK Multisig Wallet:

1. public and private transactions are both supported via single API;
2. it is possible to deploy smart contract from wallet's address via `CREATE`
   and `CREATE2` opcodes;
3. data returned by executed transaction is captured and logged;
4. smart contract is available in two versions: stand alone (expensive
   deployment, cheaper use) and delegated (cheaper deployment, more expensive
   use).

Usage Scenarios
---------------

This section describes most common usage scenarios for ABDK Multisig Wallet.

### 1. Stand Alone Deployment

For stand alone deployment just deploy
[ABDKMultisigWallet](ABDKMultisigWallet.sol) smart contract from some of your
addresses.  This will create new stand alone ABDK Multisig Wallet.  The address
used for deployment will become the only owner of the wallet.

### 2. Delegated Deployment

For delegated deployment, deploy
[ABDKMultisigWalletDelegated](ABDKMultisigWalletDelegated.sol) providing address
of some already deployed stand alone ABDK Multisig Wallet as constructor
parameter.  Make sure that this stand alone wallet is deployed in the same
blockchain and is based on the same code version as new deployed delegated
wallet.

### 3. Public Transaction

In order to execute public transaction, initiator needs to call
`suggestRevealAndApprove` method providing transaction destination,
ether amount, and binary data as parameters.
Then other owners need to call `approve` method providing transaction ID as
parameter.  Transaction ID may be extracted from the events logged by
`suggestRevealAndApprove`.
Finally, when transaction collected enough approvals, one of the owners needs to
call `execute` method providing transaction details as parameters.  These
details may also be extracted from the events logged by
`suggestRevealAndApprove`.
Optionally, the last approver may call `approveAndExecute` method instead
of`approve` to save some gas.

### 4. Private Transaction

For private transaction, initiator calls `suggestAndApprove` method
providing hash of transaction details.  The hash may be calculated off-chain
from transaction details via `calcualteHash` constant method.
Then, initiator sends transaction details to other owners via e-mail or some
other off-chain media.
The owners use `checkHash` constant method to ensure that transaction details
they receive from initiator actually match hash stored in the smart contract.
Then owners call `approve` and finally `execute` the same way as for public
transaction.  For this flow, transaction details appear on-chain only when
`execute` method is called.

### 5. Smart Contract Creation

In order to create smart contract from wallet's address, owners need to make
wallet to execute a transaction that calls `createSmartContract` or
`createSmartContract2` method on the wallet itself.  The former method
gets as a parameter contract's byte code packed together with constructor
arguments and creates smart contract using `CREATE` opcode.  The latter method
accepts `salt` parameter along with byte code, and uses `CREATE2` opcode.

### 6. Change Number of Approvals Required

To change number of approvals required to execute a transaction, owners need to
make wallet to execute a transaction that calls `setApprovalsRequired`
method, providing new number of required approvals as a parameter.  Note that
is number of required approvals will ever be set higher than current number of
owner, the wallet will be locked forever and there will be no way to execute
any transaction from it anymore.

### 7. Change Owner

ABDK Multisig Wallet may have up to 255 owners.  Wallet smart contract has 255
slots for owners with indexed by numbers 1..255.  Indexes of the slots occupied
by current owner do not have to go in sequence.  I.e. there could be owners at
slots \#1 and \#3, while slot \#2 may be vacant.

In order to change the owner occupying certain slot, owners need to
make wallet to execute a transaction that calls `changeOwner` method,
providing slot index and new owner address as parameters.  Providing zero owner
address will effectively make slot vacant.  Note that one owner may not occupy
more than one slot, so providing an address of existing owner to
`changeOwner` method will revert the transaction.

Transaction approvals made by owners are bound to slot indexes rather than to
owner addresses, so new owner may revoke approvals made be the owner who
previously occupied the same slot.

### 8. Cancel Transaction

In some cases owners may decide not to execute suggested transaction.  This may
happen if transaction was suggested by mistake, or became irrelevant while
collecting approvals, or was submitted by malicious party using compromised
owner's key.  Such transaction may be cancelled by calling
`cancelSuggestion` method and providing transaction ID as a parameter.
This method should be called from wallet's address, so owners need to suggest,
approve, and execute transaction that will call this method.

Functions and Properties
------------------------

This section describes all public functions and properties of ABDK Multisig
Wallet smart contract.

    function suggest (bytes32 _hash)
    public returns (uint256)

Suggest a transaction to be executed from the wallet's address.  Parameter
`_hash` is the hash of transaction details calculated via `calculateHash`
method.  Returns transaction ID.  This method may be called only by wallet
owners.  Logs `Suggestion` event on successful invocation.

    function reveal (uint256 _id, address _to, uint256 _value, bytes memory _data, uint256 _salt)
    public

Reveal details of the transaction with given ID, revert in case provided
transaction do not match hash stored in the smart contract.  This method may be
called only by wallet owners.  Logs `Revelation` event on successful
invocation.

    function approve (uint256 _id)
    public

Approve the transaction with given ID.  This method may be called only be wallet
owners.  Logs `Approval` event on successful invocation.

    function revokeApproval (uint256 _id)
    public

Revoke approval from the transaction with given ID.  This method may be called
only be wallet owners.  Logs `ApprovalRevocation` event on successful
invocation.

    function execute (uint256 _id, address _to, uint256 _value, bytes memory _data, uint256 _salt)
    public returns (bool _status, bytes memory _returnedData)

Execute the transaction with given ID and transaction details, revert in case
the transaction didn't collect enough approvals yet, or transaction details do
not match hash stored in the smart contract.  This method may be called
only be wallet owners.  Logs `Execution` event on successful invocation.

    function createSmartContract (bytes memory _byteCode)
    public payable returns (address _contractAddress, bytes memory _returnedData)

Create new smart contract using `CREATE` opcode.  Parameter `_byteCode`
is the byte code of the smart contract to be deployed packed together with
constructor arguments.  This method may only be called by the wallet itself via
approved transaction.  Logs `ContractCreation` event on successful
invocation.

    function createSmartContract2 (bytes memory _byteCode, bytes32 _salt)
    public payable returns (address _contractAddress, bytes memory _returnedData)

Works similar to `createSmartContract` function but uses `CREATE2`
opcode with given salt. 

    function changeOwner (uint8 _ownerIndex, address _newOwner)
    public

Change wallet owner at given index.  This method may only be called by the wallet itself via
approved transaction.  Logs `OwnerChange` event on successful invocation.

    function setApprovalsRequired (uint8 _approvalsRequired)
    public

Change number of approvals required to execute a transaction.  This method may
only be called by the wallet itself via approved transaction.  Logs
`ApprovalsRequiredChange` event on successful invocation.

    function cancelSuggestion (uint256 _id)
    public

Cancel suggested transaction with given ID.  This method may only be called by
the wallet itself via approved transaction.  Logs
`SuggestionCancellation` event on successful invocation.

    function calculateHash (address _to, uint256 _value, bytes memory _data, uint256 _salt)
    public pure returns (bytes32)

Calculate transaction hash from destination address, ether amount, data, and
salt.

    function checkHash (uint256 _id, address _to, uint256 _value, bytes memory _data, uint256 _salt)
    public view returns (bool)

Check, whether transaction details match hash stored in smart contract.

    function approvalsCount (uint256 _id)
    public view returns (uint8)

Get number of approvals required to execute a transaction.

    function hashOf (uint256 _id)
    public view returns (bytes32)

Get hash of transaction details stored in smart contract.

    function isApproved (uint256 _id)
    public view returns (bool)

Check, whether transaction with given ID collected enough approvals to be
executed.

    function isApprovedBy (uint256 _id, address _owner)
    public view returns (bool)

Tell, whether transaction with given ID is approved by given owner.

    function getOwnerAt (uint8 _index)
    public view returns (address)

Get address of the owner at given index.  Return zero address in case owner slot
with given index is currently vacant.

    function suggestAndReveal (address _to, uint256 _value, bytes memory _data)
    public returns (uint256)

Convenient and gas effective way to suggest and reveal a transaction.

    function suggestRevealAndApprove (address _to, uint256 _value, bytes memory _data)
    public returns (uint256)

Convenient and gas effective way to suggest, reveal, and approve a transaction.

    function suggestAndApprove (bytes32 _hash)
    public returns (uint256)

Convenient and gas effective way to suggest and approve a transaction.

    function suggestApproveAndExecute (address _to, uint256 _value, bytes memory _data)
    public returns (bool _status, bytes memory _returnedData)

Convenient and gas effective way to suggest, approve, and execute a transaction.
Use this method when number of required approvals is less than or equals to one.

    function approveAndExecute (uint256 _id, address _to, uint256 _value, bytes memory _data, uint256 _salt)
    public returns (bool _status, bytes memory _returnedData)

Convenient and gas effective way to approve and execute a transaction.

    uint8 public ownersCount

Current number of owners.

    uint8 public approvalsRequired

Number of approvals required to execute a transaction.

Events
------

This section describes all events that ABDK Multisig Wallet smart contract may
log.

    event Deposit (
      address indexed from,
      uint256 value,
      bytes data)

Logged by fallback function on incoming transactions.

    event Suggestion (
      uint256 indexed id,
      address indexed owner,
      bytes32 indexed hash)

Logged when new transaction is suggested.

    event Revelation (
      uint256 indexed id,
      address indexed owner,
      address indexed to,
      uint256 value,
      bytes data,
      uint256 salt)

Logged when transaction details are revealed.

    event Approval (
      uint256 indexed id,
      address indexed owner)

Logged when transaction is approved by wallet owner.  

    event ApprovalRevocation (
      uint256 indexed id,
      address indexed owner)

Logged when wallet owner revokes transaction approval.

    event Execution (
      uint256 indexed id,
      address indexed owner,
      bool status,
      bytes returnedData)

Logged when transaction has been executed.

    event SmartContractCreation (
      address indexed contractAddress,
      bytes returnedData)

Logged when smart contract has been created.

    event OwnerChange (
      uint8 indexed ownerIndex,
      address indexed oldOwner,
      address indexed newOwner)

Logged when owner has been changed.

    event ApprovalsRequiredChange (
      uint8 newApprovalsRequired)

Logged when number of approvals required to execute a transaction has been
changed.

    event SuggestionCancellation (
      uint256 indexed id)

Logged when suggested transaction has been cancelled.