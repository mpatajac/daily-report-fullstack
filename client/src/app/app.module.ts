import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from '@app/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from '@app/app.component';

import { LoginComponent } from '@app/route-components/login/login.component';
import { DashboardComponent } from '@app/route-components/dashboard/dashboard.component';
import { CreateReportComponent } from '@app/route-components/create-report/create-report.component';
import { PasswordResetComponent } from '@app/route-components/password-reset/password-reset.component';
import { NotFoundComponent } from '@app/route-components/not-found/not-found.component';
import { ReadReportComponent } from '@app/route-components/read-report/read-report.component';
import { ConfirmReportComponent } from '@app/route-components/confirm-report/confirm-report.component';
import { ReportImproperFormatComponent } from '@app/route-components/report-improper-format/report-improper-format.component';

import { HeaderComponent } from '@app/components/header/header.component';
import { NavigationComponent } from '@app/components/navigation/navigation.component';
import { ReportsTableComponent } from '@app/components/reports-table/reports-table.component';
import { ReportElementComponent } from '@app/components/report-element/report-element.component';
import { DisplayReportComponent } from '@app/components/display-report/display-report.component';
import { BackButtonComponent } from '@app/components/back-button/back-button.component';


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
    ConfirmReportComponent,
    ReadReportComponent,
    BackButtonComponent,
    ReportImproperFormatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
