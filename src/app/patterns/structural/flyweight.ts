/**
 * Flyweight (Cache) — это структурный паттерн проектирования, который позволяет вместить бóльшее количество объектов в отведённую
 * оперативную память.
 * Легковес экономит память, разделяя общее состояние объектов между собой, вместо хранения одинаковых данных в каждом объекте.
 * ___________________________________________________________________________
 * Паттерн Легковес может напоминать Одиночку, если для конкретной задачи у вас получилось свести количество объектов к одному.
 * Но помните, что между паттернами есть два кардинальных отличия:
 * - В отличие от Одиночки, вы можете иметь множество объектов-легковесов.
 * - Объекты-легковесы должны быть неизменяемыми, тогда как объект-одиночка допускает изменение своего состояния.
 * ___________________________________________________________________________
 * Применимость
 * - Когда не хватает оперативной памяти для поддержки всех нужных объектов. Условия для применения:
 * 1. в приложении используется большое число объектов;
 * 2. из-за этого высоки расходы оперативной памяти;
 * 3. большую часть состояния объектов можно вынести за пределы их классов;
 * 4. большие группы объектов можно заменить относительно небольшим количеством разделяемых объектов, поскольку внешнее состояние вынесено.
 */
import { Injectable } from '@angular/core';

export interface IIconConfig {
  className: string;
  size?: string;
  color?: string;
  title?: string;
  width?: string;
}

@Injectable()
export class ImageService {
  public getStateIconFlyweight(stateCode: number): IIconConfig {
    if (this.getStateIconFlyweight[stateCode]) {
      return this.getStateIconFlyweight[stateCode];
    }
    const iconConfig: IIconConfig = {
      color: '',
      className: '',
      title: '',
    };
    switch (stateCode) {
      case 0: {
        iconConfig.className = 'icon-not_available';
        this.getStateIconFlyweight[stateCode] = iconConfig;
        break;
      }
      case 1: {
        iconConfig.className = 'icon-available';
        this.getStateIconFlyweight[stateCode] = iconConfig;
        break;
      }
      case 2: {
        iconConfig.className = 'icon-not_show';
        this.getStateIconFlyweight[stateCode] = iconConfig;
        break;
      }
      default:
        this.getStateIconFlyweight[stateCode] = iconConfig;
    }
    Object.freeze(iconConfig); // запрещаем изменение объекта
    return iconConfig;
  }
}
