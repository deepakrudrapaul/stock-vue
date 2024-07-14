import { Component, EventEmitter, Output } from '@angular/core';
import { AppConstants } from '../../utils/app-constants';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  templateUrl:'./nav-bar.component.html',
  imports: [RouterModule, FormsModule, MenubarModule, ButtonModule],
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
        icon: 'pi pi-home',
        path: ''
    },
    {
        label: 'OI Scan',
        icon: 'pi pi-star',
        path: this.appConstants.Routes.OI_SCAN
    },
    {
      label: 'OI Buildup',
      icon: 'pi pi-star',
      path: this.appConstants.Routes.OI_BUILD_UP
    },
    {
      label: 'OI Diff',
      icon: 'pi pi-star',
      path: this.appConstants.Routes.OI_DIFF
    },

  ]
}
