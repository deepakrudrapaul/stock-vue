import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { FuturesService } from '../../data-access/futures.service';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/ui/spinner/spinner.component';
import { TableComponent } from 'src/app/shared/ui/table/table.component';


@Component({
  selector: 'app-oi-scan',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent, FormsModule],
  templateUrl: './oi-scan.component.html',
  styleUrls: ['./oi-scan.component.scss']
})
export class OiScanComponent {

  futureService = inject(FuturesService);

  currentDate = DateTime.now().toFormat("yyyy-MM-dd");
  isLoading: boolean = false;


  currentStock:any = null;
  stockList = ["AUBANK", "INDUSINDBK", "HDFCLIFE", "GODREJPROP", "EICHERMOT", "TVSMOTOR", "SBICARD", "ESCORTS", "WHIRLPOOL", "DIXON", "DABUR", "APOLLOHOSP", "CANBK", "ABFRL", "POWERGRID", "M&MFIN", "NAVINFLUOR", "DLF", "AXISBANK", "CHAMBLFERT", "BAJAJFINSV", "CUB", "PNB", "IRCTC", "BANKNIFTY", "KOTAKBANK", "DEEPAKNTR", "ASTRAL", "ADANIENT", "RBLBANK", "INDIAMART", "POLYCAB", "HINDALCO", "JUBLFOOD", "BALKRISIND", "ICICIBANK", "MFSL", "SBIN", "TATAMOTORS", "ABCAPITAL", "ABB", "ASIANPAINT", "VOLTAS", "BAJFINANCE", "MUTHOOTFIN", "OBEROIRLTY", "AUROPHARMA", "RAIN", "BOSCHLTD", "ONGC", "FEDERALBNK", "HDFC", "TORNTPOWER", "PEL", "CONCOR", "SRF", "ADANIPORTS", "BANKBARODA", "MARUTI", "BATAINDIA", "ACC", "TATACHEM", "ITC", "L&TFH", "GMRINFRA", "HDFCBANK", "HDFCAMC", "RELIANCE", "HAVELLS", "ASHOKLEY", "MRF", "JSWSTEEL", "SBILIFE", "HINDUNILVR", "UBL", "DALBHARAT", "IDFCFIRSTB", "IGL", "TATACOMM", "AARTIIND", "BHEL", "JINDALSTEL", "BIOCON", "MANAPPURAM", "IDFC", "TATACONSUM", "NESTLEIND", "ALKEM", "PIDILITIND", "BEL", "NIFTY", "CHOLAFIN", "INDIGO", "BAJAJ-AUTO", "EXIDEIND", "VEDL", "APOLLOTYRE", "ATUL", "PIIND", "COROMANDEL", "GNFC", "TITAN", "ICICIPRULI", "FSL", "TATASTEEL", "MARICO", "TRENT", "BRITANNIA", "DELTACORP", "ZYDUSLIFE", "HAL", "M&M", "SIEMENS", "CIPLA", "PAGEIND", "CANFINHOME", "GLENMARK", "OFSS", "METROPOLIS", "IBULHSGFIN", "ULTRACEMCO", "JKCEMENT", "ICICIGI", "UPL", "HINDCOPPER", "TATAPOWER", "GAIL", "ABBOTINDIA", "GUJGASLTD", "COLPAL", "CROMPTON", "LALPATHLAB", "PVR", "BHARTIARTL", "MCDOWELL-N", "DRREDDY", "IEX", "BHARATFORG", "MGL", "TORNTPHARM", "INTELLECT", "CUMMINSIND", "SHRIRAMFIN", "GODREJCP", "HONAUT", "MOTHERSON", "INDHOTEL", "IPCALAB", "SYNGENE", "AMBUJACEM", "LICHSGFIN", "DIVISLAB", "COFORGE", "BERGEPAINT", "GRASIM", "MCX", "COALINDIA", "NAUKRI", "WIPRO", "IOC", "LTTS", "SHREECEM", "LUPIN", "HEROMOTOCO", "SUNTV", "LT", "SUNPHARMA", "NATIONALUM", "GRANULES", "SAIL", "RAMCOCEM", "BPCL", "INDUSTOWER", "NTPC", "RECLTD", "TCS", "ZEEL", "PETRONET", "NMDC", "INDIACEM", "HCLTECH", "TECHM", "BANDHANBNK", "HINDPETRO", "BALRAMCHIN", "IDEA", "BSOFT", "PFC", "MPHASIS", "INFY", "LAURUSLABS", "PERSISTENT", "LTIM"]
  oiStockList:any = [];
  

  constructor() {
    this.stockList.sort();
    this.stockList.unshift(...['NIFTY', 'BANKNIFTY']);
    this.currentStock = this.stockList[0];
    this.getStockOiData(this.currentStock, this.currentDate);
  }

  onStockChange(value:any, currentDate: any) {
    this.getStockOiData(value ? value : "", currentDate);
  }

  onDateChange(value:any, currentStock:any) {
    this.getStockOiData(currentStock, value);

  }


  getStockOiData(value:any, currentDate: any){
    this.isLoading = true;
    this.futureService.getStockOiData(value, currentDate)?.then((res) => {
      this.oiStockList = res.data as any;
      this.isLoading = false;

    });
  }


}
