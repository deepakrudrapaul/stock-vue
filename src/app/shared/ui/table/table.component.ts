import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() title!:string;
  @Input() list!: any[];
  @Input() isLoading: boolean = false;
  headers: string[] = ['Symbol',  'Price Change', 'OI Change', 'Date'];

}
