/*
 * ABDK Multisig Wallet Delegated Smart Contract.
 * Copyright © 2019 by ABDK Consulting (https://abdk.consulting/).
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.5.7;

/**
 * ABDK Multisig Wallet Delegated smart contract is a delegated version of
 * ABDK Multisig Wallet smart contract.  It delegates most of the work to
 * another deployed ABDK Multisig Wallet smart contract, thus has small
 * byte code and low deployment price.
 */
contract ABDKMultisigWalletDelegated {
  /**
   * Create new ABDK Multisig Wallet smart contract and make msg.sender to be
   * the only owner of it.  The number of required approvals is set to one.
   */
  constructor (address _delegate) public {
    // Zero address may not be an owner
    require (msg.sender != address (0));

    // Save delegate address
    delegate = _delegate;

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
    if (msg.data.length == 0) { // Delegating this would exceed 2300 gas limit
      // Just log ether deposit origin, value, and data
      emit Deposit (msg.sender, msg.value, msg.data);
    } else {
      bool status;
      bytes memory returnedData;

      // Delegate actual work
      (status, returnedData) = delegate.delegatecall (msg.data);

      // Make sure delegate call succeeded
      require (status);

      // Forward returned data to the called
      assembly {
        return (add (returnedData, 0x20), mload (returnedData))
      }
    }
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
  uint8 private ownersCount;

  /**
   * Number of approvals required to execute transaction.
   */
  uint8 private approvalsRequired;

  /**
   * Maps unique ID of suggested transaction to suggested transaction
   * information.
   */
  mapping (uint256 => SuggestionInfo) private suggestions;

  /**
   * Address of a smart contract to delegate actual work to.
   */
  address private delegate;

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
}
