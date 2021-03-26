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
import { DisplayReportComponent } from '@app/route-components/display-report/display-report.component';
import { CreateReportComponent } from '@app/route-components/create-report/create-report.component';
import { PasswordResetComponent } from '@app/route-components/password-reset/password-reset.component';
import { NotFoundComponent } from '@app/route-components/not-found/not-found.component';

import { HeaderComponent } from '@app/components/header/header.component';
import { NavigationComponent } from '@app/components/navigation/navigation.component';
import { ReportsTableComponent } from '@app/components/reports-table/reports-table.component';
import { ReportElementComponent } from '@app/components/report-element/report-element.component';


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
