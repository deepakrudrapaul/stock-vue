import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { FuturesService } from '../../data-access/futures.service';
import { FormsModule } from '@angular/forms';
import { TableComponent } from 'src/app/shared/ui/table/table.component';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AppConstants } from 'src/app/shared/utils/app-constants';


@Component({
    selector: 'app-oi-scan',
    imports: [CommonModule, TableComponent, FormsModule, DropdownModule, CalendarModule],
    templateUrl: './oi-scan.component.html',
    styleUrls: ['./oi-scan.component.scss'],
})
export class OiScanComponent implements OnInit {

  futureService = inject(FuturesService);

  currentDate = new Date();
  isLoading: boolean = false;

  columns = AppConstants.COLUMNS;

  currentStock:any = null;
  stockList = ["AUBANK", "INDUSINDBK", "HDFCLIFE", "GODREJPROP", "EICHERMOT", "TVSMOTOR", "SBICARD", "ESCORTS", "WHIRLPOOL", "DIXON", "DABUR", "APOLLOHOSP", "CANBK", "ABFRL", "POWERGRID", "M&MFIN", "NAVINFLUOR", "DLF", "AXISBANK", "CHAMBLFERT", "BAJAJFINSV", "CUB", "PNB", "IRCTC", "BANKNIFTY", "KOTAKBANK", "DEEPAKNTR", "ASTRAL", "ADANIENT", "RBLBANK", "INDIAMART", "POLYCAB", "HINDALCO", "JUBLFOOD", "BALKRISIND", "ICICIBANK", "MFSL", "SBIN", "TATAMOTORS", "ABCAPITAL", "ABB", "ASIANPAINT", "VOLTAS", "BAJFINANCE", "MUTHOOTFIN", "OBEROIRLTY", "AUROPHARMA", "RAIN", "BOSCHLTD", "ONGC", "FEDERALBNK", "HDFC", "TORNTPOWER", "PEL", "CONCOR", "SRF", "ADANIPORTS", "BANKBARODA", "MARUTI", "BATAINDIA", "ACC", "TATACHEM", "ITC", "L&TFH", "GMRINFRA", "HDFCBANK", "HDFCAMC", "RELIANCE", "HAVELLS", "ASHOKLEY", "MRF", "JSWSTEEL", "SBILIFE", "HINDUNILVR", "UBL", "DALBHARAT", "IDFCFIRSTB", "IGL", "TATACOMM", "AARTIIND", "BHEL", "JINDALSTEL", "BIOCON", "MANAPPURAM", "IDFC", "TATACONSUM", "NESTLEIND", "ALKEM", "PIDILITIND", "BEL", "NIFTY", "CHOLAFIN", "INDIGO", "BAJAJ-AUTO", "EXIDEIND", "VEDL", "APOLLOTYRE", "ATUL", "PIIND", "COROMANDEL", "GNFC", "TITAN", "ICICIPRULI", "FSL", "TATASTEEL", "MARICO", "TRENT", "BRITANNIA", "DELTACORP", "ZYDUSLIFE", "HAL", "M&M", "SIEMENS", "CIPLA", "PAGEIND", "CANFINHOME", "GLENMARK", "OFSS", "METROPOLIS", "IBULHSGFIN", "ULTRACEMCO", "JKCEMENT", "ICICIGI", "UPL", "HINDCOPPER", "TATAPOWER", "GAIL", "ABBOTINDIA", "GUJGASLTD", "COLPAL", "CROMPTON", "LALPATHLAB", "PVR", "BHARTIARTL", "MCDOWELL-N", "DRREDDY", "IEX", "BHARATFORG", "MGL", "TORNTPHARM", "INTELLECT", "CUMMINSIND", "SHRIRAMFIN", "GODREJCP", "HONAUT", "MOTHERSON", "INDHOTEL", "IPCALAB", "SYNGENE", "AMBUJACEM", "LICHSGFIN", "DIVISLAB", "COFORGE", "BERGEPAINT", "GRASIM", "MCX", "COALINDIA", "NAUKRI", "WIPRO", "IOC", "LTTS", "SHREECEM", "LUPIN", "HEROMOTOCO", "SUNTV", "LT", "SUNPHARMA", "NATIONALUM", "GRANULES", "SAIL", "RAMCOCEM", "BPCL", "INDUSTOWER", "NTPC", "RECLTD", "TCS", "ZEEL", "PETRONET", "NMDC", "INDIACEM", "HCLTECH", "TECHM", "BANDHANBNK", "HINDPETRO", "BALRAMCHIN", "IDEA", "BSOFT", "PFC", "MPHASIS", "INFY", "LAURUSLABS", "PERSISTENT", "LTIM"]
  oiStockList:any = [];
  

  constructor() {}

  ngOnInit(): void {
    this.stockList.sort();
    this.stockList.unshift(...['NIFTY', 'BANKNIFTY']);
    this.getStockOiData(this.currentStock, DateTime.fromJSDate(this.currentDate).toFormat("yyyy-MM-dd"));
  }

  onStockChange(value:any, currentDate: any) {
    this.getStockOiData(value ? value : "", DateTime.fromJSDate(currentDate).toFormat("yyyy-MM-dd"));
  }

  onDateChange(value:any, currentStock:any) {
    this.getStockOiData(currentStock, DateTime.fromJSDate(value).toFormat("yyyy-MM-dd"));
  }


  getStockOiData(value:any, currentDate: any){
    this.isLoading = true;
    this.futureService.getStockOiData(value, currentDate)?.then((res) => {
      this.oiStockList = res.data as any;
      this.isLoading = false;
    });
  }


}
