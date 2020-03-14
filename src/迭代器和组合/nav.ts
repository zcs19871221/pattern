interface NavOpt {
  url: string;
  name: string;
  dir?: string;
  componentKey?: string;
  reducerKey?: string;
}

interface Iter {
  hasNext(): boolean;
  next(): any;
}
abstract class NavComponent {
  protected url: string;
  protected name: string;
  protected dir: string;
  protected componentKey: string;
  protected reducerKey: string;
  constructor({
    url,
    name,
    dir = '',
    componentKey = 'Router',
    reducerKey = 'reducer',
  }: NavOpt) {
    this.url = url;
    this.name = name;
    this.dir = dir;
    this.componentKey = componentKey;
    this.reducerKey = reducerKey;
  }

  add(_item: NavComponent) {
    throw new Error('未定义');
  }

  remove(_item: NavComponent) {
    throw new Error('未定义');
  }

  getChild(): NavComponent[] {
    throw new Error('未定义');
  }

  print() {
    console.log(this.url, this.name);
  }

  getName() {
    return this.name;
  }

  abstract isLeaf(): boolean;
  abstract filter(dirs: string[]): NavComponent | null;

  abstract createIterator(): Iter;
}

class MenuInterator implements Iter {
  private components: NavComponent[];
  private index: number = 0;
  constructor(components: Set<NavComponent>) {
    this.components = [...components];
  }

  hasNext() {
    return this.index < this.components.length;
  }

  next() {
    return this.components[this.index++];
  }
}

class NullInterator implements Iter {
  hasNext() {
    return false;
  }

  next() {
    return null;
  }
}

class NavInterator implements Iter {
  private stack: Iter[];
  constructor(iterator: Iter) {
    this.stack = [iterator];
  }

  hasNext(): boolean {
    if (this.stack.length === 0) {
      return false;
    }
    if (this.stack[0].hasNext()) {
      return true;
    } else {
      this.stack.shift();
      return this.hasNext();
    }
  }

  next() {
    if (this.hasNext()) {
      const component = this.stack[0].next();
      if (component instanceof Menu) {
        this.stack.push(component.createIterator());
      }
      return component;
    }
    return null;
  }
}

class Menu extends NavComponent {
  private components: Set<NavComponent> = new Set();

  add(item: NavComponent) {
    this.components.add(item);
  }

  remove(item: NavComponent) {
    this.components.delete(item);
  }

  getChild(): NavComponent[] {
    return [...this.components];
  }

  filter(dirs: string[]): NavComponent | null {
    const filterdChild = this.getChild()
      .map((each: NavComponent) => {
        return each.filter(dirs);
      })
      .filter(each => each !== null);
    if (filterdChild.length > 0) {
      const menu = new Menu({ url: this.url, name: this.name });
      filterdChild.forEach(each => {
        menu.add(<NavComponent>each);
      });
      return menu;
    }
    return null;
  }

  createIterator() {
    return new NavInterator(new MenuInterator(this.components));
  }

  isLeaf() {
    return false;
  }
}

class MenuItems extends NavComponent {
  filter(dirs: string[]): NavComponent | null {
    if (dirs.includes(this.dir)) {
      return new MenuItems({
        dir: this.dir,
        componentKey: this.componentKey,
        reducerKey: this.reducerKey,
        url: this.url,
        name: this.name,
      });
    }
    return null;
  }

  createIterator() {
    return new NullInterator();
  }

  isLeaf() {
    return true;
  }
}
(function main() {
  const menu = new Menu({ url: '/', name: '根节点' });
  const userMenu = new Menu({ url: '/user', name: '用户管理' });
  const operateMenu = new Menu({ url: '/operate', name: '操作管理' });
  userMenu.add(operateMenu);
  userMenu.add(new MenuItems({ url: '/admin', name: '管理员', dir: 'admin' }));
  userMenu.add(
    new MenuItems({ url: '/common', name: '一般用户', dir: 'common' }),
  );
  menu.add(userMenu);
  menu.add(new MenuItems({ url: '/monit', name: '监控', dir: 'monit' }));
  const iterator = menu.createIterator();
  while (iterator.hasNext()) {
    const component: NavComponent = iterator.next();
    component.print();
    if (component.isLeaf()) {
      console.log('leaf is:' + component.getName());
    }
  }
  const filterd = menu.filter([]);
  console.log('--------------------');
  if (filterd !== null) {
    const iter2 = filterd.createIterator();
    while (iter2.hasNext()) {
      const component: NavComponent = iter2.next();
      component.print();
    }
  } else {
    console.log('filterd is null');
  }
})();
