import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { FuturesService } from '../../data-access/futures.service';
import { getPreviousWeekdayDate } from 'src/app/shared/utils/utils';
import { TableComponent } from 'src/app/shared/ui/table/table.component';
import { AppConstants } from 'src/app/shared/utils/app-constants';
import { Stock } from 'src/app/shared/model/stock.model';


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
  isLoading = false;
  columns = AppConstants.COLUMNS;


  currentStock = '';
  longBuildupList:Stock[] = [];
  shortBuildupList:Stock[] = [];
  
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
      this.longBuildupList = res.data as Stock[];
      this.isLoading = false;
    });
  }

  getShortBuildupStocks(date:string){
    this.isLoading = true;
    this.futureService.getShortBuildupStocks(date)?.then((res) => {
      this.shortBuildupList = res.data as Stock[];
      this.isLoading = false;
    });
  }


}
