import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Prototype — это порождающий паттерн, который позволяет копировать объекты любой сложности без привязки к их конкретным классам.
 * ___________________________________________________________________________
 * Все классы—Прототипы имеют общий интерфейс (обычно - Cloneable). Поэтому вы можете копировать объекты, не обращая внимания на их
 * конкретные типы и всегда быть уверены, что получите точную копию. Клонирование совершается самим объектом-прототипом, что позволяет ему
 * скопировать значения всех полей, даже приватных.
 * ___________________________________________________________________________
 * Применимость
 * - Когда ваш код не должен зависеть от классов копируемых объектов.
 * - Когда вы имеете уйму подклассов, которые отличаются начальными значениями полей. Кто-то мог создать все эти классы,
 * чтобы иметь возможность легко порождать объекты с определённой конфигурацией.
 *
 * - Паттерн применим для объектов, которые являются не просто одноуровневым хранилищем данных, а для объектов клонирование которых
 * подразумевает определённую бизнес логику. А так же когда в системе нужно иметь множество объектов определённого класса
 * с одинаковым исходным состоянием (исходное состояние может быть сложным и формироваться на основании нескольких запросов, т.е.
 * получение этого состояния занимает N-е количество времени)
 */

interface ICloneable<T> {
  clone(config?): T; // config? - модернизация классической реализации, которая позволяет добавить логику при клонировании
}

class ConsumerContractPeriodParam implements ICloneable<ConsumerContractPeriodParam> {
  id: number;
  name: string;
  isAggregated: boolean;
  value: string;

  clone(config?): ConsumerContractPeriodParam {
    return {
      ...this,
    };
  }
}

class ConsumerContractPointPeriod implements ICloneable<ConsumerContractPointPeriod> {
  id: number;
  startDate: string;
  endDate: string;
  contractId: number;
  measurePointId: number;
  params: ConsumerContractPeriodParam[] = [];

  clone(config?): ConsumerContractPointPeriod {
    return {
      ...this,
      id: null,
      startDate: null,
      endDate: null,
      params: this.params.map((param) => {
        return { ...param };
      }),
    };
  }
}

class ConsumerContractPoint {
  id: number;
  contractNum: string;
  periods: ConsumerContractPointPeriod[];

  public addPeriod() {
    const newPeriod = this.periods?.length > 0 ? this.periods[this.periods.length - 1].clone() : new ConsumerContractPointPeriod();
    this.periods.push(newPeriod);
  }
}

class ConsumerContract {
  id: number;
  file: any;
  contractPoints: ConsumerContractPoint[] = [];
}

@Injectable()
class ConsumerContractService {
  periodParamsPrototype: ConsumerContractPeriodParam[];
  consumerContract: ConsumerContract = new ConsumerContract();
  selectedContractPointIndex = 0;

  constructor(apiService: APIService) {
    apiService.getConsumerParams().subscribe((params) => {
      this.periodParamsPrototype = params;
    });
  }

  public addPeriod() {
    const contractPoint = this.consumerContract?.contractPoints[this.selectedContractPointIndex];
    contractPoint?.periods?.length > 0 ? contractPoint.addPeriod() : contractPoint.periods.push(this.getConsumerContractPointPeriod());
  }

  private getConsumerContractPointPeriod(): ConsumerContractPointPeriod {
    const consumerContractPointPeriod: ConsumerContractPointPeriod = new ConsumerContractPointPeriod();
    // клонируем параметры из уже заранее полученного с сервера массива параметров
    consumerContractPointPeriod.params = this.periodParamsPrototype.map((param) => param.clone());
    return consumerContractPointPeriod;
  }
}

class APIService {
  private httpClient: HttpClient;

  public getConsumerParams(): Observable<any> {
    return this.httpClient.get(`SOME_URL/dictionary/api-methods`);
  }
}
