import { ContentComponent } from './main/content/content/content.component';
import { CanvasComponent } from './main/canvas/canvas.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { LayoutComponent as UserLayout } from './user/layout/layout.component';
import { LayoutComponent as MainLayout } from './main/layout/layout.component';
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
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'visualize',
        component: CanvasComponent,
      },
      {
        path: 'content',
        component: ContentComponent,
      },
      { path: '', pathMatch: 'full', redirectTo: 'content' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
