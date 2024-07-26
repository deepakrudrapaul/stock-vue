import { Component, EventEmitter, Output } from '@angular/core';
import { AppConstants } from '../../utils/app-constants';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  templateUrl:'./nav-bar.component.html',
  imports: [RouterModule, FormsModule, MenubarModule, ButtonModule, CommonModule],
  styles: [],
})
export class NavBarComponent {
  appConstants = AppConstants;
  @Output() themeChanged = new EventEmitter<Boolean>(false);


  onModeChange(event: any) {
    this.themeChanged.emit(event.target.checked)
  }

  items = [
    {
      label: 'Home',
      route: ''
    },
    {
      label: 'Futures',
      items: [
        {
          label: 'OI Scan',
          route: this.appConstants.Routes.OI_SCAN
        },
        {
          label: 'OI Buildup',
          route: this.appConstants.Routes.OI_BUILD_UP
        },
      ]
    },
    {
      label: 'Options',
      items: [
        {
          label: 'OI Diff',
          route: this.appConstants.Routes.OI_DIFF
        }
      ]
    }

  ]
}
