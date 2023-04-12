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
    this.getTodaysData();
  }







  async getTodaysData() {
    this.isLoading = true;
    const currentDate = DateTime.now().toFormat("yyyy-MM-dd")
    try{
      const res:any =  await this.dataService.getOiData(currentDate);
      this.isLoading = false;
      this.currentDayData = res.data;
      console.log(this.currentDayData)
    } catch(error:any) {
      this.isLoading = false;
      alert(error?.message);
    }
  }


}
