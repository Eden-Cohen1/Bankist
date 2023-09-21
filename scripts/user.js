export class Movement {
  constructor(amount, date) {
    this.amount = amount;
    this.date = date;
    this.type = amount < 0 ? 'withdrawal' : 'deposit';
  }
}
const startingMovement = new Movement(5000, new Date());
export class User {
  constructor(
    name,
    interestRate,
    pin,
    currency,
    movements = [startingMovement]
  ) {
    this.owner = name;
    this.username = this.owner
      .toLowerCase()
      .split(' ')
      .map(namePart => namePart[0])
      .join('');
    this.movements = movements;
    this.interestRate = interestRate;
    this.pin = pin;
    this.balance = this.movements.reduce(
      (acc, curr) => acc + curr.amount,
      5000
    );
    this.currency = currency;
  }
}
