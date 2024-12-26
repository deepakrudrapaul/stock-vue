import { Component, EventEmitter, Output } from '@angular/core';
import { AppConstants } from '../../utils/app-constants';
import { RouterLink, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    imports: [RouterLink, MenubarModule, ButtonModule, CommonModule],
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
