import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

/**
 * Builder — это порождающий паттерн, который позволяет создавать объекты пошагово с различной конфигурацией.
 * ___________________________________________________________________________
 * Паттерн помогает изолировать сложный код сборки продукта от его основной бизнес-логики.
 * При необходимости переключаться между разными реализациями билдеров (используется вспомогательный класс Director).
 * ___________________________________________________________________________
 * Применимость
 * - Когда вы хотите избавиться от «телескопического конструктора».
 * - Когда нужно создавать объекты с различной конфигурацией.
 */

// Пример использования:
// const userAgentInfo: IUserAgentInfo = {
//   browserName: "chrome",
//   browserVersion: "80",
//   os: "Linux",
//   width: 1920,
//   height: 1080
// }
//
// const requestBuilder: IRequestBuilder<AngularRequestBuilder, Observable<any>> = new AngularRequestBuilder(httpClient);
//
// requestBuilder.newRequest(`${environment.API_URL}/statistics/browser`, RequestMethod.POST)
//   .setBody(userAgentInfo).setNewField('some param')
//   .build()
//   .subscribe(userAgentData => {});

enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

enum ResponseType {
  ARRAYBUFFER = 'arraybuffer',
  BLOB = 'blob',
  JSON = 'json',
  TEXT = 'text',
}

class Request {
  url: string;
  requestMethod: RequestMethod;
  headers: any;
  params: any;
  responseType: ResponseType;
  newField: any;
  body: any;

  constructor(url: string, requestMethod: RequestMethod) {
    this.url = url;
    this.requestMethod = requestMethod;
  }
}

interface IRequestBuilder<T, P> {
  newRequest(url: string, requestMethod: RequestMethod): T;

  setHeaders(headers: any): T;

  setParams(params: any): T;

  setResponseType(responseType: ResponseType): T;

  setBody(body: any): T;

  setNewField(field: any): T;

  build(): P;
}

@Injectable()
class AngularRequestBuilder implements IRequestBuilder<AngularRequestBuilder, Observable<any>> {
  private static instance: AngularRequestBuilder;
  private request: Request;

  constructor(private httpClient: HttpClient) {
    if (!AngularRequestBuilder.instance) {
      AngularRequestBuilder.instance = this;
    }
    return AngularRequestBuilder.instance;
  }

  newRequest(url: string, requestMethod: RequestMethod): AngularRequestBuilder {
    this.request = new Request(url, requestMethod);
    return this;
  }

  setBody(body: any): AngularRequestBuilder {
    this.request.body = body;
    return this;
  }

  setHeaders(headers: any): AngularRequestBuilder {
    this.request.headers = headers;
    return this;
  }

  setParams(params: any): AngularRequestBuilder {
    this.request.params = params;
    return this;
  }

  setResponseType(responseType: ResponseType = ResponseType.JSON): AngularRequestBuilder {
    this.request.responseType = responseType;
    return this;
  }

  setNewField(newField: any): AngularRequestBuilder {
    this.request.newField = newField;
    return this;
  }

  build(): Observable<any> {
    const reqDetails = {
      headers: this.request.headers,
      params: this.request.params,
      responseType: this.request.responseType,
    };
    const req = new HttpRequest(this.request.requestMethod, this.request.url, reqDetails);
    return this.httpClient.request(req);
  }
}

class RequestDirector {
  private builder: IRequestBuilder<any, any>;

  public setBuilder(builder: IRequestBuilder<any, any>) {
    this.builder = builder;
  }

  public buildSimpleRequest(url: string, requestMethod: RequestMethod): any {
    return this.builder.newRequest(url, requestMethod).build();
  }
}
