interface MyIter {
  hasNext(): boolean;
  next(): any;
  remove(item: any): void;
}
interface Menu {
  createIterator(): MyIter;
}
interface MenuItems {
  name: string;
  desc: string;
}
class BurgerKingIterator implements MyIter {
  private items: MenuItems[];
  private index: number = 0;
  constructor(items: Set<MenuItems>) {
    this.items = [...items];
  }

  next(): MenuItems {
    const res = this.items[this.index];
    this.index++;
    return res;
  }
  hasNext(): boolean {
    return this.index < this.items.length;
  }

  remove(name: string) {
    const index = this.items.findIndex(each => each.name === name);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
}
class BurgerKingMenu implements Menu {
  private menus: Set<MenuItems> = new Set([
    { name: '天椒皇堡', desc: '招牌汉堡' },
    { name: '安格斯牛堡', desc: '阿根廷上等牛肉' },
    { name: '果木鸡腿堡', desc: '口感松软,适合老人和小孩' },
  ]);

  createIterator() {
    return new BurgerKingIterator(this.menus);
  }
}

class KfcIterator implements MyIter {
  private items: MenuItems[];
  private index: number = 0;
  constructor(items: MenuItems[]) {
    this.items = items;
  }

  next(): MenuItems {
    const res = this.items[this.index];
    this.index++;
    return res;
  }

  hasNext(): boolean {
    return this.index < this.items.length;
  }

  remove(name: string) {
    const index = this.items.findIndex(each => each.name === name);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
}
class KfcMenu implements Menu {
  private menus: MenuItems[] = [
    {
      name: '原味鸡',
      desc: '整只鸡炸,美味',
    },
    {
      name: '新奥尔良烤鸡腿堡',
      desc: '适合大众口味',
    },
  ];

  createIterator() {
    return new KfcIterator(this.menus);
  }
}
class NormalWaitTress {
  private kfc: KfcMenu;
  private burgerKing: BurgerKingMenu;
  constructor(kfc: KfcMenu, burgerKing: BurgerKingMenu) {
    this.kfc = kfc;
    this.burgerKing = burgerKing;
  }

  private printIterator(iterator: MyIter) {
    while (iterator.hasNext()) {
      const item = iterator.next();
      console.log(item.name, item.desc);
    }
  }

  print() {
    this.printIterator(this.kfc.createIterator());
    this.printIterator(this.burgerKing.createIterator());
  }
}

function main() {
  const kfc = new KfcMenu();
  const burgerKing = new BurgerKingMenu();
  const waittress = new NormalWaitTress(kfc, burgerKing);
  waittress.print();
}

export default main;
export { Menu as MenuIterator, MyIter };
