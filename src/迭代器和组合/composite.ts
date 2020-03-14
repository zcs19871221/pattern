import { MyIter } from './iterator';

abstract class MenuComponent {
  add(_component: MenuComponent): void {
    throw new Error('not support');
  }

  remove(_component: MenuComponent): void {
    throw new Error('not support');
  }

  getChild(_index: number): MenuComponent {
    throw new Error('not support');
  }

  abstract print(): void;
}
class MenuItem extends MenuComponent {
  private name: string;
  private desc: string;
  constructor(name: string, desc: string) {
    super();
    this.name = name;
    this.desc = desc;
  }

  print() {
    console.log('menuItem:', this.name, this.desc);
  }
}

class ConcreateIter implements MyIter {
  private menus: MenuComponent[];
  private index: number;
  constructor(menus: Set<MenuComponent>) {
    this.menus = [...menus];
    this.index = 0;
  }

  next(): MenuComponent {
    const res = this.menus[this.index];
    this.index++;
    return res;
  }

  hasNext(): boolean {
    return this.index < this.menus.length;
  }

  remove(menu: MenuComponent) {
    const index = this.menus.findIndex(each => each === menu);
    if (index > -1) {
      this.menus.splice(index, 1);
    }
  }
}
interface MenuIterator {
  iterator(): MyIter;
}
class Menu extends MenuComponent implements MenuIterator {
  private name: string;
  private desc: string;
  private menus: Set<MenuComponent> = new Set();
  constructor(name: string, desc: string) {
    super();
    this.name = name;
    this.desc = desc;
  }

  add(menu: MenuComponent) {
    this.menus.add(menu);
  }

  remove(menu: MenuComponent) {
    this.menus.delete(menu);
  }

  getChild(index: number) {
    return [...this.menus][index];
  }

  iterator() {
    return new ConcreateIter(this.menus);
  }

  print() {
    console.log('menu:', this.name, this.desc);
    const iterator = this.iterator();
    while (iterator.hasNext()) {
      const component = iterator.next();
      component.print();
    }
  }
}

class WaitTress {
  private allMenus: MenuComponent;

  constructor(allMenus: MenuComponent) {
    this.allMenus = allMenus;
  }

  printMenu() {
    console.log('waittress print menu');
    this.allMenus.print();
  }
}

const main = () => {
  const kfc = new Menu('kfc', '肯德基是老牌快餐店');
  kfc.add(new MenuItem('原味鸡', '整只鸡炸,美味'));
  kfc.add(new MenuItem('新奥尔良烤鸡腿堡', '适合大众口味'));
  const panini = new Menu('kfc帕尼尼系列', '早餐汉堡');
  panini.add(new MenuItem('帕尼尼猪柳蛋', '猪肉加煎蛋'));
  panini.add(new MenuItem('帕尼尼培根蛋', '培根加煎蛋'));
  kfc.add(panini);
  const burgerKing = new Menu('burgerking', 'Burgerking现烤汉堡');
  burgerKing.add(new MenuItem('天椒皇堡', '辣味'));
  burgerKing.add(new MenuItem('果木鸡腿堡', '不辣'));
  const allMenus = new Menu('所有菜单', '');
  allMenus.add(kfc);
  allMenus.add(burgerKing);
  const waittress = new WaitTress(allMenus);
  waittress.printMenu();
};
main();
