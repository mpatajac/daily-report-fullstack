import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '@app/route-components/login/login.component';
import { DashboardComponent } from '@app/route-components/dashboard/dashboard.component';
import { DisplayReportComponent } from '@app/route-components/display-report/display-report.component';
import { CreateReportComponent } from '@app/route-components/create-report/create-report.component';
import { PasswordResetComponent } from '@app/route-components/password-reset/password-reset.component';
import { NotFoundComponent } from '@app/route-components/not-found/not-found.component';

import { UserAuthGuard } from '@app/common/guards/user-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'app',
    redirectTo: '/app/dashboard',
    pathMatch: 'full' },
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
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
