import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './route-components/login/login.component';
import { DashboardComponent } from './route-components/dashboard/dashboard.component';
import { DisplayReportComponent } from './route-components/display-report/display-report.component';
import { CreateReportComponent } from './route-components/create-report/create-report.component';
import { PasswordResetComponent } from './route-components/password-reset/password-reset.component';
import { NotFoundComponent } from './route-components/not-found/not-found.component';

import { UserAuthGuard } from './common/guards/user-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'app',
    redirectTo: '/app/dashboard',
    pathMatch: 'full',
    canActivate: [UserAuthGuard]
  },
  {
    path: 'app/dashboard',
    component: DashboardComponent,
    canActivate: [UserAuthGuard]
  },
  {
    path: 'app/dashboard/:page',
    component: DashboardComponent,
    canActivate: [UserAuthGuard]
  },
  {
    path: 'app/report/:id',
    component: DisplayReportComponent,
    canActivate: [UserAuthGuard]
  },
  {
    path: 'app/new',
    component: CreateReportComponent,
    canActivate: [UserAuthGuard]
  },
  {
    path: 'app/passreset',
    component: PasswordResetComponent,
    canActivate: [UserAuthGuard]
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    // scrolls back to top
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
