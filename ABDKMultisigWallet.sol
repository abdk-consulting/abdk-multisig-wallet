/*
 * ABDK Multisig Wallet Smart Contract.
 * Copyright © 2017-2019 by ABDK Consulting (https://abdk.consulting/).
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.5.7;

/**
 * ABDK Multisig Wallet smart contract allows multiple (up to 255) parties to
 * collectively own an Ethereum address.  This address may be used to securely
 * store ether and to execute Ethereum transactions once approved by certain
 * number of owners.
 */
contract ABDKMultisigWallet {
  /**
   * Create new ABDK Multisig Wallet smart contract and make msg.sender to be
   * the only owner of it.  The number of required approvals is set to one.
   */
  constructor () public {
    // Zero address may not be an owner
    require (msg.sender != address (0));

    // Save msg.sender address as owner #1 (#0 is reserved)
    owners [1] = msg.sender;
    ownerIndexes [msg.sender] = 1;

    // Set number of required approvals to one
    approvalsRequired = 1;

    // Set owners count to one
    ownersCount = 1;

    // Log OwnerChange event
    emit OwnerChange (1, address (0), msg.sender);
  }

  /**
   * Fallback function that just logs incoming ether transfers.
   */
  function () external payable {
    // Just log ether deposit origin, value, and data
    emit Deposit (msg.sender, msg.value, msg.data);
  }

  /**
   * Suggest transaction with given hash to be executed.
   *
   * @param _hash hash of the transaction to be suggested
   * @return ID of the suggestion created
   */
  function suggest (bytes32 _hash) public returns (uint256) {
    // Only owners may suggest transactions
    require (ownerIndexes [msg.sender] > 0);

    // Zero hash is not allowed, sorry
    require (_hash != bytes32 (0));

    // Generate new unique suggestion ID (don't care about overflow)
    uint256 id = nextSuggestionID++;

    // Save hash of the suggested transaction
    suggestions [id].hash = _hash;

    // Log Suggestion event
    emit Suggestion (id, msg.sender, _hash);

    // Return ID of the suggestion created
    return id;
  }

  /**
   * Reveal parameters of suggested transaction with given ID.
   *
   * @param _id ID of the suggested transaction to reveal parameters of
   * @param _to destination address of the transaction
   * @param _value value of the transaction
   * @param _data data of the transaction
   * @param _salt salt used to calculate transaction hash
   */
  function reveal (
    uint256 _id,
    address _to, uint256 _value, bytes memory _data, uint256 _salt) public {
    // Only owners may reveal transactions
    require (ownerIndexes [msg.sender] > 0);

    // Make sure parameters do match hash of the suggested transaction
    require (checkHash (_id, _to, _value, _data, _salt));

    // Log Revelation event
    emit Revelation (_id, msg.sender, _to, _value, _data, _salt);
  }

  /**
   * Approve suggested transaction with given ID.
   *
   * @param _id ID of the suggested transaction to be approved
   */
  function approve (uint256 _id) public {
    // Get index of the owner who wants to approve suggested transaction
    uint8 ownerIndex = ownerIndexes [msg.sender];

    // Only owners may approve
    require (ownerIndex > 0);

    // Obtain information about suggested transaction with given ID
    SuggestionInfo storage suggestion = suggestions [_id];

    // Make sure suggested with such ID does exist
    require (suggestion.hash != bytes32 (0));

    // Calculate bit mask for the owner
    uint256 mask = uint256 (1) << ownerIndex;

    // Make sure this owner didn't approve this transaction yet
    require (suggestion.approvals & mask == 0);

    // Approve the transaction
    suggestion.approvals |= mask;
    suggestion.approvalsCount += 1;

    // Log Approval event
    emit Approval (_id, msg.sender);
  }

  /**
   * Revoke approval for suggested transaction with given ID.
   *
   * @param _id ID of the suggested transaction to revoke approval for
   */
  function revokeApproval (uint256 _id) public {
    // Get index of the owner who wants to approve suggested transaction
    uint8 ownerIndex = ownerIndexes [msg.sender];

    // Only owners may approve
    require (ownerIndex > 0);

    // Obtain information about suggested transaction with given ID
    SuggestionInfo storage suggestion = suggestions [_id];

    // Make sure suggested with such ID does exist
    require (suggestion.hash != bytes32 (0));

    // Calculate bit mask for the owner
    uint256 mask = uint256 (1) << ownerIndex;

    // Make sure this owner did approve this transaction
    require (suggestion.approvals & mask != 0);

    // Revoke approval for the transaction
    suggestion.approvals ^= mask;
    suggestion.approvalsCount -= 1;

    // Log ApprovalRevocation event
    emit ApprovalRevocation (_id, msg.sender);
  }

  /**
   * Execute suggested transaction with given ID and parameters.
   *
   * @param _id ID of the suggested transaction to be executed
   * @param _to destination address of the transaction
   * @param _value value of the transaction
   * @param _data data of the transaction
   * @param _salt salt used to calculate transaction hash
   * @return transaction execution status and returned data
   */
  function execute (
    uint256 _id, address _to, uint256 _value, bytes memory _data, uint256 _salt)
    public returns (bool _status, bytes memory _returnedData) {
    // Only owners may execute transactions
    require (ownerIndexes [msg.sender] > 0);

    // Obtain information about suggested transaction with given ID
    SuggestionInfo storage suggestion = suggestions [_id];

    // Make sure parameters do match hash of the suggested transaction
    require (checkHash (_id, _to, _value, _data, _salt));

    // Make sure transaction has enough approvals
    require (suggestion.approvalsCount >= approvalsRequired);

    // Clear transaction information
    suggestion.hash = bytes32 (0);
    suggestion.approvals = 0;
    suggestion.approvalsCount = 0;

    // Execute the transaction and remember execution result
    (_status, _returnedData) = _to.call.value (_value)(_data);
 
    // Log Execution event
    emit Execution (_id, msg.sender, _status, _returnedData);
  }

  /**
   * Create smart contract with given byte code.
   *
   * @param _byteCode byte code to create smart contract with
   * @return created smart contract address and data returned by smart contract
   *         creation
   */
  function createSmartContract (bytes memory _byteCode)
    public payable returns (
      address _contractAddress, bytes memory _returnedData) {
    // Contract creation may be performed only by the contract itself
    require (msg.sender == address (this));

    assembly {
      _contractAddress := create (
          callvalue (), add (_byteCode, 0x20), mload (_byteCode))
      let l := returndatasize ()
      let p := mload (0x40)
      _returnedData := p
      mstore (p, l)
      p := add (p, 0x20)
      returndatacopy (p, 0x0, l)
      mstore (0x40, add (p, l))
    }

    emit SmartContractCreation (_contractAddress, _returnedData);
  }

  /**
   * Create smart contract using CREATE2 opcode with given byte code and salt.
   *
   * @param _byteCode byte code to create smart contract with
   * @param _salt salt to use for generating smart contract address
   * @return created smart contract address and data returned by smart contract
   *         creation
   */
  function createSmartContract2 (bytes memory _byteCode, bytes32 _salt)
    public payable returns (
      address _contractAddress, bytes memory _returnedData) {
    // Contract creation may be performed only by the contract itself
    require (msg.sender == address (this));

    assembly {
      _contractAddress := create2 (
          callvalue (), add (_byteCode, 0x20), mload (_byteCode), _salt)
      let l := returndatasize ()
      let p := mload (0x40)
      _returnedData := p
      mstore (p, l)
      p := add (p, 0x20)
      returndatacopy (p, 0x0, l)
      mstore (0x40, add (p, l))
    }

    emit SmartContractCreation (_contractAddress, _returnedData);
  }

  /**
   * Replace existing owner with given index with given new owner.  If there is
   * no owner with given index, add new owner at given index.  If given new
   * owner address is zero, remove owner with given index.
   *
   * @param _ownerIndex index of the owner to be replaced
   * @param _newOwner address of the new owner
   */
  function changeOwner (uint8 _ownerIndex, address _newOwner) public {
    // Owner changing may be performed only by the contract itself
    require (msg.sender == address (this));

    // Zero owner index is reserved
    require (_ownerIndex > 0);

    // Make sure new owner is not already an owner
    require (ownerIndexes [_newOwner] == 0);

    // Obtain address of existing owner with given index
    address oldOwner = owners [_ownerIndex];

    // Could you think of situation when this is not true?  We could!
    if (oldOwner != _newOwner) {
      // If owner with given index exists
      if (oldOwner != address (0)) {
        // Remove it!
        ownerIndexes [oldOwner] = 0;
      } else {
        // Otherwise increase owners count
        ownersCount += 1;
      }

      owners [_ownerIndex] = _newOwner;

      // If new owner is not zero
      if (_newOwner != address (0)) {
        // Add it!
        ownerIndexes [_newOwner] = _ownerIndex;
      } else {
        // Otherwise decrease owners count
        ownersCount -= 1;
      }

      // Log OwnerChange event
      emit OwnerChange (_ownerIndex, oldOwner, _newOwner);
    }
  }

  /**
   * Set number of approvals required to execute transaction.
   *
   * @param _approvalsRequired new number of approvals required
   */
  function setApprovalsRequired (uint8 _approvalsRequired) public {
    // Changing of number of required approvals may be performed only by the
    // contract itself
    require (msg.sender == address (this));

    // If new value actually differs from the existing one
    if (approvalsRequired != _approvalsRequired) {
      approvalsRequired = _approvalsRequired;

      emit ApprovalsRequiredChange (_approvalsRequired);
    }
  }

  /**
   * Cancel transaction suggestion.
   *
   * @param _id ID of the suggested transaction to be cancelled
   */
  function cancelSuggestion (uint256 _id) public {
    // Transaction suggestions may only be cancelled by the contract itself
    require (msg.sender == address (this));

    // Obtain information about suggested transaction with given ID
    SuggestionInfo storage suggestion = suggestions [_id];

    // Make sure suggestion with given ID does exist
    require (suggestion.hash != bytes32 (0));

    // Clear suggestion information
    suggestion.hash = bytes32 (0);
    suggestion.approvals = 0;
    suggestion.approvalsCount = 0;

    // Log SuggestionCAncellation event.
    emit SuggestionCancellation (_id);
  }

  /**
   * Calculate hash of transaction with given parameters.
   *
   * @param _to transaction destination address
   * @param _value transaction value
   * @param _data transaction data
   * @param _salt salt to use for hash calculation
   * @return transaction hash
   */
  function calculateHash (
    address _to, uint256 _value, bytes memory _data, uint256 _salt)
    public pure returns (bytes32) {
    // Calculate and return transaction hash
    return keccak256 (abi.encodePacked (_to, _value, _data, _salt));
  }

  /**
   * Check hash of suggested transaction with given ID.
   *
   * @param _id ID of the suggested transaction to check index for
   * @param _to transaction destination address
   * @param _value transaction value
   * @param _data transaction data
   * @param _salt salt to use for hash calculation
   * @return true if hash of suggested transaction with given ID matches
   *              transaction parameters provided, false otherwise
   */
  function checkHash (
    uint256 _id, address _to, uint256 _value, bytes memory _data, uint256 _salt)
    public view returns (bool) {
    // Obtain hash of the suggested transaction with given ID
    bytes32 hash = suggestions [_id].hash;

    // Make sure suggestion with given ID does exist
    require (hash != bytes32 (0));

    return hash == calculateHash (_to, _value, _data, _salt);
  }

  /**
   * Get number of approvals already collected for suggested transaction with
   * given ID.
   *
   * @param _id ID of the suggested transaction to get number of approvals for
   * @return number of approvals collected for suggested transaction with given
   *         ID
   */
  function approvalsCount (uint256 _id) public view returns (uint8) {
    // Obtain information about suggested transaction with given ID
    SuggestionInfo storage suggestion = suggestions [_id];

    // Make sure suggestion with given ID does exist
    require (suggestion.hash != bytes32 (0));

    // Return approvals count for suggestion
    return suggestion.approvalsCount;
  }

  /**
   * Get hash of parameters of suggested transaction with given ID.
   *
   * @param _id ID of the suggested transaction to get hash of parameters for
   * @return hash of parameters of suggested transaction with given ID
   */
  function hashOf (uint256 _id) public view returns (bytes32) {
    // Obtain information about suggested transaction with given ID
    SuggestionInfo storage suggestion = suggestions [_id];

    // Make sure suggestion with given ID does exist
    require (suggestion.hash != bytes32 (0));

    // Return hash of transaction parameters for suggestion
    return suggestion.hash;
  }

  /**
   * Tell whether suggested transaction with given ID has collected enough
   * approvals to be executed.
   *
   * @param _id ID of the suggested transaction to check
   * @return true if suggested transaction with given ID has collected enough
   *         approvals to be executed, false otherwise
   */
  function isApproved (uint256 _id)
    public view returns (bool) {
    // Obtain information about suggested transaction with given ID
    SuggestionInfo storage suggestion = suggestions [_id];

    // Make sure suggestion with given ID does exist
    require (suggestion.hash != bytes32 (0));

    // Check whether transaction has collected enough approvals
    return suggestion.approvalsCount >= approvalsRequired;
  }

  /**
   * Tell whether given owner has approved suggested transaction with given ID.
   *
   * @param _id ID of the suggested transaction to check approval for
   * @param _owner owner to check approval by
   * @return true if given owner has approved suggested transaction with given
   *         ID, false otherwise
   */
  function isApprovedBy (uint256 _id, address _owner)
    public view returns (bool) {
    // Obtain information about suggested transaction with given ID
    SuggestionInfo storage suggestion = suggestions [_id];

    // Make sure suggestion with given ID does exist
    require (suggestion.hash != bytes32 (0));

    // Obtain index of given owner
    uint8 ownerIndex = ownerIndexes [_owner];

    // Make sure such owner actually exists
    require (ownerIndex > 0);

    // Check whether given owner has approved the transaction
    return (suggestion.approvals & (uint256 (1) << ownerIndex)) != 0;
  }

  /**
   * Get address of the owner with given index.
   *
   * @param _index index to get address of the owner at
   * @return address of the owner with given index or zero if there is no owner
   *         with such index
   */
  function getOwnerAt (uint8 _index) public view returns (address) {
    // Zero index is reserved
    require (_index > 0);

    return owners [_index];
  }

  /**
   * Suggest transaction to be executed and reveal its parameters.
   *
   * @param _to transaction destination
   * @param _value transaction value
   * @param _data transaction data
   * @return ID of the suggestion created
   */
  function suggestAndReveal (address _to, uint256 _value, bytes memory _data)
    public returns (uint256) {
    // Suggest transaction
    uint256 id = suggest (calculateHash (_to, _value, _data, 0));

    // Reveal transaction
    reveal (id, _to, _value, _data, 0);

    // Return suggestion ID
    return id;
  }

  /**
   * Suggest transaction to be executed, reveal its parameters, and approve the
   * transaction.
   *
   * @param _to transaction destination
   * @param _value transaction value
   * @param _data transaction data
   * @return ID of the suggestion created
   */
  function suggestRevealAndApprove (address _to, uint256 _value, bytes memory _data)
    public returns (uint256) {
    // Suggest transaction and reveal its parameters
    uint256 id = suggestAndReveal (_to, _value, _data);

    // Approve transaction
    approve (id);

    // Return suggestion ID
    return id;
  }

  /**
   * Suggest transaction with given hash to be executed and approve this
   * transaction.
   *
   * @param _hash hash of transaction parameters
   * @return ID of the suggestion created
   */
  function suggestAndApprove (bytes32 _hash) public returns (uint256) {
    // Suggest transaction
    uint256 id = suggest (_hash);

    // Approve transaction
    approve (id);

    // Return suggestion ID
    return id;
  }

  /**
   * Suggest transaction with given hash to be executed, approve this
   * transaction, and execute it.
   *
   * @param _to transaction destination
   * @param _value transaction value
   * @param _data transaction data
   * @return transaction execution status and returned data
   */
  function suggestApproveAndExecute (address _to, uint256 _value, bytes memory _data)
    public returns (bool _status, bytes memory _returnedData) {
    // Suggest transaction and approve it
    uint256 id = suggestAndApprove (calculateHash (_to, _value, _data, 0));

    // Execute transaction
    return execute (id, _to, _value, _data, 0);
  }

  /**
   * Approve transaction and execute it.
   *
   * @param _id ID of the suggested transaction to approve and execute
   * @param _to transaction destination
   * @param _value transaction value
   * @param _data transaction data
   * @param _salt salt used to calculate transaction hash
   * @return transaction execution status and returned data
   */
  function approveAndExecute (
    uint256 _id, address _to, uint256 _value, bytes memory _data, uint256 _salt)
    public returns (bool _status, bytes memory _returnedData) {
    // Approve transaction
    approve (_id);

    // Execute transaction
    return execute (_id, _to, _value, _data, _salt);
  }

  /**
   * Owners of the wallet.
   */
  address [256] private owners;

  /**
   * Maps owner addresses to owner indexes.
   */
  mapping (address => uint8) private ownerIndexes;

  /**
   * Next unique ID for suggested transaction.
   */
  uint256 private nextSuggestionID = 0;

  /**
   * Number of owners of the smart contract.
   */
  uint8 public ownersCount;

  /**
   * Number of approvals required to execute transaction.
   */
  uint8 public approvalsRequired;

  /**
   * Maps unique ID of suggested transaction to suggested transaction
   * information.
   */
  mapping (uint256 => SuggestionInfo) private suggestions;

  /**
   * Encapsulates information about suggested transaction.
   */
  struct SuggestionInfo {
    /**
     * Hash of the suggested transaction.
     */
    bytes32 hash;

    /**
     * Approvals mask
     */
    uint256 approvals;

    /**
     * Number of approvals collected.
     */
    uint8 approvalsCount;
  }

  /**
   * Logged with ether was deposited to the smart contract.
   *
   * @param from address deposited ether came from
   * @param value amount of ether deposited (may be zero)
   * @param data transaction data
   */
  event Deposit (address indexed from, uint256 value, bytes data);

  /**
   * Logged when new transaction is suggested.
   *
   * @param id ID of the suggested transaction
   * @param owner owner that suggested the transaction
   * @param hash hash of the suggested transaction
   */
  event Suggestion (
    uint256 indexed id,
    address indexed owner,
    bytes32 indexed hash);

  /**
   * Logged when parameters of suggested transaction was revealed.
   *
   * @param id ID of the suggested transaction parameters was revealed of
   * @param owner owner that revealed transaction parameters
   * @param to transaction destination address
   * @param value transaction value
   * @param data transaction data
   * @param salt salt used for calculating transaction hash
   */
  event Revelation (
    uint256 indexed id,
    address indexed owner,
    address indexed to,
    uint256 value,
    bytes data,
    uint256 salt);

  /**
   * Logged when suggested transaction was approved by an owner.
   *
   * @param id ID of the suggested transaction that was approved
   * @param owner address of the owner that approved the suggested transaction
   */
  event Approval (uint256 indexed id, address indexed owner);

  /**
   * Logged when approval for suggested transaction was revoked by an owner.
   *
   * @param id ID of the suggested transaction the approval was revoked for
   * @param owner address of the owner that revoked approval for the suggested
   *              transaction
   */
  event ApprovalRevocation (uint256 indexed id, address indexed owner);

  /**
   * Logged when transaction was executed by an owner.
   *
   * @param id ID of the transaction that was executed
   * @param owner address of the owner that executed the transaction
   * @param status transaction execution status
   * @param returnedData data returned by transaction execution
   */
  event Execution (uint256 indexed id, address indexed owner, bool status,
    bytes returnedData);

  /**
   * Logged when smart contract was created.
   *
   * @param contractAddress address of created smart contract
   * @param returnedData data returned by smart contract creation
   */
  event SmartContractCreation (address indexed contractAddress,
    bytes returnedData);

  /**
   * Logged when owner with given index was changed.
   *
   * @param ownerIndex index of the changed owner
   * @param oldOwner old owner at given index or zero if owner was added
   * @param newOwner new owner at given index or zero if owner was removed
   */
  event OwnerChange (
    uint8 indexed ownerIndex,
    address indexed oldOwner,
    address indexed newOwner);

  /**
   * Logged when number of required approvals was changed.
   *
   * @param newApprovalsRequired new value of the number of required approvals
   */
  event ApprovalsRequiredChange (uint8 newApprovalsRequired);

  /**
   * Logged when suggested transaction was cancelled.
   *
   * @param id ID of cancelled suggested transaction
   */
  event SuggestionCancellation (uint256 indexed id);
}
