import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './route-components/landing/landing.component';
import { DashboardComponent } from './route-components/dashboard/dashboard.component';
import { CreateReportComponent } from './route-components/create-report/create-report.component';
import { PasswordResetComponent } from './route-components/password-reset/password-reset.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'app/dashboard', component: DashboardComponent },
  { path: 'app/dashboard/:page', component: DashboardComponent },
  { path: 'app/new', component: CreateReportComponent },
  { path: 'app/passreset', component: PasswordResetComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
