/**
 * Template Method (Шаблонный метод) — это поведенческий паттерн проектирования, который определяет скелет алгоритма, перекладывая
 * ответственность за некоторые его шаги на подклассы.
 * Паттерн позволяет подклассам переопределять шаги алгоритма, не меняя его общей структуры.
 *
 * Преимущества
 * - Облегчает повторное использование кода.
 * ___________________________________________________________________________
 *
 * Шаблонный метод использует наследование, чтобы расширять части алгоритма.
 * Стратегия использует делегирование, чтобы изменять выполняемые алгоритмы на лету.
 * Шаблонный метод работает на уровне классов. Стратегия позволяет менять логику отдельных объектов.
 * ___________________________________________________________________________
 *
 * Применимость
 * - Когда подклассы должны расширять базовый алгоритм, не меняя его структуры.
 * - Когда у вас есть несколько классов, делающих одно и то же с незначительными отличиями. Если вы редактируете один класс,
 * то приходится вносить такие же правки и в остальные классы.
 */
import { Observable, of, Subscription } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';


abstract class AgGridBaseComponent {
  public gridApi: any;
  // содержит данные фильтров
  public requestPayload;
  // грид в процессе загрузки данных из источника
  public isGridDataRefreshing: boolean;

  protected gridRequestSubscription: Subscription;

  /**
   * Шаблонный метод для гридов. Использует набор методов (callbacks) с реализацией по умолчанию и абстрактные методы.
   * Наследники переопределяют абстрактные методы и при необходимости callbacks с реализацией по умолчанию.
   * В некоторых случаех может быть переопределён целиком метод onRefreshPage.
   * @param requestPayload - параметры запроса
   */
  public onRefreshPage(requestPayload?: IGridRequestPayload): void {
    if (!!this.gridRequestSubscription) {
      this.gridRequestSubscription?.unsubscribe();
      this.isGridDataRefreshing = false;
    }

    this.beforeGridRequestCallback(requestPayload);

    if (this.gridApi && this.canRefreshGrid()) {
      this.showOverlay();

      if (!this.isGridDataRefreshing) {
        this.isGridDataRefreshing = true;
        const body = this.getRequestBody(this.requestPayload);

        this.gridRequestSubscription = this.getGridRequest(body).subscribe(
          (response: any) => this.onRefreshPageSuccessCallback(response),
          (error: HttpErrorResponse) => this.onRefreshPageErrorCallback(error)
        );
      } else {
        this.hideOverlay();
      }
    } else {
      this.refreshPageDeniedCallback();
    }
  }

  /**
   * @protected колбэк, который даёт возможность выполнить некоторые действия перед обновлением грида
   */
  protected beforeGridRequestCallback(requestPayload?: IGridRequestPayload): void {
    this.requestPayload = requestPayload ?? this.requestPayload;
  }

  /**
   * @protected метод определяет возможность обновления грида.
   * По умолчание обновление грида всегда доступно
   */
  protected canRefreshGrid(): boolean {
    return true;
  }

  /**
   * @protected колбэк, который даёт возможность выполнить некоторые действия, если обновление грида недоступно
   */
  protected refreshPageDeniedCallback(): void {}

  /**
   * @protected колбэк для маппинга параметров запроса
   */
  protected abstract getRequestBody(requestPayload: any, ...otherParams: any): IGridRequest | IPagedRequest;

  /**
   * @protected колбэк, который возвращает Observable для получения данных грида
   */
  protected abstract getGridRequest(body): Observable<any>;

  protected onRefreshPageSuccessCallback(response: IPagedResponse | HttpResponse<any[]>) {}

  protected onRefreshPageErrorCallback(error: HttpErrorResponse) {}

  public showOverlay(): void {
    this.gridApi?.showLoadingOverlay();
  }

  public hideOverlay(): void {
    this.gridApi?.hideOverlay();
  }
}

// наследник конфигурирующий шаблонный метод через реализацию абстрактных методов или переопределение методов с поведением по умолчанию
export class ConcreteGridComponent extends AgGridBaseComponent {
  protected beforeGridRequestCallback(requestPayload?: IGridRequestPayload): void {
    // can do additional mapping
    // this.requestPayload = this.getMappedRequestPayload(requestPayload);
  }

  protected getGridRequest(body): Observable<any> {
    // return some Observable request
    // return this.ApiService.getGridData(body);
    return of([]);
  }

  protected getRequestBody(requestPayload: IGridRequestPayload) {
    // return mapped grid request
    // return this.getGridRequestBody(requestPayload);
    return null;
  }
}


export interface IPagedRequest {
  is_new: boolean;
  total_count: number;
  per_page_count: number;
  page_number: number;
  total_page_number: number;
}

export interface IPagedResponse {
  current_page_entity_count: number;
  current_page_number: number;
  per_page_count: number;
  total_count: number;
  total_page_number: number;
  entity_list: any[];
  type?: string;
}

export interface IGridRequest extends IPagedRequest {
  requestPayload: IGridRequestPayload;
}

export interface IGridRequestPayload {
  filters: IFilter[];
  anyFilters?: IFilter[];
  anyFiltersApplyingAll?: boolean;
  ordering?: ISort[];
  search?: string;
  searchText?: string;

  addFilter?(filter: IFilter): IGridRequestPayload;
}

export interface ISort {
  field: string;
  ordering: string;
  index: number;
}

// более строгая форма IAbstractFilter
export interface IFilter extends IAbstractFilter {
  field: string;
  criteria: string;
  value: any;
  type?: string;
  canNotWrapValue?: boolean; // флаг, который говорит можно ли не оборачивать значение простого типа в строку
  mapValueBeforeSendCallback?: (value) => any; // колбэк, который мапит значение в нужный формат для бэка
  mapWhollyFilterCallback?: (filter: IAbstractFilter) => any[]; // колбэк, который мапит фильтр целиком в нужный формат для бэка.
  // Функция позволяющая менять значение activeRemoveFilters (флаг, по которому показывается кнопка сброса фильтров) по условию.
  needIgnoreForFlagActiveRemoveFilters?: (value) => boolean;
}

// ОБЯЗАТЕЛЬНО проставлять из defaultFilters в UtilsService.copyDefaultFilters все поля с типом Function,
// чтобы при ресторе из localStorage они не были undefined
export interface IAbstractFilter {
  field: string; // Если названия нет (field == null) и sendIn не указан, то не будет отправлен
  value?: any;
  criteria?: string;
  canNotWrapValue?: boolean; // флаг, который говорит можно ли не оборачивать значение простого типа в строку
  sendIn?: PlaceForSendFilter; // если указан, то будет отправлен в указанном месте
  mapValueBeforeSendCallback?: (value) => any; // колбэк, который мапит значение в нужный формат для бэка
  mapWhollyFilterCallback?: (filter: IAbstractFilter) => any[]; // колбэк, который мапит фильтр целиком в нужный формат для бэка.
  // tslint:disable-next-line:max-line-length
  needIgnoreForFlagActiveRemoveFilters?: (value) => boolean; // Функция позволяющая менять значение activeRemoveFilters (флаг, по которому показывается кнопка сброса фильтров) по условию.
  canNotKeepInLocalStorage?: boolean;
}

export enum PlaceForSendFilter {
  // tslint:disable-next-line:max-line-length
  REQUEST_PAYLOAD = 'requestPayload', // отправка в корне объекта requestPayload (требует простановки, когда фильтр находится в массиве filters или anyFilters, а его нужно отправлять в requestPayload)
  FILTERS = 'filters', // отправка в массиве filters (по умолчанию не требует простановки)
  ANY_FILTERS = 'anyFilters', // отправка в массиве anyFilters (по умолчанию не требует простановки)
}
