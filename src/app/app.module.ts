import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// import { BaasicApp } from 'baasic-sdk-angular';

import { LoginComponent } from './route-components/login/login.component';
import { DashboardComponent } from './route-components/dashboard/dashboard.component';
import { CreateReportComponent } from './route-components/create-report/create-report.component';
import { PasswordResetComponent } from './route-components/password-reset/password-reset.component';
import { NotFoundComponent } from './route-components/not-found/not-found.component';

import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ReportsTableComponent } from './components/reports-table/reports-table.component';
import { ReportElementComponent } from './components/report-element/report-element.component';
import { WarningComponent } from './components/warning/warning.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CreateReportComponent,
    PasswordResetComponent,
    NotFoundComponent,
    HeaderComponent,
    NavigationComponent,
    ReportsTableComponent,
    ReportElementComponent,
    WarningComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // BaasicApp.forRoot('daily-report-app', {
    //   apiRootUrl: "api.baasic.com",
    //   apiVersion: "1.0.8.233"
    // })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
