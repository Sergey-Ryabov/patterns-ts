/**
 * Decorator — это структурный паттерн, который позволяет добавлять объектам новые поведения на лету, помещая их в объекты-обёртки.
 * ___________________________________________________________________________
 * Декоратор позволяет оборачивать объекты бесчисленное количество раз благодаря тому, что и обёртки, и реальные оборачиваемые объекты
 * имеют общий интерфейс.
 * ___________________________________________________________________________
 * Применимость
 * - Когда вам нужно добавлять обязанности объектам на лету, незаметно для кода, который их использует.
 * - Когда нельзя расширить обязанности объекта с помощью наследования.
 */

interface IMessenger {
  sendMessage: (topicId, message: string) => void;
}

class Messenger implements IMessenger {
  constructor(private http: any) {}

  sendMessage(topicId, message: string) {
    console.log(`Messenger. Send request to topic ${topicId} message: ${message}`);
    //  send logic
  }
}

// классическая ООП-я реализация
class MessengerBaseDecorator implements IMessenger {
  constructor(protected messenger: IMessenger) {}

  sendMessage(topicId, message: string): void {
    this.messenger.sendMessage(topicId, message);
  }
}

class MessengerEncryptedDecorator extends MessengerBaseDecorator {
  constructor(protected messenger: IMessenger) {
    super(messenger);
  }

  sendMessage(topicId, message: string): void {
    const encryptedMessage = btoa(message);
    this.messenger.sendMessage(topicId, encryptedMessage);
  }
}

class MessengerLoggedDecorator extends MessengerBaseDecorator {
  constructor(protected messenger: IMessenger) {
    super(messenger);
  }

  sendMessage(topicId, message: string): void {
    console.log(`In topic ${topicId} was send message: ${message}.`);
    this.messenger.sendMessage(topicId, message);
    // возможно доп. логирование после отправки
  }
}

// вариант без базового класса
// export class MessengerEncryptedDecorator implements IMessenger {
//   constructor(protected messenger: IMessenger) {
//   }
//
//   sendMessage(topicId, message: string): void {
//     const encryptedMessage = btoa(message);
//     this.messenger.sendMessage(topicId, encryptedMessage);
//   }
// }
//
// export class MessengerLoggedDecorator implements IMessenger {
//   constructor(protected messenger: IMessenger) {}
//
//   sendMessage(topicId, message: string): void {
//     console.log(`In topic ${topicId} was send message: ${message}.`);
//     this.messenger.sendMessage(topicId, message);
//       // возможно доп. логирование после отправки
//   }
// }

class UsageExample {
  private messenger: IMessenger;

  public main() {
    this.messenger = new Messenger('httpObject');
    this.messenger.sendMessage('1', 'first message');

    const loggedMessenger: IMessenger = new MessengerLoggedDecorator(this.messenger);
    loggedMessenger.sendMessage('2', 'second loggable message');

    const encryptedMessenger: IMessenger = new MessengerEncryptedDecorator(loggedMessenger);
    encryptedMessenger.sendMessage('3', 'third loggable and encrypted message');
  }
}

// фронтовая реализация. См. https://js.plainenglish.io/the-decorator-design-pattern-in-javascript-6aee27837dbd
// требует подключения babel плагинов: https://babeljs.io/docs/en/babel-plugin-proposal-decorators#legacy

export class Messenger2 implements IMessenger {
  constructor(private http: any) {}

  @LoggedDecorator
  sendMessage(topicId, message: string) {
    console.log(`Messenger2. Send request to topic ${topicId} message: ${message}`);
    //  send logic
  }
}

const LoggedDecorator = (object, property, description) => {
  console.log('object = ', object);
  console.log('description = ', description);

  const originalFunction = description.value;

  description.value = (...args) => {
    // console.log(`Send request to url: ${url} with params: ${params} and headers: ${headers}`);
    console.log(`Send request with args: ${args}`);
    originalFunction(...args);
  };
};
