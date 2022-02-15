/**
 * Observer (наблюдатель)  — это поведенческий паттерн проектирования,
 * который создаёт механизм подписки, позволяющий одним объектам следить и реагировать на события, происходящие в других объектах.
 *
 * Преимущества
 * - Observable не зависят от конкретных классов подписчиков и наоборот.
 * - Можно подписывать и отписывать получателей на лету.
 * - Реализует принцип открытости/закрытости.
 *
 * ___________________________________________________________________________
 * Применимость
 * - когда после изменения состояния одного объекта требуется что-то сделать в других, но вы не знаете наперёд,
 * какие именно объекты должны отреагировать.
 * - когда одни объекты должны наблюдать за другими, но только в определённых случаях.
 */
import { HttpClient } from '@angular/common/http';

interface Observer {
  update(event);
}

interface Subscription {
  id: number;
}

interface Subject {
  subscribe: (o: Observer) => Subscription;
  unsubscribe: (s: Subscription) => void;
  notify: (event) => any;
}

class EventManager implements Subject {
  private observers: Map<number, Observer> = new Map<number, Observer>();

  public subscribe(o: Observer): Subscription {
    const now = new Date().getTime();
    this.observers.set(now, o);
    return {
      id: now,
    };
  }

  public unsubscribe(s: Subscription) {
    this.observers.delete(s.id);
  }

  public notify(event) {
    this.observers.forEach((o) => {
      o.update(event);
    });
  }
}

class DataService {
  private eventManager: EventManager = new EventManager();

  constructor(private httpClient: HttpClient) {}

  public updateData() {
    this.httpClient.get(`url-for-get-data`).subscribe((data) => {
      this.eventManager.notify(data);
    });
  }

  public subscribeToNewData(o: Observer): Subscription {
    return this.eventManager.subscribe(o);
  }

  public unsubscribe(s: Subscription): void {
    return this.eventManager.unsubscribe(s);
  }
}
