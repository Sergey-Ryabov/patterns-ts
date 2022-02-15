/**
 * Proxy — это структурный паттерн проектирования, который позволяет подставлять вместо реальных объектов специальные объекты-заменители.
 * Эти объекты перехватывают вызовы к оригинальному объекту, позволяя выполнить какую-нибудь функцию:
 * контроль доступа, кеширование, изменение запроса и прочее, до или после передачи вызова оригиналу.
 * ___________________________________________________________________________
 * Заместитель имеет тот же интерфейс, что и реальный объект, поэтому для клиента нет разницы — работать через заместителя или напрямую.
 *
 * В отличие от Фасада, Заместитель имеет тот же интерфейс, что его служебный объект, благодаря чему их можно взаимозаменять.
 *
 * Декоратор и Заместитель имеют схожие структуры, но разные назначения.
 * Они похожи тем, что оба построены на принципе композиции и делегируют работу другим объектам.
 * Паттерны отличаются тем, что Заместитель сам управляет жизнью сервисного объекта, а обёртывание Декораторов контролируется клиентом.
 * ___________________________________________________________________________
 * Применимость
 * - Когда настоящий сервисный объект находится на удалённом сервере (Локальный запуск сервиса (удалённый прокси))
 * - Когда требуется хранить историю обращений к сервисному объекту (Логирование запросов (логирующий прокси))
 * - Когда нужно кешировать результаты запросов клиентов и управлять их жизненным циклом Кеширование объектов («умная» ссылка)
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

class MessengerLoggedProxy implements IMessenger {
  private messenger: Messenger;

  sendMessage(topicId, message: string) {
    if (!this.messenger) {
      this.messenger = new Messenger('httpObject');
    }
    console.log(`In topic ${topicId} was send message: ${message}.`);
    this.messenger.sendMessage(topicId, message);
    // возможно доп. логирование после отправки
  }
}

class MessengerEncryptedProxy implements IMessenger {
  private messenger: Messenger;

  sendMessage(topicId, message: string) {
    if (!this.messenger) {
      this.messenger = new Messenger('httpObject');
    }
    const encryptedMessage = btoa(message);
    this.messenger.sendMessage(topicId, encryptedMessage);
  }
}

class MessengerPrivateProxy implements IMessenger {
  private messenger: Messenger;

  sendMessage(topicId, message: string) {
    if (this.hasAccess(topicId)) {
      if (!this.messenger) {
        this.messenger = new Messenger('httpObject');
      }
      const encryptedMessage = btoa(message);
      this.messenger.sendMessage(topicId, encryptedMessage);
    }
  }

  hasAccess(topicId): boolean {
    // некоторая логика для проверки доступа к топику
    return false;
  }
}

class UsageExample {
  public main() {
    const encryptedMessenger: IMessenger = new MessengerEncryptedProxy();
    encryptedMessenger.sendMessage('1', 'first encrypted message');

    const privateMessenger: IMessenger = new MessengerPrivateProxy();
    privateMessenger.sendMessage('2', 'second message to private topic');
  }
}


// Native js Proxy:
// arrays (typed):
const numbers = [1, 2, 3];
const numbersProxy = new Proxy(numbers, {
  get(target, prop) {
    return prop in target ? target[prop] : 0;
  },
});

// objects (runtime private fields):
const personObject = { name: 'Petr', _password: '***' };
const userProxy = new Proxy(personObject, {
  get(target, prop: string) {
    if (prop.startsWith('_')) {
      throw new Error('Отказано в доступе');
    } else {
      const value = target[prop];
      return typeof value === 'function' ? value.bind(target) : value;
    }
  },
  set(target, prop: string, value) {
    if (prop.startsWith('_')) {
      throw new Error('Отказано в доступе');
    } else {
      target[prop] = value;
      return true;
    }
  },
  deleteProperty(target, prop: string): boolean {
    if (prop.startsWith('_')) {
      throw new Error('Отказано в доступе');
    } else {
      delete target[prop];
      return true;
    }
  },
  ownKeys(target) {
    return Object.keys(target).filter((key) => !key.startsWith('_'));
  },
  has(target, prop: string) {
    return prop in target && !prop.startsWith('_');
  },
});

// functions :
function delay(f, ms) {
  return new Proxy(f, {
    apply(target, thisArg, args) {
      // может присутствовать логика по проверке доступа, кэшированию или логированию до вызова реальной функции
      setTimeout(() => target.apply(thisArg, args), ms);
    }
  });
}


// + нативный js Proxy: https://learn.javascript.ru/proxy
