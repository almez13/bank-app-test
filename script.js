'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Start
const displayMovements = function(movements, sort = false) {
   //clear existing information in html file
  containerMovements.innerHTML = '';  
  //sorts the movements
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  //display the movements
  movs.forEach(function(move, index) {   
    const type = move > 0 ? 'deposit' : 'withdrawal';
    
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
        <div class="movements__value">${move} €</div>
      </div>    
    `;
    //insert html into DOM with thw help of inserAdjacentHTML. Afterbegin set the order.
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Create the func which trahsform Jonas Schmedtmann to js (the first leter of names). We create in all obj new property "username" and give them a value.
const createUserName = function(accs) {
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(" ").map(name => name[0]).join("");
  });  
};

createUserName(accounts);

//Calculete a balance and show the summ in the app
const calcDisplayBalance = function(acc) {
  //we add to the object the new property "balance" and store the value there
  acc.balance = acc.movements.reduce((summ, move) => summ + move, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

// update UI in one function
const updateUI = function(acc) {
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(currentAccount);
  //display summary
  calcDisplaySummary(currentAccount);
};

// Calculate all summs at the bottom of the application
const calcDisplaySummary = function(acc) {
  //summ of all positive values
  const income = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income} €`;
  //summ of all negative values
  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;
  //interest
  const interest = acc.movements.filter(mov => mov > 0).map(mov => mov * acc.interestRate/100).reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest} €`;
};

//Login event handlers for btn and enter keypress
let currentAccount;

btnLogin.addEventListener("click",function(e) {
  e.preventDefault();//prevent form from default submiting and page reload 
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  //First we chec if the account exists then we check a pin (this prevent errors)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
  //display UI and welcome message
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
  containerApp.style.opacity = 100;   
  //clear the input fields
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  inputLoginPin.blur(); // we blur the last input field (remove focus from the element)   
  //update UI
  updateUI(currentAccount);
  }
});

// Transfer money
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  //clear trahsfer fields
  inputTransferAmount.value = "";
  inputTransferTo.value = "";
  //check if the ammount >0, if sender has enough money to transfer, if sender doesnt send money to his own account, if receiverAccount is exists "?" mark, 
  if (amount > 0 && receiverAccount && currentAccount.balance >= amount && receiverAccount?.username !== currentAccount.username) {
    //we make a transfer CurrentAccount get withdrawal and receiveraccount get deposit
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);    
    updateUI(currentAccount);
  };
});

//Loan function
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  // Condition if any deposit is greater or equal 10% of the requested amount
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
  //Add movement
  currentAccount.movements.push(amount);
  //Update UI
  updateUI(currentAccount); 
  };
  inputLoanAmount.value = "";
});


//Close account function
btnClose.addEventListener('click', function(e) {
  e.preventDefault();  

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    //find index of chosen account in arr
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    //Cut account that we need from accounts arr, where index is the position of the element that you want to remove and 1 is the number of elements to remove.
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;   
  };

  inputCloseUsername.value = "";
  inputClosePin.value = "";
});

// sort handlers
let sorted = false;
btnSort.addEventListener("click", function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
