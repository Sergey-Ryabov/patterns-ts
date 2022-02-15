/**
 * Abstract Factory — это порождающий паттерн, который решает проблему создания целых СЕМЕЙСТВ связанных продуктов,
 * без указания конкретных классов продуктов
 * ___________________________________________________________________________
 * Абстрактная фабрика задаёт интерфейс создания всех доступных типов продуктов, а каждая конкретная реализация фабрики
 * порождает продукты одной из вариаций. Клиентский код вызывает методы фабрики для получения продуктов, вместо самостоятельного создания
 * с помощью оператора new. При этом фабрика сама следит за тем, чтобы создать продукт нужной вариации.
 * ___________________________________________________________________________
 * Применимость
 * - Когда бизнес-логика программы должна работать с разными видами связанных друг с другом продуктов,
 * не завися от конкретных классов продуктов
 * - Когда в программе уже используется Фабричный метод, но очередные изменения предполагают введение новых типов продуктов.
 */

import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Injectable,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

interface IProductCard {
  id: number;
  title: string;
  image: any;
  price: number;
}

interface IOrderCard {
  id: number;
  products: IProductCard[];
  deliveryAddress: string;
}

export interface IAppOrderCard {
  orderCards: IOrderCard;
  closed: EventEmitter<any>;
}

export interface IAppProductCard {
  productCard: IProductCard;
  closed: EventEmitter<any>;
}

interface ICardFactory {
  createOrderCard(): ComponentFactory<IAppOrderCard>;

  createProductCard(): ComponentFactory<IAppProductCard>;
}

// == DesktopCardFactory start

class DesktopCardFactory implements ICardFactory {
  constructor(protected componentFactoryResolver: ComponentFactoryResolver) {}

  createOrderCard(): ComponentFactory<IAppOrderCard> {
    return this.componentFactoryResolver.resolveComponentFactory(AppDesktopOrderCardComponent);
  }

  createProductCard(): ComponentFactory<IAppProductCard> {
    return this.componentFactoryResolver.resolveComponentFactory(AppDesktopProductCardComponent);
  }
}

@Component({
  selector: 'app-desktop-order-card',
  template:
    '<div class="AxDisconnectionsCardComponentClass">\n' +
    '    <div class=\'layer-outside\' (click)=\'close(isOpened)\'></div>\n' +
    '    <div class=\'modal-container right\' [@sliderAnimationTrigger]="isOpened ? \'opened\' : \'collapsed\'"\n' +
    '        (@sliderAnimationTrigger.done)="animationDone($event)">\n' +
    '        <div class=\'close-btn\' [title]="translatedTitles[\'GENERAL\'][\'CLOSE\']" (click)="close(isOpened)">\n' +
    '            <span class=\'font-icons icon-close2\'></span>\n' +
    '        </div>\n' +
    '        <ax-loader [spinnerWidth]="120" [spinnerHeight]="120" [show]="showAxLoader">\n' +
    '        </ax-loader>\n' +
    '        <ng-container *ngIf="isAnimationCompleted">\n' +
    '            <div class=\'header\'>\n' +
    '                <h1>AppDesktopOrderCard</h1>' +
    '            </div>\n' +
    '        </ng-container>\n' +
    '    </div>\n' +
    '</div>\n',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sliderAnimationTrigger', [
      state(
        'collapsed',
        style({
          width: '0px',
        })
      ),
      state(
        'opened',
        style({
          width: '95%',
        })
      ),
      transition('collapsed => opened', [animate('0.2s')]),
    ]),
  ],
})
export class AppDesktopOrderCardComponent implements IAppOrderCard, OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() orderCards: IOrderCard;
  @Output() closed: EventEmitter<any> = new EventEmitter();
  @HostBinding('@sliderAnimationTrigger') public isOpened = false;

  public translatedTitles: any = {};
  public isAnimationCompleted = false;
  public showAxLoader = false;
  private destroy$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isOpened = true;
    }, 0);
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  public close(isOpened: boolean = true): void {
    this.closed.emit();
  }

  public animationDone(event: any): void {
    if (event.fromState === 'collapsed' && event.toState === 'opened') {
      this.isAnimationCompleted = true;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }
}

@Component({
  selector: 'app-desktop-product-card',
  template:
    '<div class="AxDisconnectionsCardComponentClass">\n' +
    '    <div class=\'layer-outside\' (click)=\'close(isOpened)\'></div>\n' +
    '    <div class=\'modal-container right\' [@sliderAnimationTrigger]="isOpened ? \'opened\' : \'collapsed\'"\n' +
    '        (@sliderAnimationTrigger.done)="animationDone($event)">\n' +
    '        <div class=\'close-btn\' [title]="translatedTitles[\'GENERAL\'][\'CLOSE\']" (click)="close(isOpened)">\n' +
    '            <span class=\'font-icons icon-close2\'></span>\n' +
    '        </div>\n' +
    '        <ax-loader [spinnerWidth]="120" [spinnerHeight]="120" [show]="showAxLoader">\n' +
    '        </ax-loader>\n' +
    '        <ng-container *ngIf="isAnimationCompleted">\n' +
    '            <div class=\'header\'>\n' +
    '                <h1>AppDesktopProductCardComponent</h1>' +
    '            </div>\n' +
    '        </ng-container>\n' +
    '    </div>\n' +
    '</div>\n',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sliderAnimationTrigger', [
      state(
        'collapsed',
        style({
          width: '0px',
        })
      ),
      state(
        'opened',
        style({
          width: '95%',
        })
      ),
      transition('collapsed => opened', [animate('0.2s')]),
    ]),
  ],
})
export class AppDesktopProductCardComponent implements IAppProductCard, OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() productCard: IProductCard;
  @Output() closed: EventEmitter<any> = new EventEmitter();
  @HostBinding('@sliderAnimationTrigger') public isOpened = false;

  public translatedTitles: any = {};
  public isAnimationCompleted = false;
  public showAxLoader = false;
  private destroy$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isOpened = true;
    }, 0);
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  public close(isOpened: boolean = true): void {
    this.closed.emit();
  }

  public animationDone(event: any): void {
    if (event.fromState === 'collapsed' && event.toState === 'opened') {
      this.isAnimationCompleted = true;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }
}

// == DesktopCardFactory end

// == MobileCardFactory start

class MobileCardFactory implements ICardFactory {
  constructor(protected componentFactoryResolver: ComponentFactoryResolver) {}

  createOrderCard(): ComponentFactory<IAppOrderCard> {
    return this.componentFactoryResolver.resolveComponentFactory(AppMobileOrderCardComponent);
  }

  createProductCard(): ComponentFactory<IAppProductCard> {
    return this.componentFactoryResolver.resolveComponentFactory(AppMobileProductCardComponent);
  }
}

@Component({
  selector: 'app-mobile-order-card',
  template:
    '<div class="AxDisconnectionsCardComponentClass">\n' +
    '    <div class=\'layer-outside\' (click)=\'close(isOpened)\'></div>\n' +
    '    <div class=\'modal-container right\' [@sliderAnimationTrigger]="isOpened ? \'opened\' : \'collapsed\'"\n' +
    '        (@sliderAnimationTrigger.done)="animationDone($event)">\n' +
    '        <div class=\'close-btn\' [title]="translatedTitles[\'GENERAL\'][\'CLOSE\']" (click)="close(isOpened)">\n' +
    '            <span class=\'font-icons icon-close2\'></span>\n' +
    '        </div>\n' +
    '        <ax-loader [spinnerWidth]="120" [spinnerHeight]="120" [show]="showAxLoader">\n' +
    '        </ax-loader>\n' +
    '        <ng-container *ngIf="isAnimationCompleted">\n' +
    '            <div class=\'header\'>\n' +
    '                <h1>AppMobileOrderCard</h1>' +
    '            </div>\n' +
    '        </ng-container>\n' +
    '    </div>\n' +
    '</div>\n',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sliderAnimationTrigger', [
      state(
        'collapsed',
        style({
          width: '0px',
        })
      ),
      state(
        'opened',
        style({
          width: '95%',
        })
      ),
      transition('collapsed => opened', [animate('0.2s')]),
    ]),
  ],
})
export class AppMobileOrderCardComponent implements IAppOrderCard, OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() orderCards: IOrderCard;
  @Output() closed: EventEmitter<any> = new EventEmitter();
  @HostBinding('@sliderAnimationTrigger') public isOpened = false;

  public translatedTitles: any = {};
  public isAnimationCompleted = false;
  public showAxLoader = false;
  private destroy$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isOpened = true;
    }, 0);
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  public close(isOpened: boolean = true): void {
    this.closed.emit();
  }

  public animationDone(event: any): void {
    if (event.fromState === 'collapsed' && event.toState === 'opened') {
      this.isAnimationCompleted = true;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }
}

@Component({
  selector: 'app-mobile-product-card',
  template:
    '<div class="AxDisconnectionsCardComponentClass">\n' +
    '    <div class=\'layer-outside\' (click)=\'close(isOpened)\'></div>\n' +
    '    <div class=\'modal-container right\' [@sliderAnimationTrigger]="isOpened ? \'opened\' : \'collapsed\'"\n' +
    '        (@sliderAnimationTrigger.done)="animationDone($event)">\n' +
    '        <div class=\'close-btn\' [title]="translatedTitles[\'GENERAL\'][\'CLOSE\']" (click)="close(isOpened)">\n' +
    '            <span class=\'font-icons icon-close2\'></span>\n' +
    '        </div>\n' +
    '        <ax-loader [spinnerWidth]="120" [spinnerHeight]="120" [show]="showAxLoader">\n' +
    '        </ax-loader>\n' +
    '        <ng-container *ngIf="isAnimationCompleted">\n' +
    '            <div class=\'header\'>\n' +
    '                <h1>AppMobileProductCardComponent</h1>' +
    '            </div>\n' +
    '        </ng-container>\n' +
    '    </div>\n' +
    '</div>\n',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sliderAnimationTrigger', [
      state(
        'collapsed',
        style({
          width: '0px',
        })
      ),
      state(
        'opened',
        style({
          width: '95%',
        })
      ),
      transition('collapsed => opened', [animate('0.2s')]),
    ]),
  ],
})
export class AppMobileProductCardComponent implements IAppProductCard, OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() productCard: IProductCard;
  @Output() closed: EventEmitter<any> = new EventEmitter();
  @HostBinding('@sliderAnimationTrigger') public isOpened = false;

  public translatedTitles: any = {};
  public isAnimationCompleted = false;
  public showAxLoader = false;
  private destroy$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isOpened = true;
    }, 0);
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  public close(isOpened: boolean = true): void {
    this.closed.emit();
  }

  public animationDone(event: any): void {
    if (event.fromState === 'collapsed' && event.toState === 'opened') {
      this.isAnimationCompleted = true;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }
}

// == MobileCardFactory end

@Injectable()
export class CardFactoryService {
  public cardFactory: ICardFactory;

  constructor(protected componentFactoryResolver: ComponentFactoryResolver) {
    const isMobile = true; // значение можно получать из отдельного сервиса

    this.setCardFactory(isMobile);
  }

  createOrderCardComponent(container: ViewContainerRef): ComponentRef<IAppOrderCard> {
    return container.createComponent(this.cardFactory.createOrderCard());
  }

  createProductCardComponent(container: ViewContainerRef): ComponentRef<IAppProductCard> {
    return container.createComponent(this.cardFactory.createProductCard());
  }

  setCardFactory(isMobile: boolean) {
    switch (isMobile) {
      case true: {
        this.cardFactory = new MobileCardFactory(this.componentFactoryResolver);
        break;
      }
      default: {
        this.cardFactory = new DesktopCardFactory(this.componentFactoryResolver);
      }
    }
  }

  // Пример использования сервиса в компонентах:
  // public showOrderCard(rowData) {
  //   this.container.clear();
  //   const instantCmp: ComponentRef<IAppOrderCard> = this.cardFactoryService.createOrderCardComponent(this.container);
  //   instantCmp.instance.productCard = rowData;
  //   instantCmp.instance.closed.subscribe(() => {
  //     this.container.clear();
  //   });
  //   this.instantCmp = instantCmp;
  // }
  //
  // public showProductCard(rowData) {
  //   this.container.clear();
  //   const instantCmp: ComponentRef<IAppProductCard> = this.cardFactoryService.createProductCardComponent(this.container);
  //   instantCmp.instance.productCard = rowData;
  //   instantCmp.instance.closed.subscribe(() => {
  //     this.container.clear();
  //   });
  //   this.instantCmp = instantCmp;
  // }
}
