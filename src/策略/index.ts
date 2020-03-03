abstract class Duck {
  private fly: FlyBehavior;
  constructor(fly: FlyBehavior) {
    this.fly = fly;
  }
  public performFly(): void {
    this.fly.fly();
  }
  abstract dispay(): void;
  public swim(): void {
    console.log('all duck can swim');
  }
  public setFlyBehavior(fly: FlyBehavior) {
    this.fly = fly;
  }
}
interface FlyBehavior {
  fly(): void;
}

class FlyWithWing implements FlyBehavior {
  fly() {
    console.log('fly with wings');
  }
}
class NoFly implements FlyBehavior {
  fly() {
    console.log('i can not fly');
  }
}
class GreenDuck extends Duck {
  constructor(fly: FlyBehavior) {
    super(fly);
  }
  dispay() {
    console.log('-------------\ni am green duck');
  }
}
class ToyDuck extends Duck {
  constructor(fly: FlyBehavior) {
    super(fly);
  }
  dispay() {
    console.log('-------------\ni am a duck toy');
  }
}

(function main() {
  const greenDuck = new GreenDuck(new FlyWithWing());
  greenDuck.dispay();
  greenDuck.swim();
  greenDuck.performFly();
  const duckToy = new ToyDuck(new NoFly());
  duckToy.dispay();
  duckToy.swim();
  duckToy.performFly();
  console.log('duck toy add a wings');
  duckToy.setFlyBehavior(new FlyWithWing());
  duckToy.performFly();
})();
