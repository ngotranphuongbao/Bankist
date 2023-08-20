'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/* BANKIST APP */

/* GENERAL */
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2023-06-12T21:31:17.178Z',
    '2023-06-14T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2023-06-12T21:31:17.178Z',
    '2023-06-14T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2023-06-12T21:31:17.178Z',
    '2023-06-14T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2023-06-12T21:31:17.178Z',
    '2023-06-14T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
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

/* FUNCTIONS */
// Calculate Passed Days
const formatDateMovements = function (day) {
  const dayPass = Math.round(
    (new Date() - new Date(day)) / (24 * 60 * 60 * 1000)
  );
  if (dayPass === 0) return 'today';
  if (dayPass === 1) return 'yesterday';
  else
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(new Date(day));
};
// Display Movements
const displayMovements = function (movements, account) {
  containerMovements.innerHTML = '';
  const html = movements
    .map(function (mov, i) {
      return `
      <div class="movements__row">
        <div class="movements__type movements__type--${
          mov > 0 ? 'deposit' : 'withdrawal'
        }">${i + 1} ${mov > 0 ? 'deposit' : 'withdrawal'}</div>
        <div class="movements__date">${formatDateMovements(
          account.movementsDates[i]
        )}</div>
        <div class="movements__value">${mov}€</div>
      </div>
      `;
    })
    .join('');
  containerMovements.insertAdjacentHTML('afterbegin', html);
};

// Display Summary
const displaySummary = function (account) {
  const inAmout = account.movements
    .filter(mov => mov > 0)
    .reduce((sum, deposit) => sum + deposit, 0);
  const outAmout = account.movements
    .filter(mov => mov < 0)
    .reduce((sum, withdrawal) => sum + withdrawal, 0);
  const balanceAmout = inAmout + outAmout;
  const interestAmout = (inAmout * account.interestRate) / 100;
  labelSumIn.textContent = `${inAmout.toFixed(2)}€`;
  labelSumOut.textContent = `${-outAmout.toFixed(2)}€`;
  labelBalance.textContent = `${balanceAmout.toFixed(2)}€`;
  labelSumInterest.textContent = `${interestAmout.toFixed(2)}€`;
};

// Display A New Movement
const displayNewMovement = function (account, amount, type = 'deposit') {
  const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
    account.movements.length + 1
  } withdrawal</div>
      <div class="movements__date">${formatDateMovements(new Date())}</div>
      <div class="movements__value">${
        type === 'deposit' ? amount : -amount
      }€</div>
    </div>
    `;
  containerMovements.insertAdjacentHTML('afterbegin', html);
};
// Logout Timer
const setTimeOut = function () {
  let time = 5 * 60;
  const tick = function () {
    labelTimer.textContent = `${String(Math.trunc(time / 60)).padStart(
      2,
      0
    )}:${String(time % 60).padStart(2, 0)}`;
    if (!time) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

/* FUNTIONALITIES */
let userAccount;
let timer;
let sorted = false;
// Creat Usernames
accounts.forEach(
  acc =>
    (acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .reduce((string, word) => string + word[0], ''))
);

// Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  userAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (userAccount?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome, ${userAccount.owner}`;
    labelDate.textContent = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
    displayMovements(userAccount.movements, userAccount);
    displaySummary(userAccount);
    if (timer) clearInterval(timer);
    setTimeOut();
  }
  inputLoginUsername.value = inputLoginPin.value = '';
  inputClosePin.blur();
});

// Transfer Money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    accounts.some(acc => acc.username === inputTransferTo.value) &&
    +inputTransferAmount.value >= 0 &&
    +inputTransferAmount.value <= Number.parseInt(labelBalance.textContent)
  ) {
    const transferAmount = +inputTransferAmount.value;
    userAccount.movements.push(-transferAmount);
    accounts.forEach(function (acc) {
      if (acc.username === inputTransferTo.value)
        acc.movements.push(transferAmount);
    });
    displayNewMovement(userAccount, transferAmount, 'withdrawal');
    displaySummary(userAccount);
  } else {
    alert('Invalid information. Try again!');
  }
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

// Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmout = +inputLoanAmount.value;
  if (!userAccount.movements.some(mov => mov > (loanAmout * 10) / 100)) {
    alert('The loan is too big. Try again!');
  } else {
    userAccount.movements.push(loanAmout);
    displayNewMovement(userAccount, loanAmout);
    displaySummary(userAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Sort Movements
btnSort.addEventListener('click', function () {
  if (!sorted) {
    const sortedMovements = userAccount.movements.slice().sort((a, b) => b - a);
    displayMovements(sortedMovements, userAccount);
  } else {
    displayMovements(userAccount.movements, userAccount);
  }
  sorted = !sorted;
});

// Request Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    userAccount.username === inputCloseUsername.value &&
    userAccount.pin === +inputClosePin.value
  ) {
    const accountIndex = accounts.findIndex(
      acc =>
        userAccount.username === inputCloseUsername.value &&
        userAccount.pin === +inputClosePin.value
    );
    accounts.splice(accountIndex, accountIndex + 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});


