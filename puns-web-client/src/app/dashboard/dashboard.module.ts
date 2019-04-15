import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { SharedModule } from '../shared/shared.module';
import {DashboardRoutingModule} from './dashboard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [HomeComponent, MainNavComponent]
})
export class DashboardModule { }
