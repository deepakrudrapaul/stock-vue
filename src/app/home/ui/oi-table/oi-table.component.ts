import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oi-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oi-table.component.html',
  styleUrls: ['./oi-table.component.scss']
})
export class OiTableComponent {
  @Input() title!:string;
  @Input() list!: any[];
  @Input() isLoading: boolean = false;
  headers: string[] = ['Symbol',  'Price Change', 'OI Change'];

}
