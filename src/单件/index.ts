class Single {
  private static uniqInstance: Single | null = null;
  private name: string = '';
  private constructor() {}

  static getInstance() {
    if (Single.uniqInstance === null) {
      Single.uniqInstance = new Single();
    }
    return Single.uniqInstance;
  }

  setName(name: string) {
    this.name = name;
  }

  getName() {
    console.log(this.name);
  }
}

const a = Single.getInstance();
const b = Single.getInstance();
a.getName();
b.getName();
a.setName('zcs');
a.getName();
b.getName();
