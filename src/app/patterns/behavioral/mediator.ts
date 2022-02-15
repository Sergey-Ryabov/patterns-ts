/**
 * Mediator / Controller (Посредник) — это поведенческий паттерн проектирования, который позволяет уменьшить связанность
 * множества классов между собой, благодаря перемещению этих связей в один класс-посредник.
 * Такии образом, данный паттерн упрощает коммуникацию между компонентами системы.
 *
 * Преимущества
 * - Централизует управление в одном месте.
 * - Устраняет зависимости между компонентами, позволяя повторно их использовать.
 * - Упрощает взаимодействие между компонентами.
 *
 * ___________________________________________________________________________
 * Посредник убирает прямую связь между компонентами, заставляя их взаимодействовать через себя
 * ___________________________________________________________________________
 * Применимость
 * - Когда сложно менять некоторые классы из-за того, что они имеют множество хаотичных связей с другими классами.
 * - Когда вы не можете повторно использовать класс, поскольку он зависит от уймы других классов.
 * - Когда вам приходится создавать множество подклассов компонентов, чтобы использовать одни и те же компоненты в разных контекстах.
 */
import { Injectable } from '@angular/core';

// например есть сложный компонент карточки, части которых вынесены в компоненты: FirstTabInCard и SecondTabInCard

class CardComponent {}

class FirstTabInCardComponent {
  constructor(private firstTabInCardService: FirstTabInCardService) {}
}

class SecondTabInCardComponent {
  constructor(private secondTabInCardService: SecondTabInCardService) {}

  // используем метод, например, чтобы показать/скрыть определённый блок в шаблоне на основании заполнения данных из первой табы
  public canShowSomeData() {
    return this.secondTabInCardService.canShowSomeData();
  }
}

@Injectable()
class CardService {
  constructor(private cardMediatorService: CardMediatorService) {}
}

@Injectable()
class FirstTabInCardService {
  constructor(private cardMediatorService: CardMediatorService) {}
}

@Injectable()
class SecondTabInCardService {
  constructor(private cardMediatorService: CardMediatorService) {}

  public canShowSomeData() {
    return this.cardMediatorService.canShowSomeData();
  }
}

@Injectable()
class CardMediatorService {
  private cardData: any; // данные всей карточки из компонентов: FirstTabInCard и SecondTabInCard

  public canShowSomeData() {
    return this.cardData.anyDataFromFirstComponent === true;
  }
}
