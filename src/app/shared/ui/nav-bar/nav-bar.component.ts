import { Component, EventEmitter, Output } from '@angular/core';
import { AppConstants } from '../../utils/app-constants';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  templateUrl:'./nav-bar.component.html',
  imports: [RouterModule, FormsModule],
  styles: [],
})
export class NavBarComponent {
  appConstants = AppConstants;
  @Output() themeChanged = new EventEmitter<Boolean>(false);


  onModeChange(event: any) {
    this.themeChanged.emit(event.target.checked)
  }
}
