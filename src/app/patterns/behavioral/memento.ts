/**
 * Memento (Снимок) — это поведенческий паттерн, позволяющий делать снимки внутреннего состояния объектов, а затем восстанавливать их.
 * При этом Снимок не раскрывает подробностей реализации объектов, и клиент не имеет доступа к защищённой информации объекта.
 *
 * Преимущества
 * - Не нарушает инкапсуляции исходного объекта.
 * - Упрощает структуру исходного объекта. Ему не нужно хранить историю версий своего состояния.
 *
 * Недостатки:
 * - Может вызвать проблему заполнения памяти, если создаётся много снимков или не освобождаются ресурсы от неиспользуемых снимков
 * ___________________________________________________________________________
 * Снимок иногда можно заменить Прототипом, если объект, состояние которого требуется сохранять в истории, довольно простой,
 * не имеет активных ссылок на внешние ресурсы либо их можно легко восстановить.
 *
 * Снимок можно использовать вместе с Итератором, чтобы сохранить текущее состояние обхода структуры данных и вернуться к нему в будущем,
 * если потребуется.
 *
 * Команду и Снимок можно использовать сообща для реализации отмены операций. В этом случае объекты команд будут отвечать за выполнение
 * действия над объектом, а снимки будут хранить резервную копию состояния этого объекта, сделанную перед самым запуском команды.
 *
 * ___________________________________________________________________________
 * Применимость
 * - Когда нужно сохранять мгновенные снимки состояния объекта (или его части),
 *  чтобы впоследствии объект можно было восстановить в том же состоянии.
 *
 * - Когда прямое получение состояния объекта раскрывает приватные детали его реализации, нарушая инкапсуляцию.
 */

import { Injectable, Input, OnInit } from '@angular/core';

interface ICardMemento {
  getCardData(): any;

  getMementoDate(): any;
}

class CardMemento implements ICardMemento {
  private cardData: any;
  private date: Date;

  constructor(cardData: any) {
    this.cardData = cardData;
    this.date = new Date();
  }

  getCardData(): any {
    return this.cardData;
  }

  getMementoDate(): any {
    return this.date;
  }
}

class CardComponent implements OnInit {
  @Input() id;

  private cardData;

  constructor(private cardService: CardService) {}

  ngOnInit() {
    this.cardData = this.cardService.getCardData(this.id);
  }

  public backup(): void {
    this.cardService.backup(new CardMemento(this.cardData));
  }

  public undo(): void {
    this.cardData = this.cardService.undo().getCardData();
  }

  public getChangesHistory(): ICardMemento[] {
    return this.cardService.getChangesHistory();
  }
}

@Injectable()
class CardService {
  private cardMementos: ICardMemento[] = [];

  public getCardData(id): any {
    // получаем данные карточки
    return {
      name: 'someName',
      serialNumber: 123,
      date: new Date(),
    };
  }

  public backup(cardMemento: ICardMemento): void {
    this.cardMementos.push(cardMemento);
  }

  public undo(): ICardMemento {
    if (!this.cardMementos.length) {
      return;
    }
    return this.cardMementos.pop();
  }

  public getChangesHistory(): ICardMemento[] {
    return this.cardMementos;
  }
}
