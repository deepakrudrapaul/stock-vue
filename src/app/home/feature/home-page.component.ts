import { Component, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../data-access/home.service';
import { TableComponent } from 'src/app/shared/ui/table/table.component';
import { getPreviousWeekdayDate } from 'src/app/shared/utils/utils';


interface OiData {
  symbol: string,
  close: number,
  changeOi: number,
  timestamp: string,
  openInterest: number,
  lotsTraded: number,

}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableComponent
  ],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {


  dataService = inject(HomeService);

  date:any;
  holidays = ['2023-01-26', '2023-03-07', '2023-03-30', '2023-04-04', '2023-04-07', '2023-04-14', '2023-05-01', '2023-06-28', '2023-08-15', '2023-09-19', '2023-10-02', '2023-10-24', '2023-11-14', '2023-11-27', '2023-12-25'];
  currentDate = DateTime.now().toFormat("yyyy-MM-dd");
  columns = [
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
  


  oiLosersList:any[] = [];
  oiGainersList:any[] = [];
  indexOiList:any[] = [];
  isLoading: boolean = false;


  constructor() {
    this.setCurrentDate();
    this.getLastTradingDate();
    this.getOiGainersData();
    this.getOiLosersData();
    this.getIndexOiData();
  }



  setCurrentDate() {
    if(DateTime.now().hour < 18) {
      this.currentDate = DateTime.fromJSDate(getPreviousWeekdayDate()).toFormat("yyyy-MM-dd"); 
    }
  }

  getLastTradingDate() {
    if(DateTime.now().weekday < 6) {
      if(this.holidays.includes(this.currentDate)) {
        this.currentDate = DateTime.now().minus({days: 1}).toFormat("yyyy-MM-dd");
      }
    } else{
      const date  = getPreviousWeekdayDate();
      if(this.holidays.includes(DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"))) {
        this.currentDate = DateTime.fromJSDate(date).minus({days: 1}).toFormat("yyyy-MM-dd");
      } else{
        this.currentDate = DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
      }
    }
    
  }


 






  async getOiGainersData() {
    this.isLoading = true;
    try{
      const res:any =  await this.dataService.getOiGainersData(this.currentDate);
      this.isLoading = false;
      this.oiGainersList = res.data;
    } catch(error:any) {
      this.isLoading = false;
      alert(error?.message);
    }
  }


  async getOiLosersData() {
    this.isLoading = true;
    try{
      const res:any =  await this.dataService.getOiLosersData(this.currentDate);
      this.isLoading = false;
      this.oiLosersList = res.data;
    } catch(error:any) {
      this.isLoading = false;
      alert(error?.message);
    }
  }

  async getIndexOiData() {
    this.isLoading = true;
    try{
      const res:any =  await this.dataService.getIndexOiData('NIFTY', this.currentDate);
      this.isLoading = false;
      this.indexOiList = res.data;
    } catch(error:any) {
      this.isLoading = false;
      alert(error?.message);
    }
  }


}
