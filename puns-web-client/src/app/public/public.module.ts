import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PublicRoutingModule} from './public-routing.module';
import {LoginComponent} from './login/login.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PublicRoutingModule
  ],
  declarations: [LoginComponent, RegisterComponent]
})
export class PublicModule { }
