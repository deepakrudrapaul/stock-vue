import { Component } from '@angular/core';
import { NavBarComponent } from './shared/ui/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
      RouterOutlet,
      NavBarComponent
    ]
})
export class AppComponent {


}
