/**
 * Chain of Responsibility (Цепочка обязанностей) — это поведенческий паттерн проектирования,
 * который позволяет передавать запросы последовательно по цепочке обработчиков.
 * Каждый последующий обработчик решает, может ли он обработать запрос сам и стоит ли передавать запрос дальше по цепи.
 *
 * Преимущества
 * - Уменьшает зависимость между клиентом и обработчиками.
 * - Реализует принцип единственной обязанности.
 * - Реализует принцип открытости/закрытости.
 *
 * ___________________________________________________________________________
 * Цепочка обязанностей и Декоратор имеют очень похожие структуры. Оба паттерна базируются на принципе рекурсивного выполнения операции
 * через серию связанных объектов. Но есть и несколько важных отличий:
 *
 * Обработчики в Цепочке обязанностей могут выполнять произвольные действия, независимые друг от друга, а также в любой момент прерывать
 * дальнейшую передачу по цепочке. В то время как, Декораторы расширяют какое-то определённое действие, не ломая интерфейс базовой операции
 * и не прерывая выполнение остальных декораторов.
 * ___________________________________________________________________________
 * Применимость
 * - Когда программа должна обрабатывать разнообразные запросы несколькими способами, но заранее неизвестно,
 * какие конкретно запросы будут приходить и какие обработчики для них понадобятся.
 * - Когда важно, чтобы обработчики выполнялись один за другим в строгом порядке.
 * - Когда набор объектов, способных обработать запрос, должен задаваться динамически.
 */

import { DateTimeService } from '../structural/facade';

interface Period {
  dateFormat: string;
  startDate: string;
  endDate?: string;
}

enum PeriodCheckId {
  PeriodDatesFormatChecker = 'PeriodDatesFormatChecker',
  PeriodDatesRequiredChecker = 'PeriodDatesRequiredChecker',
  StartDateAfterEndDateChecker = 'StartDateAfterEndDateChecker',
  StartDateRequiredChecker = 'StartDateRequiredChecker',
  EndDateRequiredChecker = 'EndDateRequiredChecker',
}

enum PeriodErrorId {
  PeriodDatesFormatError = 'PeriodDatesFormatError',
  PeriodDatesRequiredError = 'PeriodDatesRequiredError',
  StartDateAfterEndDateError = 'StartDateAfterEndDateError',
  StartDateRequiredError = 'StartDateRequiredError',
  EndDateRequiredError = 'EndDateRequiredError',
}

interface PeriodChecker {
  setNext(checker: PeriodChecker): PeriodChecker;

  check(periodCheckIds: PeriodCheckId[], period: Period, params?: any): boolean | PeriodErrorId | PeriodChecker;
}

abstract class PeriodBaseChecker implements PeriodChecker {
  private nextChecker: PeriodChecker;

  public setNext(checker: PeriodChecker): PeriodChecker {
    this.nextChecker = checker;
    return checker;
  }

  public check(periodCheckIds: PeriodCheckId[], period: Period, params?: any) {
    if (this.nextChecker) {
      return this.nextChecker.check(periodCheckIds, period, params);
    }

    return true; // по дефолту считаем, что период валидный
  }
}

class PeriodDatesFormatChecker extends PeriodBaseChecker {
  constructor(protected dateTimeService: DateTimeService) {
    super();
  }

  public check(periodCheckIds: PeriodCheckId[], period: Period, params?: any) {
    if (periodCheckIds.find((id) => PeriodCheckId.PeriodDatesFormatChecker) && !this.isDatesFormatValid(period)) {
      return PeriodErrorId.PeriodDatesFormatError;
    }
    return super.check(periodCheckIds, period, params);
  }

  private isDatesFormatValid(period: Period): boolean {
    return (
      this.dateTimeService.isDateMatchToFormat(period.startDate, period.dateFormat) &&
      this.dateTimeService.isDateMatchToFormat(period.endDate, period.dateFormat)
    );
  }
}

class PeriodDatesRequiredChecker extends PeriodBaseChecker {
  constructor(protected dateTimeService: DateTimeService) {
    super();
  }

  public check(periodCheckIds: PeriodCheckId[], period: Period, params?: any) {
    if (
      periodCheckIds.find((id) => PeriodCheckId.PeriodDatesRequiredChecker) &&
      (!this.hasDate(period, 'startDate') || !this.hasDate(period, 'endDate'))
    ) {
      return PeriodErrorId.PeriodDatesRequiredError;
    }

    return super.check(periodCheckIds, period, params);
  }

  protected hasDate(period: Period, fieldName: string): boolean {
    return !!period[fieldName];
  }
}

class StartDateAfterEndDateChecker extends PeriodDatesRequiredChecker {
  constructor(protected dateTimeService: DateTimeService) {
    super(dateTimeService);
  }

  public check(periodCheckIds: PeriodCheckId[], period: Period, params?: any) {
    if (
      periodCheckIds.find((id) => PeriodCheckId.StartDateAfterEndDateChecker) &&
      (!this.hasDate(period, 'startDate')
        || !this.hasDate(period, 'endDate')
        || !this.dateTimeService.isAfter(period.endDate, period.startDate))
    ) {
      return PeriodErrorId.StartDateAfterEndDateError;
    }

    return super.check(periodCheckIds, period, params);
  }
}


class UsageExample {
  // формируем нужную цепочку можно вынести в отдельный класс с методом buildChain(checkers: PeriodCheckId[]): PeriodCheckId
  private dateTimeService = new DateTimeService();
  private periodDatesFormatChecker = new PeriodDatesFormatChecker(this.dateTimeService);
  private periodDatesRequiredChecker = new PeriodDatesRequiredChecker(this.dateTimeService);
  private startDateAfterEndDateChecker = new StartDateAfterEndDateChecker(this.dateTimeService);
  private checksIds: PeriodCheckId[] = [
    PeriodCheckId.PeriodDatesRequiredChecker,
    PeriodCheckId.PeriodDatesFormatChecker,
    PeriodCheckId.StartDateAfterEndDateChecker,
  ];

  public mainConstructor() {
    this.periodDatesRequiredChecker.setNext(this.periodDatesFormatChecker).setNext(this.startDateAfterEndDateChecker);

    // В методе сохранения вызываем:
    this.checkPeriod();
    debugger;
  }

  private checkPeriod() {
    const period: Period = {
      startDate: '19.11.2021',
      endDate: '29.11.2020',
      dateFormat: this.dateTimeService.getDateTimeFormats().DATE_RUS_FORMAT,
    };
    const checkResult = this.periodDatesRequiredChecker.check(this.checksIds, period);
    console.info('period = ', period);
    console.info('checkResult = ', checkResult);
  }
}
