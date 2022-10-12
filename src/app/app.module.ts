import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpInjectable } from './utils/services/http-injectable.service';
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
import { RowDirective } from './components/layout/row.directive';
import { ColDirective } from './components/layout/col.directive';
import { UserService } from './user/user.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotificationService } from './utils/services/notification.service';
import { LoadingDirective } from './components/loading/loading.directive';

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    LoginComponent,
    FormItemComponent,
    InputDirective,
    ColDirective,
    RowDirective,
    ButtonComponent,
    UserLayout,
    RegisterComponent,
    MainLayout,
    LoadingDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    NotificationService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInjectable, multi: true },
    UserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
