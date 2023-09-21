'use strict';
import { User, Movement } from './user.js';

const account1 = new User('Eden Cohen', 1.2, 1111, 'EUR');
const account2 = new User('Jessica Davis', 1.5, 2222, 'USD');
const account3 = new User('Steven Thomas Williams', 0.7, 3333, 'USD');
const accounts = [account1, account2, account3];

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
let currentAccount, intervalTimer;
inputLoginUsername.value = 'js';
inputLoginPin.value = '1111';

function autoLogout() {
  let secs = 300;
  const timerLabel = document.querySelector('.timer');
  intervalTimer = setInterval(() => {
    if (secs <= 0) {
      logout('Active Time Limit has been reached, log in again to continue');
      clearInterval(intervalTimer);
    }
    if (secs < 61) {
      timerLabel.style.color = 'red';
      timerLabel.style['font-size'] = '1.5rem';
    }
    secs--;
    timerLabel.textContent =
      `${Math.floor(secs / 60)}`.padStart(2, '0') +
      `:` +
      `${secs % 60}`.padStart(2, '0');
  }, 1000);
}

function updateUI(account) {
  displayMovements(account);
  calcBalance(account);
  calcDisplaySummary(account);
}

function initApp(account) {
  containerApp.style.opacity = 100;
  labelWelcome.textContent = `Welcome ${account.owner}!`;
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
}

function displayMovements(acc, sort = false) {
  const mov = sort
    ? acc.movements.slice().sort((a, b) => a.amount - b.amount)
    : acc.movements;
  containerMovements.innerHTML = '';
  mov.forEach(function (movement, i) {
    const displayDate = computeDate(movement.date);
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${movement.type}">${
      i + 1
    } ${movement.type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${movement.amount}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function computeDate(movementDate) {
  console.log('date', movementDate);
  const daysGap = Math.floor(
    Math.abs(new Date() - movementDate) / (1000 * 60 * 60 * 24)
  );
  if (daysGap > 7) {
    return Intl.DateTimeFormat('en-US').format(movementDate);
  } else if (daysGap < 1) {
    return `today`;
  } else if (daysGap === 1) {
    return `yesterday`;
  } else {
    return `${daysGap} days ago`;
  }
}

function calcBalance(account) {
  account.balance = account.movements.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  labelBalance.textContent = account.balance + '€';
}

function calcDisplaySummary(account) {
  const incomes = account.movements
    .filter(mov => mov.amount > 0)
    .reduce((acc, curr) => acc + curr.amount, 0)
    .toFixed(2);
  const out = account.movements
    .filter(mov => mov.amount < 0)
    .reduce((acc, curr) => acc + curr.amount, 0)
    .toFixed(2);
  const interest = account.movements
    .filter(mov => mov.amount > 0)
    .map(dep => (dep.amount * account.interestRate) / 100)
    .filter(dep => dep >= 1)
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);
  console.log(interest, 'interest');
  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(out)}€`;
  labelSumInterest.textContent = `${interest}€`;
}

function logout(msg) {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`;
  alert(msg);
}

// computeUserName(accounts);
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevents form from submiting / reloading the page
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  currentAccount = accounts.find(acc => acc.username === username);
  if (currentAccount?.pin === pin) {
    if (intervalTimer) {
      clearInterval(intervalTimer);
    }
    autoLogout();
    setInterval(() => {
      const now = new Date();
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'short',
      };
      //    const locale = navigator.language; // for time language by browser lang.
      labelDate.textContent = Intl.DateTimeFormat('en-US', options).format(now);
    }, 1000);
    updateUI(currentAccount);
    initApp(currentAccount);
  } else {
    alert(`User Not Found`);
  }
  console.log(currentAccount);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const toAcc = inputTransferTo.value;
  const foundAcc = accounts.find(acc => acc.username === toAcc);
  if (
    amount > 0 &&
    foundAcc &&
    foundAcc?.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    const inMovment = new Movement(amount, new Date());
    const outMovment = new Movement(-amount, new Date());
    foundAcc.movements.push(inMovment);
    currentAccount.movements.push(outMovment);
    updateUI(currentAccount);
  } else if (!foundAcc) {
    alert('Account Not Found');
  } else {
    let msg;
    foundAcc?.username === currentAccount.username
      ? (msg = 'Cant transfel money to yourself')
      : (msg = 'Not enough money to transfer');
    alert(msg);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  window.location.href = 'index.html';
  const pin = inputClosePin.value;
  const username = inputCloseUsername.value;
  if (
    username === currentAccount.username &&
    Number(pin) === currentAccount.pin
  ) {
    const userConfirm = confirm(
      'Are you sure you want to delete your account?'
    );
    if (userConfirm) {
      const accIndex = accounts.findIndex(acc => acc.username == username);
      accounts.splice(accIndex, 1);
      console.log(accounts);
      logout('Account has been closed');
    }
  } else {
    alert(`user not found`);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.balance >= amount * 0.1) {
    setTimeout(() => {
      const movement = new Movement(amount, new Date());
      currentAccount.movements.push(movement);
      inputLoanAmount.value = '';
      updateUI(currentAccount);
    }, 2000);
  } else {
    alert("Your balance needs to be at least 10% of the loan your'e asking");
  }
});

let sorted = false;
btnSort.addEventListener('click', function () {
  sorted = !sorted;
  displayMovements(currentAccount, sorted);
});
