enum SIZE {
  TAIL,
  GRANDE,
  VENTI,
}
type SIZEKEY = keyof typeof SIZE;
abstract class Beverage {
  protected size: SIZEKEY = 'GRANDE';
  abstract cost(): number;
  abstract getDescription(): String;

  getSize(): SIZEKEY {
    return this.size;
  }

  setSize(size: SIZEKEY) {
    this.size = size;
  }
}

abstract class Decorate extends Beverage {
  protected beverage: Beverage;
  constructor(beverage: Beverage) {
    super();
    this.beverage = beverage;
  }

  getSize(): SIZEKEY {
    return this.beverage.getSize();
  }

  setSize(size: SIZEKEY) {
    this.beverage.setSize(size);
  }
}
class Coffe extends Beverage {
  cost(): number {
    return 3;
  }

  getDescription(): string {
    return 'Coffe';
  }
}

class SizeDecorate extends Decorate {
  constructor(beverage: Beverage) {
    super(beverage);
  }

  cost(): number {
    if (this.getSize() === 'TAIL') {
      return this.beverage.cost() + 0.1;
    }
    if (this.getSize() === 'GRANDE') {
      return this.beverage.cost() + 0.2;
    }
    if (this.getSize() === 'VENTI') {
      return this.beverage.cost() + 0.3;
    }
    throw new Error(this.getSize());
  }

  getDescription(): string {
    return this.beverage.getDescription() + ', ' + this.getSize();
  }
}
class MilkDecorate extends Decorate {
  constructor(beverage: Beverage) {
    super(beverage);
  }

  cost(): number {
    return this.beverage.cost() + 2;
  }

  getDescription(): string {
    return this.beverage.getDescription() + ', milk';
  }
}

class ChocolateDecorate extends Beverage {
  private beverage: Beverage;
  constructor(beverage: Beverage) {
    super();
    this.beverage = beverage;
  }

  cost(): number {
    return this.beverage.cost() + 4;
  }

  getDescription(): string {
    return this.beverage.getDescription() + ', chocolate';
  }
}

(function main(): void {
  let coffe: Beverage = new Coffe();
  console.log(coffe.getDescription(), coffe.cost());
  coffe = new MilkDecorate(coffe);
  console.log(coffe.getDescription(), coffe.cost());
  coffe = new ChocolateDecorate(coffe);
  console.log(coffe.getDescription(), coffe.cost());
  coffe = new SizeDecorate(coffe);
  coffe.setSize('VENTI');
  console.log(coffe.getDescription(), coffe.cost());
  coffe.setSize('GRANDE');
  console.log(coffe.getDescription(), coffe.cost());
})();
