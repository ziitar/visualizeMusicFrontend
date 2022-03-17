import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { httpInjectable } from './utils/http-injectable.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [AppComponent, NotificationComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [httpInjectable],
  bootstrap: [AppComponent],
})
export class AppModule {}
