import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FooterComponent } from './main/footer/footer.component';
import { AnalyserService } from './utils/services/analyser.service';
import { CanvasComponent } from './main/canvas/canvas.component';
import { ContentComponent } from './main/content/content/content.component';
import { SheetComponent } from './main/content/sheet/sheet.component';
import { AsyncClickComponent } from './components/async-click/async-click.component';
import { SearchComponent } from './main/content/search/search.component';
import { ShowDirective } from './components/show/show.directive';
import { ArrayItemJoinPipe } from './utils/pipe/array-item-join.pipe';
import { PlaylistComponent } from './main/content/playlist/playlist.component';
import { TableComponent } from './components/table/table.component';
import { RenderPipe } from './utils/pipe/render.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { MusicComponent } from './music/music.component';

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
    FooterComponent,
    CanvasComponent,
    ContentComponent,
    SheetComponent,
    AsyncClickComponent,
    SearchComponent,
    ShowDirective,
    ArrayItemJoinPipe,
    PlaylistComponent,
    TableComponent,
    RenderPipe,
    PaginationComponent,
    MusicComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    NotificationService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInjectable, multi: true },
    UserService,
    AnalyserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
