import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { httpInjectable } from './utils/services/http-injectable.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationComponent } from './components/notification/notification.component';
import { LoginComponent } from './user/login/login.component';
import { FormItemComponent } from './components/form-item/form-item.component';
import { FormItemContentDirective } from './utils/directive/form-item-content.directive';
import { InputDirective } from './components/input/input.directive';

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    LoginComponent,
    FormItemComponent,
    FormItemContentDirective,
    InputDirective,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [httpInjectable],
  bootstrap: [AppComponent],
})
export class AppModule {}
