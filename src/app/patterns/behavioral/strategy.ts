/**
 * Strategy (стратегия)  — это поведенческий паттерн, который выносит набор алгоритмов в собственные классы и делает их взаимозаменимыми.
 *
 * Другие объекты содержат ссылку на объект-стратегию и делегируют ей работу.
 * Программа может подменить этот объект другим, если требуется иной способ решения задачи.
 *
 * Преимущества
 * - Горячая замена алгоритмов на лету.
 * - Изолирует код и данные алгоритмов от остальных классов.
 * - Уход от наследования к делегированию.
 * - Реализует принцип открытости/закрытости.
 *
 * ___________________________________________________________________________
 * Стратегия меняет поведение объекта «изнутри», а Декоратор изменяет его «снаружи».
 *
 * Шаблонный метод использует наследование, чтобы расширять части алгоритма.
 * Стратегия использует делегирование, чтобы изменять выполняемые алгоритмы на лету.
 * Шаблонный метод работает на уровне классов. Стратегия позволяет менять логику отдельных объектов.
 * ___________________________________________________________________________
 * Применимость
 * - когда вам нужно использовать разные вариации какого-то алгоритма внутри одного объекта.
 * - когда у вас есть множество похожих классов, отличающихся только некоторым поведением.
 * - когда вы не хотите обнажать детали реализации алгоритмов для других классов.
 * - когда различные вариации алгоритмов реализованы в виде развесистого условного оператора.
 * Каждая ветка такого оператора представляет собой вариацию алгоритма.
 */
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

class MyNavigator {
  private routeStrategy: RouteStrategy;

  constructor() {}

  public buildRoute(a, b) {
    this.routeStrategy.buildRoute(a, b);
  }

  public setStrategy(routeStrategy: RouteStrategy) {
    this.routeStrategy = routeStrategy;
  }
}

interface RouteStrategy {
  buildRoute(a, b);
}

class CarStrategy implements RouteStrategy {
  public buildRoute(a, b) {
    //  build route for car
  }
}

class WalkingStrategy implements RouteStrategy {
  public buildRoute(a, b) {
    //  build route for pedestrian
  }
}

class PublicTransportStrategy implements RouteStrategy {
  public buildRoute(a, b) {
    //  build route for public Transport
  }
}

enum RouteType {
  Car,
  PublicTransport,
  Walking,
}

function client(selectedRouteType: RouteType) {
  const myNavigator = new MyNavigator();
  const a = { x: 1, y: 1 };
  const b = { x: 2, y: 2 };
  switch (selectedRouteType) {
    case RouteType.Car: {
      myNavigator.setStrategy(new CarStrategy());
      break;
    }
    case RouteType.PublicTransport: {
      myNavigator.setStrategy(new PublicTransportStrategy());
      break;
    }
    case RouteType.Walking: {
      myNavigator.setStrategy(new WalkingStrategy());
      break;
    }
  }

  myNavigator.buildRoute(a, b);
}

// angular use case with static context

export interface ISignConfig {
  availableForSignIds: number[];
  selectedDocsCount: number;
}

abstract class SignatureReportsService {
  public abstract getSignConfig(selectedRows: any[]): Observable<ISignConfig>;
}

class FirstPageSignatureReportsService {
  public getSignConfig(selectedRows: any[]): ISignConfig {
    const availableForSignIds = selectedRows
      .filter((item) => item?.reportMonth?.state?.code === 'FirstPageStatus')
      .map((point) => point.reportMonth.id);

    return {
      availableForSignIds,
      selectedDocsCount: selectedRows.length,
    };
  }
}

class SecondPageSignatureReportsService {
  public getSignConfig(selectedRows: any[]): ISignConfig {
    const availableForSignIds = selectedRows
      .filter((item) => item?.reportMonth?.stateCode === 'SecondPageStatus')
      .map((point) => point.reportMonth.id);

    return {
      availableForSignIds,
      selectedDocsCount: selectedRows.length,
    };
  }
}

@Component({
  template: `FirstPageComponent`,
  providers: [{ provide: SignatureReportsService, useClass: FirstPageSignatureReportsService }],
})
export class FirstPageComponent {
  constructor(private signatureReportsService: SignatureReportsService) {}

  public getSingConfig() {
    const selectedRows = [];
    return this.signatureReportsService.getSignConfig(selectedRows);
  }
}

@Component({
  template: `SecondPageComponent`,
  providers: [{ provide: SignatureReportsService, useClass: FirstPageSignatureReportsService }],
})
export class SecondPageComponent {
  constructor(private signatureReportsService: SignatureReportsService) {}

  public getSingConfig() {
    const selectedRows = [];
    return this.signatureReportsService.getSignConfig(selectedRows);
  }
}
