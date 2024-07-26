import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { FuturesService } from '../../data-access/futures.service';
import { getPreviousWeekdayDate } from 'src/app/shared/utils/utils';
import { TableComponent } from 'src/app/shared/ui/table/table.component';
import { AppConstants } from 'src/app/shared/utils/app-constants';


@Component({
  selector: 'app-oi-buildup',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './oi-buildup.component.html',
  styleUrls: ['./oi-buildup.component.scss']
})
export class OiBuildupComponent implements OnInit {
  futureService = inject(FuturesService);

  currentDate = DateTime.now().toFormat("yyyy-MM-dd");
  isLoading: boolean = false;
  columns = AppConstants.COLUMNS;


  currentStock:any = null;
  longBuildupList:any = [];
  shortBuildupList:any = [];
  

  constructor() {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.getLongBuildupStocks(this.currentDate);
    this.getShortBuildupStocks(this.currentDate); 
  }


  setCurrentDate() {
    if(DateTime.now().hour < 22) {
      this.currentDate = DateTime.fromJSDate(getPreviousWeekdayDate()).toFormat("yyyy-MM-dd"); 
    }
  }


  getLongBuildupStocks(date:string){
    this.isLoading = true;
    this.futureService.getLongBuildupStocks(date)?.then((res) => {
      this.longBuildupList = res.data as any;
      this.isLoading = false;
    });
  }

  getShortBuildupStocks(date:string){
    this.isLoading = true;
    this.futureService.getShortBuildupStocks(date)?.then((res) => {
      this.shortBuildupList = res.data as any;
      this.isLoading = false;
    });
  }


}
