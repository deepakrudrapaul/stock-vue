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
  @Input() columns: any[] = [];
  @Input() isLoading: boolean = false;

}
