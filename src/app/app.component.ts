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
  currentDate = DateTime.now().toFormat("yyyy-MM-dd")
  currentStock:any = null;
  stockList = ["AUBANK", "INDUSINDBK", "HDFCLIFE", "GODREJPROP", "EICHERMOT", "TVSMOTOR", "SBICARD", "ESCORTS", "WHIRLPOOL", "DIXON", "DABUR", "APOLLOHOSP", "CANBK", "ABFRL", "POWERGRID", "M&MFIN", "NAVINFLUOR", "DLF", "AXISBANK", "CHAMBLFERT", "BAJAJFINSV", "CUB", "PNB", "IRCTC", "BANKNIFTY", "KOTAKBANK", "DEEPAKNTR", "ASTRAL", "ADANIENT", "RBLBANK", "INDIAMART", "POLYCAB", "HINDALCO", "JUBLFOOD", "BALKRISIND", "ICICIBANK", "MFSL", "SBIN", "TATAMOTORS", "ABCAPITAL", "ABB", "ASIANPAINT", "VOLTAS", "BAJFINANCE", "MUTHOOTFIN", "OBEROIRLTY", "AUROPHARMA", "RAIN", "BOSCHLTD", "ONGC", "FEDERALBNK", "HDFC", "TORNTPOWER", "PEL", "CONCOR", "SRF", "ADANIPORTS", "BANKBARODA", "MARUTI", "BATAINDIA", "ACC", "TATACHEM", "ITC", "L&TFH", "GMRINFRA", "HDFCBANK", "HDFCAMC", "RELIANCE", "HAVELLS", "ASHOKLEY", "MRF", "JSWSTEEL", "SBILIFE", "HINDUNILVR", "UBL", "DALBHARAT", "IDFCFIRSTB", "IGL", "TATACOMM", "AARTIIND", "BHEL", "JINDALSTEL", "BIOCON", "MANAPPURAM", "IDFC", "TATACONSUM", "NESTLEIND", "ALKEM", "PIDILITIND", "BEL", "NIFTY", "CHOLAFIN", "INDIGO", "BAJAJ-AUTO", "EXIDEIND", "VEDL", "APOLLOTYRE", "ATUL", "PIIND", "COROMANDEL", "GNFC", "TITAN", "ICICIPRULI", "FSL", "TATASTEEL", "MARICO", "TRENT", "BRITANNIA", "DELTACORP", "ZYDUSLIFE", "HAL", "M&M", "SIEMENS", "CIPLA", "PAGEIND", "CANFINHOME", "GLENMARK", "OFSS", "METROPOLIS", "IBULHSGFIN", "ULTRACEMCO", "JKCEMENT", "ICICIGI", "UPL", "HINDCOPPER", "TATAPOWER", "GAIL", "ABBOTINDIA", "GUJGASLTD", "COLPAL", "CROMPTON", "LALPATHLAB", "PVR", "BHARTIARTL", "MCDOWELL-N", "DRREDDY", "IEX", "BHARATFORG", "MGL", "TORNTPHARM", "INTELLECT", "CUMMINSIND", "SHRIRAMFIN", "GODREJCP", "HONAUT", "MOTHERSON", "INDHOTEL", "IPCALAB", "SYNGENE", "AMBUJACEM", "LICHSGFIN", "DIVISLAB", "COFORGE", "BERGEPAINT", "GRASIM", "MCX", "COALINDIA", "NAUKRI", "WIPRO", "IOC", "LTTS", "SHREECEM", "LUPIN", "HEROMOTOCO", "SUNTV", "LT", "SUNPHARMA", "NATIONALUM", "GRANULES", "SAIL", "RAMCOCEM", "BPCL", "INDUSTOWER", "NTPC", "RECLTD", "TCS", "ZEEL", "PETRONET", "NMDC", "INDIACEM", "HCLTECH", "TECHM", "BANDHANBNK", "HINDPETRO", "BALRAMCHIN", "IDEA", "BSOFT", "PFC", "MPHASIS", "INFY", "LAURUSLABS", "PERSISTENT", "LTIM"]


  headers: string[] = ['SYMBOL', 'CLOSE', 'OI', 'CHANGE OI', 'LOTS TRADED', '1 DAY PRICE CH', '1 DAY OI CH'];
  expiryStartData:OiData[] = [];
  currentDayData:any[] = [];
  previousDayData:any[] = [];
  isLoading: boolean = false;

  dummyData = [{"close": 40833.55, "symbol": "BANKNIFTY", "changeOi": 26474775, "timestamp": "2023-03-31", "lotsTraded": 57757754, "openInterest": 76277775}]

  constructor() {
    this.getTodaysData();
  }



  onStockChange(value:any) {
    console.log(value, this.currentDate)
    this.dataService.getStockOiData(value)?.then((res) => {
      this.currentDayData = res.data as any;
    });
  }




  async getTodaysData() {
    this.isLoading = true;
    try{
      const res:any =  await this.dataService.getOiData(this.currentDate);
      this.isLoading = false;
      this.currentDayData = res.data;
    } catch(error:any) {
      this.isLoading = false;
      alert(error?.message);
    }
  }


}
