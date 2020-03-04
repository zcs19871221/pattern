interface Observer {
  update(data: object): void;
}
interface Display {
  display(data: object): void;
}
interface Subject {
  add(item: Observer): void;
  remove(item: Observer): void;
  notify(): void;
}

class Temper implements Observer, Display {
  constructor(weather: Subject) {
    weather.add(this);
  }

  display(data: object) {
    console.log('temper:', data);
  }

  update(data: object): void {
    this.display(data);
  }
}
class Weather implements Subject {
  private list: Observer[] = [];
  private data: object = {};
  constructor() {}
  add(item: Observer): void {
    this.list.push(item);
  }

  remove(item: Observer): void {
    if (this.list.indexOf(item) > -1) {
      this.list.splice(this.list.indexOf(item), 1);
    }
  }

  notify(): void {
    this.list.forEach((each: Observer) => {
      each.update(this.data);
    });
  }

  setValue(data: object): void {
    this.data = data;
    this.notify();
  }
}
const weather = new Weather();

const temper = new Temper(weather);

weather.setValue({ max: 30, min: 5 });
weather.setValue({ max: 20, min: 10 });
