import { SearchComponent } from './main/content/search/search.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { LayoutComponent as UserLayout } from './user/layout/layout.component';
import { LayoutComponent as MainLayout } from './main/layout/layout.component';
import { MusicComponent } from './music/music.component';
import { EncodeComponent } from './encode/encode.component';
import { LibraryComponent } from './library/library.component';
import { SheetListComponent } from './main/content/sheet-list/sheet-list.component';
import { AuthGuard } from './auth/auth.guard';
const routes: Routes = [
  {
    path: 'user',
    component: UserLayout,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: {
          animateName: 'left',
        },
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: {
          animateName: 'right',
        },
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ],
  },
  {
    path: 'music',
    component: MusicComponent,
  },
  {
    path: 'library',
    component: LibraryComponent,
  },
  {
    path: 'encode',
    component: EncodeComponent,
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'search',
        component: SearchComponent,
      },
      {
        path: 'sheetList/:sheetId',
        component: SheetListComponent,
        // canActivate: [AuthGuard],
      },
      { path: '', pathMatch: 'full', redirectTo: 'search' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
