/**
 * Facade — это структурный паттерн проектирования, который предоставляет простой интерфейс к
 * сложной системе классов, библиотеке или фреймворку.
 * ___________________________________________________________________________
 * Фасад позволяет снизить общую сложность программы, он также помогает вынести код, зависимый от внешней системы в единственное место.
 * ___________________________________________________________________________
 * Применимость
 * - Когда вам нужно представить простой или урезанный интерфейс к сложной подсистеме.
 * - Когда вы хотите разложить подсистему на отдельные слои.
 */

import { Injectable } from '@angular/core';
import * as momentImported from 'moment-timezone';
import { unitOfTime } from 'moment-timezone';

const moment = momentImported; // import * as moment from 'moment-timezone';

// интерфейс для выбранной даты и времени
export interface ISelectedDateTime {
  year: number; // Выбранный год. Если не передан, то присваивается текущий
  month: number; // Выбранный месяц. Если не передан, то присваивается текущий
  day: number; // Выбранный день. Если не передан, то присваивается текущий
  hours?: number; // Выбранные часы. Если не передан, то присваивается текущий
  minutes?: number; // Выбранные минуты. Если не передан, то присваивается текущий
  seconds?: number; // Выбранные секунды. Если не передан, то присваивается текущий
}

// интерфейс для выбранного диапазона дат
export interface IDateRange {
  left: string;
  right: string;
}

export enum TimeUnit {
  YEARS = 'years',
  QUARTERS = 'quarters',
  MONTHS = 'months',
  WEEKS = 'weeks',
  DAYS = 'days',
  HOURS = 'hours',
  MINUTES = 'minutes',
  SECONDS = 'seconds',
  MILLISECONDS = 'milliseconds',
}

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  public readonly DATE_ISO_REG_EXP = /\d\d\d\d-\d\d-\d\d/; // YYYY-MM-DD
  public readonly DATETIME_ISO_8601_REG_EXP = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d/; // YYYY-MM-DDTHH:mm:ss.SSS
  public readonly DIGIT_REG_EXP = /\d/;
  public readonly DATE_TIME_SEPARATOR = ' ';
  public readonly DATE_SEPARATOR = '.';
  public readonly TIME_SEPARATOR = ':';
  public readonly MIN_MONTH = 0;
  public readonly MAX_MONTH = 11; // в Date отсчёт идёт с 0, поэтому маскимальный индекс месяца 11
  public readonly MAX_HOUR = 23;
  public readonly MAX_MINUTE_AND_SECOND = 59;
  public readonly MIN_HOUR_MINUTE_SECOND = 0;
  private readonly MONTHS: string[];
  private readonly GENETIVE_MONTHS: string[];
  private readonly WEEK_DAYS: string[];
  private readonly MONTH_NUMBER_NOT_EXIST_STR_ERROR: string;
  private readonly MONTH_NUMBER_NOT_CORRECT_STR_ERROR: string;
  private DATE_TIME_FORMATS = {
    DATE_RUS_FORMAT: 'DD.MM.YYYY',
    DATE_RUS_FORMAT_WITH_SECONDS: 'DD.MM.YYYY HH:mm:ss',
    DATETIME_RUS: 'DD.MM.YYYY HH:mm',
    DATETIME_ISO_8601: 'YYYY-MM-DDT00:00:00.000',
    DATETIME_ISO_8601_CONSIDER_TIME: 'YYYY-MM-DDTHH:mm:ss.SSS',
    DATETIME_ISO_8601_CONSIDER_TIME_WITH_TIMEZONE_OFFSET: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    DATETIME_ISO_8601_WITH_Z: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    DAY_AND_MONTH_RUS: 'DD.MM',
    MONTH_AND_YEAR_RUS: 'MM.YYYY',
    TIME_MINUTES: 'HH:mm',
    TIME_MINUTES_SEC: 'HH:mm:ss',
    YEAR: 'YYYY',
    ISO_DATE: 'YYYY-MM-DD',
    ISO_DATE_WITH_TIME: 'YYYY-MM-DD HH:mm',
    ISO_DATE_WITH_TIME_WITH_SEC: 'YYYY-MM-DD HH:mm:ss',
    DATE_RUS_FORMAT_FOR_DATE: 'MM.DD.YYYY',
    DATE_RUS_FORMAT_WITH_TIME_FOR_DATE: 'MM.DD.YYYY HH:mm',
  };
  private DATE_TIME_FORMATS_FOR_TEXT_MASK_COMPONENT = {
    DATE_RUS_FORMAT: 'dd.mm.yyyy',
    DATE_RUS_FORMAT_WITH_SECONDS: 'dd.mm.yyyy HH:MM:SS',
    DATETIME_RUS: 'dd.mm.yyyy HH:MM',
    DAY_AND_MONTH_RUS: 'dd.mm',
    MONTH_AND_YEAR_RUS: 'mm.yyyy',
    TIME_MINUTES: 'HH:MM',
    YEAR: 'yyyy',
    ISO_DATE: 'yyyy-mm-dd',
  };
  private UNIT_OF_TIME_MAP = {
    YEAR: 'year',
    MONTH: 'month',
    WEEK: 'week',
    ISO_WEEK: 'isoWeek',
    DAY: 'day',
    HOUR: 'hour',
    MINUTE: 'minute',
    SECOND: 'second',
  };
  private DATE_TIME_FORMATS_FOR_DATE_PIPE = {
    DATE_RUS_FORMAT_WITH_SECONDS: 'dd.MM.yy HH:mm:ss',
    DATE_RUS_FORMAT: 'dd.MM.yy',
    TIME_MINUTES: 'HH:mm',
  };

  // constructor(public translateServ: TranslateService) {
  //     this.MONTHS = translateServ.instant('CALENDAR.MONTHS');
  //     this.WEEK_DAYS = translateServ.instant('CALENDAR.WEEK_DAYS');
  //     this.MONTH_NUMBER_NOT_EXIST_STR_ERROR = translateServ.instant('CALENDAR.MONTH_NUMBER_NOT_EXIST_STR_ERROR');
  //     this.MONTH_NUMBER_NOT_CORRECT_STR_ERROR = translateServ.instant('CALENDAR.MONTH_NUMBER_NOT_CORRECT_STR_ERROR');
  // }

  constructor() {
    this.MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    this.GENETIVE_MONTHS = [
      'Января',
      'Февраля',
      'Марта',
      'Апреля',
      'Мая',
      'Июня',
      'Июля',
      'Августа',
      'Сентября',
      'Октября',
      'Ноября',
      'Декабря',
    ];
    this.WEEK_DAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    this.MONTH_NUMBER_NOT_EXIST_STR_ERROR = 'Не указан номер месяца';
    this.MONTH_NUMBER_NOT_CORRECT_STR_ERROR = 'Не верно указан номер месяца';
  }

  public subtract(date: Date, unit: number, value: TimeUnit): Date {
    return moment(date).subtract(unit, value).toDate();
  }

  public add(date: Date, unit: number, value: TimeUnit): Date {
    return moment(date).add(unit, value).toDate();
  }

  public getSelectedDateTimeFrom(date: Date): ISelectedDateTime {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    };
  }

  public getFormattedDateFromStringWithZoneId(date: string, format: string = this.DATE_TIME_FORMATS.DATETIME_RUS): string {
    // возвращает строку с датой в формате 'MM.DD.YYYY HH:mm' из даты с бэка
    if (this.isBackendDate(date)) {
      const dateParts = date.split('[');
      return moment(dateParts[0])
        .tz(dateParts[1].substring(0, dateParts[1].length - 1))
        .format(format);
    }
    return 'Invalid date';
  }

  // возвращает дату (new Date) из даты с бэка
  public getDateFromStringWithZoneId(date: string, format: string = this.DATE_TIME_FORMATS.DATE_RUS_FORMAT_WITH_TIME_FOR_DATE): any {
    if (this.isBackendDate(date)) {
      return moment(this.getFormattedDateFromStringWithZoneId(date, format), format).toDate();
    }
    return 'Invalid date';
  }

  public formatDateFromStringWithZoneId(date, format: string = this.DATE_TIME_FORMATS.ISO_DATE): string {
    return this.format(this.getDateFromStringWithZoneId(date), format);
  }

  public getFormattedDateWithZoneCharFromStringWithZoneId(date): string {
    const result = this.formatDateFromStringWithZoneId(date, this.DATE_TIME_FORMATS.DATETIME_ISO_8601);
    return result === 'Invalid date' ? result : result + 'Z';
  }

  // возвращает строку название месяца + год из даты-строки с бэка
  public getMonthYearFromStringWithZoneId(date: string, format: string = this.DATE_TIME_FORMATS.DATE_RUS_FORMAT_FOR_DATE): string {
    if (this.isBackendDate(date)) {
      const dateWork = this.getDateFromStringWithZoneId(date, format);
      const month = dateWork.getMonth();
      const year = dateWork.getFullYear();
      return this.getMonthNameByIndex(month).toLowerCase() + ' ' + year;
    }
    return 'Invalid date';
  }

  // возвращает строку название месяца + год из даты с бэка
  public getMonthYearFromDateWithZoneId(date: Date): string {
    const month = date.getMonth();
    const year = date.getFullYear();
    return this.getMonthNameByIndex(month).toLowerCase() + ' ' + year;
  }

  // TODO: возможно повтор
  // возвращает строку в формате ISO
  public getISOStringFromString(date: string, format: string = this.DATE_TIME_FORMATS.DATE_RUS_FORMAT): string {
    if (!this.isDateMatchToFormat(date, this.DATE_TIME_FORMATS.DATETIME_ISO_8601_WITH_Z)) {
      return moment(date, format).format(this.DATE_TIME_FORMATS.DATETIME_ISO_8601_WITH_Z);
    } else {
      return date;
    }
  }

  private isBackendDate(date): boolean {
    return date && date.indexOf('[') > -1;
  }

  public getMonths(): string[] {
    return this.MONTHS;
  }

  public getWeekDays(): string[] {
    return this.WEEK_DAYS;
  }

  public getDateTimeFormats() {
    return this.DATE_TIME_FORMATS;
  }

  public getUnitsOfTime() {
    return this.UNIT_OF_TIME_MAP;
  }

  public getDateTimeFormatsForTextMaskComponent() {
    return this.DATE_TIME_FORMATS_FOR_TEXT_MASK_COMPONENT;
  }

  public getDateTimeFormatsForDatePipe() {
    return this.DATE_TIME_FORMATS_FOR_DATE_PIPE;
  }

  public getMonthNameByIndex(index: number, isGenetive = false): string {
    if (index == null) {
      throw new Error(this.MONTH_NUMBER_NOT_EXIST_STR_ERROR);
    }
    if (index < this.MIN_MONTH || index > this.MAX_MONTH) {
      throw new Error(this.MONTH_NUMBER_NOT_CORRECT_STR_ERROR);
    }
    return isGenetive ? `${this.GENETIVE_MONTHS[index]}` : `${this.MONTHS[index]}`;
  }

  public getDateRusFormatMask(): any[] {
    return [
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DATE_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DATE_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
    ];
  }

  public getDateRusFormatWithSecondsMask(): any[] {
    return [
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DATE_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DATE_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DATE_TIME_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.TIME_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.TIME_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
    ];
  }

  public getDateTimeRusMask(): any[] {
    return [
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DATE_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DATE_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DATE_TIME_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.TIME_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
    ];
  }

  public getMonthAndYearRusMask(): any[] {
    return [
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DATE_SEPARATOR,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
      this.DIGIT_REG_EXP,
    ];
  }

  public getTimeMinutesMask(): any[] {
    return [this.DIGIT_REG_EXP, this.DIGIT_REG_EXP, this.TIME_SEPARATOR, this.DIGIT_REG_EXP, this.DIGIT_REG_EXP];
  }

  public getYearMask(): any[] {
    return [this.DIGIT_REG_EXP, this.DIGIT_REG_EXP, this.DIGIT_REG_EXP, this.DIGIT_REG_EXP];
  }

  public isValueContainOnlyNumber(valueToCheck: string) {
    let isValueValid = true;
    if (valueToCheck === undefined || valueToCheck === null || valueToCheck.length === 0) {
      isValueValid = false;
    } else if (!/^[0-9]+$/.test(valueToCheck)) {
      isValueValid = false;
    }
    return isValueValid;
  }

  public isHourValueValid(valueToCheck: string): boolean {
    return this.isTimeValueValid(valueToCheck, this.MAX_HOUR);
  }

  public isMinuteOrSecondValueValid(valueToCheck: string): boolean {
    return this.isTimeValueValid(valueToCheck, this.MAX_MINUTE_AND_SECOND);
  }

  public getFormattedDateStringWithZoneChar(date, currentDateFormat?): string {
    if (currentDateFormat) {
      // дату в текущем формате приводим к DATETIME_ISO_8601
      date = this.formatFromCurrentFormat(date, currentDateFormat, this.DATE_TIME_FORMATS.DATETIME_ISO_8601);
    }
    return this.format(date, this.DATE_TIME_FORMATS.DATETIME_ISO_8601) + 'Z';
  }

  // принимает на вход строку с датой в большинстве формате ISO и форматирует ее
  public format(dateTimeISO: string, format: string): string {
    return moment(dateTimeISO).format(format);
  }

  public formatFromCurrentFormat(dateTime: string, dateTimeCurrentFormat: string, newFormat: string): string {
    return moment(dateTime, dateTimeCurrentFormat).format(newFormat);
  }

  // принимает на вход Date и форматирует ее
  public formatDate(dateTime: Date, format: string): string {
    return moment(dateTime).format(format);
  }

  // возвращает номер месяца из даты в большинстве форматов ISO
  public getMothFromDateISO(dateTimeISO: string): number {
    return moment(dateTimeISO).toDate().getMonth();
  }

  // получить дату для визуализации пользователю в его национальном формате
  public getDateNational(dateTimeISO: string): string {
    return this.format(dateTimeISO, this.DATE_TIME_FORMATS.DATE_RUS_FORMAT);
  }

  // получить объект Date с датой и временем из строки указанного формата
  public getDateByFormat(dateTime: string, format: string = this.DATE_TIME_FORMATS.DATE_RUS_FORMAT): Date {
    return moment(dateTime, format).toDate();
  }

  /**
   * Проверка соответствия дат
   * @param firstDate - первая дата
   * @param secondDate - вторая дата
   * @param timeUnit - вид сравнения (The supported measurements are years, months, weeks, days, hours, minutes, and seconds)
   * @returns - значение соответствия
   */
  public isEqual(firstDate: Date, secondDate: Date, timeUnit = this.UNIT_OF_TIME_MAP.DAY): boolean {
    return moment(secondDate).diff(moment(firstDate), timeUnit as unitOfTime.Diff) === 0;
  }

  /**
   * Проверки на "После" и "До" разниц дат,
   * а так же проверка на равность дат
   * @param afterDate  - может быть Date или string
   * @param beforeDate - может быть Date или string
   * @param timeUnit - единицы измерения разницы
   */
  public isAfter(firstDate: Date | string, secondDate: Date | string, timeUnit = this.UNIT_OF_TIME_MAP.DAY, format?: string): boolean {
    const startDate = typeof firstDate === 'string' ? this.getDateByFormat(firstDate, format) : firstDate;
    const endDate = typeof secondDate === 'string' ? this.getDateByFormat(secondDate, format) : secondDate;
    return moment(startDate).isAfter(endDate, timeUnit as unitOfTime.StartOf);
  }

  public isBefore(firstDate: Date | string, secondDate: Date | string, timeUnit = this.UNIT_OF_TIME_MAP.DAY): boolean {
    const startDate = typeof firstDate === 'string' ? this.getDateByFormat(firstDate) : firstDate;
    const endDate = typeof secondDate === 'string' ? this.getDateByFormat(secondDate) : secondDate;
    return moment(startDate).isBefore(endDate, timeUnit as unitOfTime.StartOf);
  }

  public isSame(firstDate: Date | string, secondDate: Date | string, timeUnit = this.UNIT_OF_TIME_MAP.DAY, format?: string): boolean {
    const startDate = typeof firstDate === 'string' ? this.getDateByFormat(firstDate, format) : firstDate;
    const endDate = typeof secondDate === 'string' ? this.getDateByFormat(secondDate, format) : secondDate;
    return moment(startDate).isSame(endDate, timeUnit as unitOfTime.StartOf);
  }

  /**
   * Проверяет, что дата в строке соответствует указанному формату
   * @param dateInString - дата в строке
   * @param format - формат, которому должна соответсвовать дата
   */
  public isDateMatchToFormat(dateInString: string, format: string): boolean {
    return moment(dateInString, format, true).isValid();
  }

  private isTimeValueValid(valueToCheck: string, maxValue: number): boolean {
    let isValueValid = this.isValueContainOnlyNumber(valueToCheck);
    if (isValueValid) {
      try {
        // tslint:disable-next-line:radix
        const value = parseInt(valueToCheck);
        if (value < 0 || value > maxValue) {
          isValueValid = false;
        }
      } catch (e) {
        isValueValid = false;
      }
    }
    return isValueValid;
  }

  // проверка валидности даты
  public isDateValid(valueToCheck: string | Date, format: string = this.DATE_TIME_FORMATS.DATE_RUS_FORMAT): boolean {
    return moment(valueToCheck, format).isValid();
  }

  // возвращает разницу между датами (в годах)
  public getDateDiffAsYears(beforeDate: Date, afterDate: Date): number {
    const beforeMoment = moment(beforeDate);
    const afterMoment = moment(afterDate);

    return moment.duration(afterMoment.diff(beforeMoment)).asYears();
  }

  // возвращает разницу между датами (в месяцах)
  public getDateDiffAsMonths(beforeDate: Date, afterDate: Date): number {
    const beforeMoment = moment(beforeDate);
    const afterMoment = moment(afterDate);

    return moment.duration(afterMoment.diff(beforeMoment)).asMonths();
  }

  // возвращает разницу между датами (в днях)
  public getDateDiffAsDays(beforeDate: Date, afterDate: Date): number {
    const beforeMoment = moment(beforeDate);
    const afterMoment = moment(afterDate);

    return moment.duration(afterMoment.diff(beforeMoment)).asDays();
  }

  // проверяем, соответствует ли дата формату YYYY-MM-DDTHH:mm:ss.SSSZ (DATETIME_ISO_8601_WITH_Z)
  private isDateForBackend(date: string): boolean {
    return date && typeof date === 'string' && date.endsWith('Z');
  }

  // перевод из формата YYYY-MM-DDTHH:mm:ss.SSSZ (DATETIME_ISO_8601_WITH_Z) в YYYY-MM-DDTHH:mm:ss.SSS (DATETIME_ISO_8601_CONSIDER_TIME)
  private getFormattedDateFromDateForBackend(date): string {
    if (this.isDateForBackend(date)) {
      return date.substring(0, date.length - 1);
    }
    return date;
  }

  public getStringDataToFormat(date, format: string): string {
    const preparedDate = this.getFormattedDateFromDateForBackend(date);
    return moment(preparedDate).format(format).toString();
  }

  public getStringDateToISO8601(date, isConsiderTime: boolean = false): string {
    const result = this.getStringDataToFormat(
      date,
      isConsiderTime ? this.DATE_TIME_FORMATS.DATETIME_ISO_8601_CONSIDER_TIME : this.DATE_TIME_FORMATS.DATETIME_ISO_8601
    );
    return result === 'Invalid date' ? result : result + 'Z';
  }

  public getCurrentDate() {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  }

  public getUserTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  public getFormattedDateWithTimeZone(
    date,
    format = this.DATE_TIME_FORMATS.DATETIME_ISO_8601_CONSIDER_TIME_WITH_TIMEZONE_OFFSET,
    withUserTimeZone = true
  ) {
    let formattedDate: string = moment(date).format(format);
    if (withUserTimeZone) {
      formattedDate += `[${this.getUserTimeZone()}]`;
    }
    return formattedDate;
  }
}
