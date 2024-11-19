# Smart-Contract-Management-ETH-AVAX

This is a Solidity smart contract named `Assessment` that manages an account balance. The contract allows the owner to deposit and withdraw funds securely, with various checks and error-handling mechanisms.

## Features

- **Account Ownership**: Only the account owner can perform deposits and withdrawals.
- **Deposit Functionality**: Allows the owner to add funds to the account.
- **Withdrawal Functionality**: Enables the owner to withdraw funds, with restrictions on minimum withdrawal amounts and sufficient balance.
- **Custom Error Handling**: Includes custom error messages for insufficient balances.
- **Event Emission**: Emits events (`Deposit` and `Withdraw`) to record transactions on the blockchain.

## Contract Details

### State Variables

- `address payable public owner`: Stores the owner's address.
- `uint256 public balance`: Tracks the current balance of the account.

### Events

- `event Deposit(uint256 amount)`: Emitted when a deposit is made.
- `event Withdraw(uint256 amount)`: Emitted when a withdrawal is made.

### Constructor

The constructor initializes the contract with:
- `initBalance`: The initial balance of the account.

```solidity
constructor(uint initBalance) payable {
    owner = payable(msg.sender);
    balance = initBalance;
}
```

### Modifiers

- `onlyOwner`: Restricts access to functions so that only the contract owner can execute them.

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "You are not the owner of this account");
    _;
}
```

### Functions

#### `getBalance()`

Returns the current balance of the account.

```solidity
function getBalance() public view returns (uint256) {
    return balance;
}
```

#### `deposit(uint256 _amount)`

Allows the owner to deposit a specified amount of funds into the account.

- **Access Control**: Only the owner can call this function.
- **Transaction Validation**: Uses `assert` to ensure the balance updates correctly.
- **Event Emission**: Emits a `Deposit` event upon success.

```solidity
function deposit(uint256 _amount) public payable onlyOwner {
    uint _previousBalance = balance;
    balance += _amount;
    assert(balance == _previousBalance + _amount);
    emit Deposit(_amount);
}
```

#### `withdraw(uint256 _withdrawAmount)`

Allows the owner to withdraw a specified amount of funds from the account.

- **Access Control**: Only the owner can call this function.
- **Minimum Amount**: Withdrawal amounts must be at least 20.
- **Insufficient Balance Handling**: Reverts with a custom error if the withdrawal amount exceeds the balance.
- **Transaction Validation**: Uses `assert` to ensure the balance updates correctly.
- **Event Emission**: Emits a `Withdraw` event upon success.

```solidity
function withdraw(uint256 _withdrawAmount) public onlyOwner {
    require(_withdrawAmount > 0, "Amount must be greater than 0");
    if (_withdrawAmount < 20) {
        revert("Withdraw failed: Amount must be at least 20");
    }
    uint _previousBalance = balance;
    if (balance < _withdrawAmount) {
        revert InsufficientBalance({
            balance: balance,
            withdrawAmount: _withdrawAmount
        });
    }
    balance -= _withdrawAmount;
    assert(balance == (_previousBalance - _withdrawAmount));
    emit Withdraw(_withdrawAmount);
}
```

## Usage

1. Deploy the contract with an initial balance using a compatible Ethereum development environment (e.g., Hardhat, Remix).
2. Use the owner's address to interact with the `deposit` and `withdraw` functions.
3. Monitor emitted events for transaction details.

## License

This project is licensed under the [Curt Russel Celeste](https://www.facebook.com/profile.php?id=100069766380432) license.
```
