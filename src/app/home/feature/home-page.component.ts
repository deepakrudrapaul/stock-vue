import { Component, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OiTableComponent } from '../ui/oi-table/oi-table.component';
import { HomeService } from '../data-access/home.service';


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
    OiTableComponent
  ],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {


  dataService = inject(HomeService);
  title = 'stock-vue';

  date:any;
  holidays = ['2023-01-26', '2023-03-07', '2023-03-30', '2023-04-04', '2023-04-07', '2023-04-14', '2023-05-01', '2023-06-28', '2023-08-15', '2023-09-19', '2023-10-02', '2023-10-24', '2023-11-14', '2023-11-27', '2023-12-25'];
  currentDate = DateTime.now().toFormat("yyyy-MM-dd");
  
  
  currentStock:any = null;
  stockList = ["AUBANK", "INDUSINDBK", "HDFCLIFE", "GODREJPROP", "EICHERMOT", "TVSMOTOR", "SBICARD", "ESCORTS", "WHIRLPOOL", "DIXON", "DABUR", "APOLLOHOSP", "CANBK", "ABFRL", "POWERGRID", "M&MFIN", "NAVINFLUOR", "DLF", "AXISBANK", "CHAMBLFERT", "BAJAJFINSV", "CUB", "PNB", "IRCTC", "BANKNIFTY", "KOTAKBANK", "DEEPAKNTR", "ASTRAL", "ADANIENT", "RBLBANK", "INDIAMART", "POLYCAB", "HINDALCO", "JUBLFOOD", "BALKRISIND", "ICICIBANK", "MFSL", "SBIN", "TATAMOTORS", "ABCAPITAL", "ABB", "ASIANPAINT", "VOLTAS", "BAJFINANCE", "MUTHOOTFIN", "OBEROIRLTY", "AUROPHARMA", "RAIN", "BOSCHLTD", "ONGC", "FEDERALBNK", "HDFC", "TORNTPOWER", "PEL", "CONCOR", "SRF", "ADANIPORTS", "BANKBARODA", "MARUTI", "BATAINDIA", "ACC", "TATACHEM", "ITC", "L&TFH", "GMRINFRA", "HDFCBANK", "HDFCAMC", "RELIANCE", "HAVELLS", "ASHOKLEY", "MRF", "JSWSTEEL", "SBILIFE", "HINDUNILVR", "UBL", "DALBHARAT", "IDFCFIRSTB", "IGL", "TATACOMM", "AARTIIND", "BHEL", "JINDALSTEL", "BIOCON", "MANAPPURAM", "IDFC", "TATACONSUM", "NESTLEIND", "ALKEM", "PIDILITIND", "BEL", "NIFTY", "CHOLAFIN", "INDIGO", "BAJAJ-AUTO", "EXIDEIND", "VEDL", "APOLLOTYRE", "ATUL", "PIIND", "COROMANDEL", "GNFC", "TITAN", "ICICIPRULI", "FSL", "TATASTEEL", "MARICO", "TRENT", "BRITANNIA", "DELTACORP", "ZYDUSLIFE", "HAL", "M&M", "SIEMENS", "CIPLA", "PAGEIND", "CANFINHOME", "GLENMARK", "OFSS", "METROPOLIS", "IBULHSGFIN", "ULTRACEMCO", "JKCEMENT", "ICICIGI", "UPL", "HINDCOPPER", "TATAPOWER", "GAIL", "ABBOTINDIA", "GUJGASLTD", "COLPAL", "CROMPTON", "LALPATHLAB", "PVR", "BHARTIARTL", "MCDOWELL-N", "DRREDDY", "IEX", "BHARATFORG", "MGL", "TORNTPHARM", "INTELLECT", "CUMMINSIND", "SHRIRAMFIN", "GODREJCP", "HONAUT", "MOTHERSON", "INDHOTEL", "IPCALAB", "SYNGENE", "AMBUJACEM", "LICHSGFIN", "DIVISLAB", "COFORGE", "BERGEPAINT", "GRASIM", "MCX", "COALINDIA", "NAUKRI", "WIPRO", "IOC", "LTTS", "SHREECEM", "LUPIN", "HEROMOTOCO", "SUNTV", "LT", "SUNPHARMA", "NATIONALUM", "GRANULES", "SAIL", "RAMCOCEM", "BPCL", "INDUSTOWER", "NTPC", "RECLTD", "TCS", "ZEEL", "PETRONET", "NMDC", "INDIACEM", "HCLTECH", "TECHM", "BANDHANBNK", "HINDPETRO", "BALRAMCHIN", "IDEA", "BSOFT", "PFC", "MPHASIS", "INFY", "LAURUSLABS", "PERSISTENT", "LTIM"]


  oiLosersList:any[] = [];
  oiGainersList:any[] = [];
  indexOiList:any[] = [];
  isLoading: boolean = false;

  dummyData = [{"close": 40833.55, "symbol": "BANKNIFTY", "changeOi": 26474775, "timestamp": "2023-03-31", "lotsTraded": 57757754, "openInterest": 76277775}]

  constructor() {
    this.getLastTradingDate();
    this.getOiGainersData();
    this.getOiLosersData();
    this.getIndexOiData();
    this.setCurrentDate();
  }



  setCurrentDate() {
    if(DateTime.now().hour < 18) {
      this.currentDate = DateTime.fromJSDate(this.getPreviousWeekdayDate()).toFormat("yyyy-MM-dd"); 
    }
  }

  getLastTradingDate() {
    if(DateTime.now().weekday < 6) {
      if(this.holidays.includes(this.currentDate)) {
        this.currentDate = DateTime.now().minus({days: 1}).toFormat("yyyy-MM-dd");
      }
    } else{
      const date  = this.getPreviousWeekdayDate();
      if(this.holidays.includes(DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"))) {
        this.currentDate = DateTime.fromJSDate(date).minus({days: 1}).toFormat("yyyy-MM-dd");
      }
    }
    
  }


  getPreviousWeekdayDate() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
    const daysToSubtract = (dayOfWeek === 0 ? 2 : (dayOfWeek === 1 ? 3 : 1));
    const previousWeekdayDate = new Date(today.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
    return previousWeekdayDate;
  }



  onStockChange(value:any) {
    console.log(value, this.currentDate)
    this.dataService.getStockOiData(value)?.then((res) => {
      // this.currentDayData = res.data as any;
    });
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
