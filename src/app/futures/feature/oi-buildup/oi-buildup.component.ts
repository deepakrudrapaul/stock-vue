import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { FuturesService } from '../../data-access/futures.service';
import { getPreviousWeekdayDate } from 'src/app/shared/utils/utils';
import { TableComponent } from 'src/app/shared/ui/table/table.component';


@Component({
  selector: 'app-oi-buildup',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './oi-buildup.component.html',
  styleUrls: ['./oi-buildup.component.scss']
})
export class OiBuildupComponent {
  futureService = inject(FuturesService);

  currentDate = DateTime.now().toFormat("yyyy-MM-dd");
  isLoading: boolean = false;


  currentStock:any = null;
  longBuildupList:any = [];
  shortBuildupList:any = [];
  

  constructor() {
    this.setCurrentDate();
    this.getLongBuildupStocks(this.currentDate);
    this.getShortBuildupStocks(this.currentDate);
  }


  setCurrentDate() {
    if(DateTime.now().hour < 18) {
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
