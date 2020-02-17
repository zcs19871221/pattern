/* 
  需求:
    一个有多插槽的遥控器,每个插槽有两个命令:打开,关闭
    有一个undo按钮.撤销上一次的操作

    0插槽:卧室灯
    1插槽:厕所灯
    2插槽:卧室风扇高速
    3插槽:卧室风扇中速

  设计思路:
    接收者:灯,风扇:命令的实际执行者
    调用者:实现comand接口的实例.实现execute,undo方法.
    客户:RemoteControl实例:使用执行者.包含setCommand设置命令.

    风扇的设计:对同一个对象包装成不同的命令,实现不同操作,隐藏内部细节.

    为每个命令设置默认的NoCommand对象.防止空命令出现.

    宏命令:持有一组命令实现execute,undo.

  定义:
    命令对象通过在特定的接收者上绑定一组动作来封装一个请求.对象只暴露execute和undo方法.
    客户端(遥控器)不关心拥有什么命令对象,只要该对象实现了command接口就行了.

  优点:
    1. 将命令发送者和执行者解耦.

  适用场景:
    1. 队列请求:队列里是一个个command实例,队列只拿出来,执行execute方法.
    2. 恢复操作日志:额外实现store和load方法,把每个操作(命令)序列化后store(存储)在磁盘上,当系统崩溃时,从磁盘load(读取)日志,实现恢复.只记录操作记录,而不用存储整个数据,优化性能和空间.

  问题:
    1. 为啥调用者(命令对象)不直接实现接收者的方法?
      傻就是聪明.只懂得调用一个execute行为,代表调用者和接收者松耦合.
*/
interface Command {
  execute(): void;
  undo(): void;
}

class RemoteControl {
  private onCommands: Command[] = new Array(3);
  private offCommands: Command[] = new Array(3);
  private undoCommand: Command = new NoCommand();

  constructor() {
    for (let i = 0; i < 3; i++) {
      this.onCommands[i] = new NoCommand();
      this.offCommands[i] = new NoCommand();
    }
  }
  setCommand(slot: number, on: Command, off: Command) {
    this.onCommands[slot] = on;
    this.offCommands[slot] = off;
  }

  on(slot: number) {
    this.onCommands[slot].execute();
    this.undoCommand = this.onCommands[slot];
  }

  undo() {
    this.undoCommand.undo();
  }

  off(slot: number) {
    this.offCommands[slot].execute();
    this.undoCommand = this.offCommands[slot];
  }
}

class Light {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  on() {
    console.log(`turn on ${this.name}`);
  }
  off() {
    console.log(`turn off ${this.name}`);
  }
}

class NoCommand implements Command {
  execute() {
    console.log('no command');
  }

  undo() {
    console.log('no command');
  }
}
class LightOnCommand implements Command {
  private light: Light;
  constructor(light: Light) {
    this.light = light;
  }

  execute() {
    this.light.on();
  }

  undo() {
    console.log('undo light:');
    this.light.off();
  }
}

class LightOffCommand implements Command {
  private light: Light;
  constructor(light: Light) {
    this.light = light;
  }

  execute() {
    this.light.off();
  }

  undo() {
    this.light.on();
  }
}
enum Speed {
  off,
  slow,
  middle,
  fast,
}
class Fan {
  private locate: string = '';
  constructor(locate: string) {
    this.locate = locate;
  }
  private speed: keyof typeof Speed = 'off';

  changeSpeed(speed: keyof typeof Speed) {
    console.log(`${this.locate} fan change to ${speed}`);
    this.speed = speed;
  }

  getSpeed(): keyof typeof Speed {
    return this.speed;
  }
}
abstract class FanCommand implements Command {
  protected fan: Fan;
  protected prevSpeed: keyof typeof Speed = 'off';
  constructor(fan: Fan) {
    this.fan = fan;
  }

  bak() {
    this.prevSpeed = this.fan.getSpeed();
  }

  abstract _execute(): void;

  execute(): void {
    this.bak();
    this._execute();
  }

  undo() {
    console.log('undo fan :');
    this.fan.changeSpeed(this.prevSpeed);
  }
}

class FastFan extends FanCommand {
  constructor(fan: Fan) {
    super(fan);
  }

  _execute(): void {
    this.fan.changeSpeed('fast');
  }
}
class MiddleFan extends FanCommand {
  constructor(fan: Fan) {
    super(fan);
  }

  _execute(): void {
    this.fan.changeSpeed('middle');
  }
}
class OffFan extends FanCommand {
  constructor(fan: Fan) {
    super(fan);
  }

  _execute(): void {
    this.fan.changeSpeed('off');
  }
}
class MicroCommand implements Command {
  private commands: Command[] = [];
  constructor(commands: Command[]) {
    this.commands = commands;
  }

  execute() {
    for (let i = 0, len = this.commands.length; i < len; i++) {
      this.commands[i].execute();
    }
  }

  undo() {
    for (let i = 0, len = this.commands.length; i < len; i++) {
      this.commands[i].undo();
    }
  }
}
(function main() {
  const livingRoomLight = new Light('livingRoom');
  const bathRoomLight = new Light('bathRoom');
  const fan = new Fan('livingRoom');
  const onLivingRoomLight = new LightOnCommand(livingRoomLight);
  const offLivingRoomLight = new LightOffCommand(livingRoomLight);
  const onBathRoomLight = new LightOnCommand(bathRoomLight);
  const offBathRoomLight = new LightOffCommand(bathRoomLight);
  const allLightOn = new MicroCommand([onLivingRoomLight, onBathRoomLight]);
  const allLightOff = new MicroCommand([offLivingRoomLight, offBathRoomLight]);
  const fastFan = new FastFan(fan);
  const middleFan = new MiddleFan(fan);
  const offFan = new OffFan(fan);
  const remote = new RemoteControl();
  remote.setCommand(0, onLivingRoomLight, offLivingRoomLight);
  remote.setCommand(1, onBathRoomLight, offBathRoomLight);
  remote.setCommand(2, fastFan, offFan);
  remote.setCommand(3, middleFan, offFan);
  remote.setCommand(4, middleFan, offFan);
  remote.setCommand(5, allLightOn, allLightOff);
  remote.on(0);
  remote.undo();
  remote.on(1);
  remote.off(1);
  remote.undo();
  remote.off(0);
  remote.on(2);
  remote.off(2);
  remote.undo();
  remote.on(3);
  remote.on(1);
  remote.undo();
  remote.on(5);
  remote.off(5);
})();
