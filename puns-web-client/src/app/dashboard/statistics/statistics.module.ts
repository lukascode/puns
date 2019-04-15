import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics/statistics.component';
import {StatisticsRoutingModule} from './statistics-routing.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StatisticsRoutingModule
  ],
  declarations: [StatisticsComponent]
})
export class StatisticsModule { }
