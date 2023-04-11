import { Component, inject } from '@angular/core';
import { DataService } from './services/data.service';
import { DateTime } from 'luxon';
import { PostgrestSingleResponse } from '@supabase/supabase-js';


interface OiData {
  symbol: string,
  close: number,
  changeOi: number,
  timestamp: string,
  openInterest: number,
  lotsTraded: number,

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  dataService = inject(DataService);
  title = 'stock-vue';

  date:any;

  headers: string[] = ['SYMBOL', 'CLOSE', 'OI', 'CHANGE OI', 'LOTS TRADED', '1 DAY PRICE CH', '1 DAY OI CH'];
  expiryStartData:OiData[] = [];
  currentDayData:any[] = [];
  previousDayData:any[] = [];
  isLoading: boolean = false;

  dummyData = [{"close": 40833.55, "symbol": "BANKNIFTY", "changeOi": 26474775, "timestamp": "2023-03-31", "lotsTraded": 57757754, "openInterest": 76277775}]

  constructor() {
    this.getFirstDayData();
    this.getPreviousDayData();
  }

  getExpiryStartDate(year:number, month:number) {
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let lastFriday = 0;
  
    for (let day = lastDayOfMonth; day > 0; day--) {
      const date = new Date(year, month, day);
      const dayOfWeek = daysOfWeek[date.getDay()];
  
      if (dayOfWeek === 'Friday') {
        lastFriday = day; 
        break;
      }
    }
  
    return new Date(year, month, lastFriday);
  }

  




  getChangePercentage(previous: number, current: number) {
      let percent = (current - previous)/ current * 100;
      return percent.toFixed(1);
  }


  getChangePercentageDataWithTodaysData(previousData:any, todaysData: any){
    todaysData.forEach((item:any, index:number) => {
      if(previousData[index].symbol === item.symbol) {
        item["oneDayPriceChange"] = this.getChangePercentage(previousData[index].close, item.close)
        item["oneDayOiChange"] = this.getChangePercentage(previousData[index].openInterest, item.openInterest)
      }
    })
  }


  getPreviousWeekdayDate() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
    const daysToSubtract = (dayOfWeek === 0 ? 2 : (dayOfWeek === 1 ? 3 : 1));
    const previousWeekdayDate = new Date(today.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
    return previousWeekdayDate;
  }
  


  async getFirstDayData() {
    this.isLoading = true;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const expiryStartDate = DateTime.fromJSDate(this.getExpiryStartDate(currentYear, currentMonth - 1)).toFormat("yyyy-MM-dd");
  

    try{
      const res:any =  await this.dataService.getOiData(expiryStartDate);
      this.isLoading = false;
      this.expiryStartData = res.data.data;
    } catch(error:any) {
      this.isLoading = false;
      alert(error?.message);
    }
  }


  async getPreviousDayData() {
    this.isLoading = true;
    const date = DateTime.fromJSDate(this.getPreviousWeekdayDate()).toFormat("yyyy-MM-dd")
    try{
      const res:any =  await this.dataService.getOiData(date);
      this.isLoading = false;
      this.previousDayData = res.data.data;
      this.getTodaysData();
    } catch(error:any) {
      this.isLoading = false;
      alert(error?.message);
    }
  }


  async getTodaysData() {
    this.isLoading = true;
    const currentDate = DateTime.now().toFormat("yyyy-MM-dd")
    try{
      const res:any =  await this.dataService.getOiData(currentDate);
      this.isLoading = false;
      this.currentDayData = res.data.data;
      this.getChangePercentageDataWithTodaysData(this.previousDayData, this.currentDayData)
      console.log(this.currentDayData)
    } catch(error:any) {
      this.isLoading = false;
      alert(error?.message);
    }
  }


}
