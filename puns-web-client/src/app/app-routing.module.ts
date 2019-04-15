import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';
import {NotAuthenticatedGuardService} from './security/not-authenticated-guard.service';

const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [NotAuthenticatedGuardService]},
  { path: 'public', loadChildren: './public/public.module#PublicModule' },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports:  [RouterModule]
})
export class AppRoutingModule {}
