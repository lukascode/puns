import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StatisticsComponent} from './statistics/statistics.component';

const STATISTICS_ROUTING: Routes = [
  {
    path: '', component: StatisticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(STATISTICS_ROUTING)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule {}
