import { Injectable, isDevMode } from '@angular/core';

/**
 * Singleton — это порождающий паттерн, который гарантирует существование только одного объекта определённого класса,
 * а также позволяет достучаться до этого объекта из любого места программы.
 * ___________________________________________________________________________
 * Все классы — Одиночки имеют приватное статичное поле instance (private static instance), которое инициализируется в конструкторе или
 * в отдельном методе при этом конструктор приватный.
 * Одиночка имеет такие же преимущества и недостатки, что и глобальные переменные.
 * Его невероятно удобно использовать, но он нарушает модульность вашего кода.
 * ___________________________________________________________________________
 * Применимость
 * - Когда в программе должен быть единственный экземпляр какого-то класса, доступный всем клиентам
 * (например, общий доступ к базе данных из разных частей программы).
 * - Когда вам хочется иметь больше контроля над глобальными переменными.
 */

/**
 * Интерфейс логирования событий/объектов в проекте
 */
export interface Logger {
  dir(obj: any): void;

  error(message?: any, ...optionalParams: any[]): void;

  info(message?: any, ...optionalParams: any[]): void;

  log(message?: any, ...optionalParams: any[]): void;

  trace(message?: any, ...optionalParams: any[]): void;

  warn(message?: any, ...optionalParams: any[]): void;
}

/**
 * Сервис записи событий/объектов в консоль браузера для Dev сборки
 */
@Injectable()
export class SingletonLoggerService implements Logger {
  // используется/инжектится, как обычный сервис

  private static instance: Logger;

  constructor() {
    if (!SingletonLoggerService.instance) {
      SingletonLoggerService.instance = this;
    }
    return SingletonLoggerService.instance;
  }

  public log(message?: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.log(message, optionalParams);
    }
  }

  dir(obj: any): void {
    if (isDevMode()) {
      console.dir(obj);
    }
  }

  error(message?: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.error(message, optionalParams);
    }
  }

  info(message?: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.info(message, optionalParams);
    }
  }

  trace(message?: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.trace(message, optionalParams);
    }
  }

  warn(message?: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.warn(message, optionalParams);
    }
  }
}

// классическая реализация
export class SingletonLogger implements Logger {
  // пример использования: private logger: Logger = SingletonLoggerService.getInstance();

  private static instance: Logger;

  private constructor() {}

  public static getInstance(): SingletonLogger {
    if (!SingletonLogger.instance) {
      SingletonLogger.instance = new SingletonLogger();
    }

    return SingletonLogger.instance;
  }

  public log(message?: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.log(message, optionalParams);
    }
  }

  dir(obj: any): void {
    if (isDevMode()) {
      console.dir(obj);
    }
  }

  error(message?: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.error(message, optionalParams);
    }
  }

  info(message?: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.info(message, optionalParams);
    }
  }

  trace(message?: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.trace(message, optionalParams);
    }
  }

  warn(message?: any, ...optionalParams: any[]): void {
    if (isDevMode()) {
      console.warn(message, optionalParams);
    }
  }
}
