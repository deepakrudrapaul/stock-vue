import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { FormsModule } from '@angular/forms';
import { HomePageComponent } from './home-page/home-page.component';
import { OiTableComponent } from '../ui/oi-table/oi-table.component';


@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    OiTableComponent
  ]
})
export class HomeModule { }
