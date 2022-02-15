/**
 * Adapter — это структурный паттерн проектирования, который позволяет объектам с несовместимыми интерфейсами работать вместе.
 * ___________________________________________________________________________
 * Адаптер выступает прослойкой между разными контекстами, превращая структуры объектов или вызовы методов объекта одного контекста
 * в вызовы понятные другому контексту.
 * ___________________________________________________________________________
 * Применимость
 * - Когда вы хотите использовать сторонний класс, но его интерфейс не соответствует остальному коду приложения.
 * - Когда вам нужно использовать несколько существующих подклассов, но в них не хватает какой-то общей функциональности,
 * причём расширить суперкласс вы не можете.
 */

import { Injectable } from '@angular/core';

export interface IIdCodeName {
  id: number;
  code: string;
  name: string;
}

export interface IFilter {
  field: string;
  criteria: string;
  value: any;
  type?: string;
  mapValueBeforeSendCallback?: (value) => any; // callback, который мапит значение в нужный формат для бэка
  mapWhollyFilterCallback?: (filter: IFilter) => any[]; // callback, который мапит фильтр целиком в нужный формат для бэка.
}

export interface ISort {
  field: string;
  ordering: string;
  index: number;
}

// Пример простого адаптера, который мапит структуру объекта из контекста используемого в нашей системе в контекст внешней системы
@Injectable({
  providedIn: 'root',
})
export class SimpleFormatAdapterService {
  protected defaultFilters = {
    okrug: {
      field: 'okrug',
      value: [], // IIdCodeName []
      mapWhollyFilterCallback: (filter: IFilter) => {
        return {
          f: 'okrugs', // field
          o: 'IN', // operation
          t: 'array-number', // type
          v: filter.value.map((okrugItem: IIdCodeName) => {
            return okrugItem.id;
          }),
        };
      },
    },
  };
}

// Пример сочитания паттерном Адаптер и Фасад
@Injectable({
  providedIn: 'root',
})
export class XmlToJsonAdapterFacadeService {
  private xmlJsConverter: any; // converter from xml-js lib

  public convertJsonToXml(jsonObj) {
    return this.xmlJsConverter.json2xml(jsonObj);
  }

  public convertXmlToJson(xmlObj) {
    return this.xmlJsConverter.xml2json(xmlObj);
  }
}
