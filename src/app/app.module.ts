import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  AppDesktopOrderCardComponent,
  AppDesktopProductCardComponent,
  AppMobileOrderCardComponent,
  AppMobileProductCardComponent
} from './patterns/creational/abstract-factory';
import { FirstPageComponent, SecondPageComponent } from './patterns/behavioral/strategy';

@NgModule({
  declarations: [
    AppComponent,
    AppDesktopOrderCardComponent,
    AppDesktopProductCardComponent,
    AppMobileOrderCardComponent,
    AppMobileProductCardComponent,
    FirstPageComponent,
    SecondPageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
