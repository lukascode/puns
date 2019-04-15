import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthenticatedGuardService} from '../security/authenticated-guard.service';
import {RegisterComponent} from './register/register.component';

const PUBLIC_ROUTING: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthenticatedGuardService] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthenticatedGuardService]}
];

@NgModule({
  imports: [RouterModule.forChild(PUBLIC_ROUTING)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
