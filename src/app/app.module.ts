import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './route-components/login/login.component';
import { DashboardComponent } from './route-components/dashboard/dashboard.component';
import { DisplayReportComponent } from './route-components/display-report/display-report.component';
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
    DisplayReportComponent,
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
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
