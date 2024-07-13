import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';


interface Column {
  label: string,
  field: string,
  dataType: string
}
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableModule, CardModule, ProgressSpinnerModule, SkeletonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() title!:string;
  @Input() list: any[] = [];
  @Input() isLoading: boolean = false;
  columns: Column[] = [
    {
      label : 'Symbol',
      field: 'symbol',
      dataType: 'string'
    },
    {
      label : 'Price Change',
      field: 'oneDayPriceChange',
      dataType: 'string'
    },
    {
      label : 'OI Change',
      field: 'oneDayOiChange',
      dataType: 'string'
    },
    {
      label : 'Volume Change',
      field: 'oneDayValueChange',
      dataType: 'string'
    },
    {
      label : 'Date',
      field: 'timestamp',
      dataType: 'date'
    }
  ];

}
