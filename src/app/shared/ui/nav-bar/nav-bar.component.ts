import { Component } from '@angular/core';
import { AppConstants } from '../../utils/app-constants';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="navbar bg-base-100">
    <!-- <div class="navbar-start">
            <select class="select select-bordered mr-3 max-w-xs"  (ngModelChange)="onStockChange($event)" [(ngModel)]="currentStock">
              <option value="null" disabled selected>Select Stock</option>
              <option [ngValue]="item" *ngFor="let item of stockList">{{item}}</option>
            </select>

      <input [(ngModel)]="currentDate" type="date" placeholder="Type here" class="input input-bordered  max-w-xs" />
    </div> -->
    <div class="navbar-center hidden lg:flex">
      <a routerLink="{{appConstants.Routes.HOME}}" class="btn btn-ghost normal-case text-xl">Stock Vue</a>
      <a routerLinkActive="btn-active" routerLink="{{appConstants.Routes.OI_SCAN}}" class="btn btn-ghost normal-case text-xl">OI Scan</a>

      <a routerLinkActive="btn-active" routerLink="{{appConstants.Routes.OI_BUILD_UP}}" class="btn btn-ghost normal-case text-xl">OI Buildup</a>

      <!-- <ul class="menu menu-horizontal px-1">
        <li routerLinkActive="active" routerLink="{{appConstants.Routes.OI_SCAN}}"><a>OI Scan</a></li>
        <li routerLink="{{appConstants.Routes.OI_BUILD_UP}}"><a>OI Buildup</a></li>
      </ul> -->
    </div>
    <div class="navbar-end">
      <!-- <a class="btn">Login</a> -->
    </div>
</div>
  `,
  styles: [
  ]
})
export class NavBarComponent {

  appConstants = AppConstants;

}
