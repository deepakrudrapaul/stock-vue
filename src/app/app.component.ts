import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  document: Document = inject(DOCUMENT);


  onThemeChange(value:Boolean) {
    this.document.querySelector('html')?.setAttribute('data-theme', value ? 'dark' : 'light');
  }


}
