abstract class Pizza {
  protected beef!: Beef;
  protected cheese!: Cheese;
  abstract prepare(): void;
  bake() {
    console.log('烘烤披萨');
  }

  cut() {
    console.log('切片披萨');
  }

  box() {
    console.log('打包披萨');
  }
}

abstract class PizzaStore {
  abstract createPizza(type: pizzaType): Pizza;
  order(type: pizzaType) {
    const pizza: Pizza = this.createPizza(type);
    pizza.prepare();
    pizza.bake();
    pizza.cut();
    pizza.box();
  }
}
interface Cheese {
  name: string;
}
interface Beef {
  name: string;
}

interface PizzaIngredientFactory {
  createCheese(): Cheese;
  createBeef(): Beef;
}
class NyCheese implements Cheese {
  name: string;
  constructor() {
    this.name = '纽约上等奶酪';
  }
}
class NyBeef implements Beef {
  name: string;
  constructor() {
    this.name = '纽约进口和牛';
  }
}
class NyIngredientFactory implements PizzaIngredientFactory {
  createCheese() {
    return new NyCheese();
  }

  createBeef() {
    return new NyBeef();
  }
}
enum PizzaType {
  cheese,
  beef,
}
type pizzaType = keyof typeof PizzaType;

class NyPizzaStore extends PizzaStore {
  createPizza(type: pizzaType) {
    const ingredient: PizzaIngredientFactory = new NyIngredientFactory();
    if (type === 'cheese') {
      return new CheesePizza(ingredient);
    }
    if (type === 'beef') {
      return new BeefPizza(ingredient);
    }
    throw new Error('type错误');
  }
}
class CheesePizza extends Pizza {
  private pizzaIngredient: PizzaIngredientFactory;
  constructor(pizzaIngredient: PizzaIngredientFactory) {
    super();
    this.pizzaIngredient = pizzaIngredient;
  }

  prepare() {
    this.cheese = this.pizzaIngredient.createCheese();
    console.log('准备CheesePizza原料:', this.cheese.name);
  }
}
class BeefPizza extends Pizza {
  private pizzaIngredient: PizzaIngredientFactory;
  constructor(pizzaIngredient: PizzaIngredientFactory) {
    super();
    this.pizzaIngredient = pizzaIngredient;
  }

  prepare() {
    this.cheese = this.pizzaIngredient.createCheese();
    this.beef = this.pizzaIngredient.createBeef();
    console.log('准备BeefPizza原料:', this.beef.name);
  }
}
const main = () => {
  const nyPizzaStore = new NyPizzaStore();
  nyPizzaStore.order('cheese');
  nyPizzaStore.order('beef');
};
main();
export default main;
