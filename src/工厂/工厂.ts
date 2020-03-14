interface PizzaInterface {
  prepare(): void;
  bake(): void;
  cut(): void;
  box(): void;
}
interface PizzaStoreInterface {
  order(type: string): void;
  createPizza(type: string): Pizza;
}
enum pizzaType {
  cheese,
  beaf,
}
type pizzaString = keyof typeof pizzaType;
abstract class Pizza implements PizzaInterface {
  private location: string;
  private type: string;
  constructor(location: string, type: string) {
    this.location = location;
    this.type = type;
  }
  abstract prepare(): void;
  bake() {
    console.log('开始烘烤:' + this.location + this.type);
  }
  cut() {
    console.log('开始切片:' + this.location + this.type);
  }
  box() {
    console.log('开始装盒:' + this.location + this.type);
  }
}

abstract class PizzaStore implements PizzaStoreInterface {
  order(type: pizzaString): void {
    const pizza = this.createPizza(type);
    pizza.prepare();
    pizza.bake();
    pizza.cut();
    pizza.box();
  }

  abstract createPizza(type: pizzaString): Pizza;
}
class BostonBeefPizza extends Pizza {
  constructor() {
    super('波士顿', '牛肉');
  }

  prepare() {
    console.log('准备波士顿特级牛肉');
  }
}
class BostonCheesePizza extends Pizza {
  constructor() {
    super('波士顿', '奶酪');
  }

  prepare() {
    console.log('准备意大利奶酪');
  }
}
class NewYorkBeefPizza extends Pizza {
  constructor() {
    super('纽约', '牛肉');
  }

  prepare() {
    console.log('准备高级和牛');
  }
}
class NewYorkCheesePizza extends Pizza {
  constructor() {
    super('纽约', '奶酪');
  }

  prepare() {
    console.log('准备纽约网红奶酪');
  }
}
class NewYorkPizzaStore extends PizzaStore {
  createPizza(type: pizzaString): Pizza {
    switch (type) {
      case 'beaf':
        return new NewYorkBeefPizza();
      case 'cheese':
        return new NewYorkCheesePizza();
      default:
        throw new Error('未定义类型');
    }
  }
}

class BostonPizzaStore extends PizzaStore {
  createPizza(type: pizzaString): Pizza {
    switch (type) {
      case 'beaf':
        return new BostonBeefPizza();
      case 'cheese':
        return new BostonCheesePizza();
      default:
        throw new Error('未定义类型');
    }
  }
}

function main() {
  const newYorkPizzaStore = new NewYorkPizzaStore();
  const bostonPizzaStore = new BostonPizzaStore();
  newYorkPizzaStore.order('cheese');
  newYorkPizzaStore.order('beaf');
  bostonPizzaStore.order('beaf');
  bostonPizzaStore.order('beaf');
}
export default main;
