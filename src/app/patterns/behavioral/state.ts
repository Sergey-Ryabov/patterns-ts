/**
 * State (Состояние) — это поведенческий паттерн, позволяющий динамически изменять поведение объекта при смене его состояния.
 * Поведения, зависящие от состояния, переезжают в отдельные классы.
 * Первоначальный класс хранит ссылку на один из таких объектов-состояний и делегирует ему работу.
 *
 * Преимущества
 * - Избавляет от множества больших условных операторов машины состояний.
 * - Концентрирует в одном месте код, связанный с определённым состоянием.
 * - Упрощает код контекста.
 *
 * ___________________________________________________________________________
 * Состояние можно рассматривать как надстройку над Стратегией.
 * Оба паттерна используют композицию, чтобы менять поведение основного объекта,
 * делегируя работу вложенным объектам-помощникам.
 * Однако в Стратегии эти объекты не знают друг о друге и никак не связаны.
 * В Состоянии сами конкретные состояния могут переключать контекст.
 * ___________________________________________________________________________
 * Применимость
 * - Когда есть объект, поведение которого кардинально меняется в зависимости от внутреннего состояния, причём типов состояний много,
 * и их код часто меняется.
 *
 * - Когда код класса содержит множество больших, похожих друг на друга, условных операторов, которые выбирают поведения в зависимости
 * от текущих значений полей класса.
 *
 * - Когда вы сознательно используете табличную машину состояний, построенную на условных операторах, но вынуждены мириться с
 * дублированием кода для похожих состояний и переходов.
 */
import { Input, OnInit } from '@angular/core';

class Context {
  private state: State;

  constructor(state: State) {
    this.transitionTo(state);
  }

  /**
   * Контекст позволяет изменять объект Состояния во время выполнения.
   */
  public transitionTo(state: State): void {
    this.state = state;
    this.state.setContext(this);
  }

  public deleteDoc(): void {
    this.state.deleteDoc();
  }

  public addDoc(): void {
    this.state.addDoc();
  }
}

abstract class State {
  protected context: Context;

  public setContext(context: Context) {
    this.context = context;
  }

  public abstract deleteDoc(): void;

  public abstract addDoc(): void;

  public abstract downloadDoc(): void;

  public abstract moveDocToArchive(): void;
}

class NewDocState extends State {
  addDoc(): void {
    console.info('addDoc');
  }

  deleteDoc(): void {
    console.info('deleteDoc');
  }

  downloadDoc(): void {
    console.info('downloadDoc');
  }

  moveDocToArchive(): void {
    console.info('moveDocToArchive');
    this.context.transitionTo(new ArchivedDocState());
  }
}

class ArchivedDocState extends State {
  addDoc(): void {
    throw Error('You can NOT add doc in archived state');
  }

  deleteDoc(): void {
    throw Error('You can NOT delete doc in archived state');
  }

  downloadDoc(): void {
    console.info('downloadDoc');
  }

  moveDocToArchive(): void {
    throw Error('Doc already in archive');
  }
}

class CardComponent implements OnInit {
  @Input() id;

  private context;

  ngOnInit() {
    const currentState = this.getDocState(this.id);
    this.context = new Context(currentState);
  }

  public getDocState(id) {
    // обработка запроса сервера. Предположим, что в ответ пришёл "archived"
    const state = 'archived';

    switch (state) {
      case 'archived':
        return new ArchivedDocState();

      default:
        return new NewDocState();
    }
  }
}
