import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LandingComponent } from './route-components/landing/landing.component';
import { DashboardComponent } from './route-components/dashboard/dashboard.component';
import { CreateReportComponent } from './route-components/create-report/create-report.component';
import { PasswordResetComponent } from './route-components/password-reset/password-reset.component';

import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ReportsTableComponent } from './components/reports-table/reports-table.component';
import { ReportElementComponent } from './components/report-element/report-element.component';
import { WarningComponent } from './components/warning/warning.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    DashboardComponent,
    CreateReportComponent,
    PasswordResetComponent,
    LoginComponent,
    HeaderComponent,
    NavigationComponent,
    ReportsTableComponent,
    ReportElementComponent,
    WarningComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
