import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { httpInjectable } from './utils/services/http-injectable.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationComponent } from './components/notification/notification.component';
import { LoginComponent } from './user/login/login.component';
import { FormItemComponent } from './components/form-item/form-item.component';
import { InputDirective } from './components/input/input.directive';
import { ButtonComponent } from './components/button/button.component';
import { LayoutComponent as UserLayout } from './user/layout/layout.component';
import { RegisterComponent } from './user/register/register.component';
import { LayoutComponent as MainLayout } from './main/layout/layout.component';

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    LoginComponent,
    FormItemComponent,
    InputDirective,
    ButtonComponent,
    UserLayout,
    RegisterComponent,
    MainLayout,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [httpInjectable],
  bootstrap: [AppComponent],
})
export class AppModule {}
