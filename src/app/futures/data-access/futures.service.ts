import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FuturesService {

  private baseUrl: string = environment.API_ENDPOINT;
  private apiKey: string = environment.SUPABASE_KEY;
  private supabase?: SupabaseClient;


  constructor() { 
    this.supabase = new SupabaseClient(this.baseUrl, this.apiKey);
  }

  getLongBuildupStocks(date: string) { 
    return this.supabase?.from("openInterest").select("*").filter('timestamp', 'eq', date).gte('oneDayOiChange', 5).gte('oneDayPriceChange', 1).order('oneDayOiChange', {ascending:false}).limit(5);
  }

  getShortBuildupStocks(date: string) { 
    return this.supabase?.from("openInterest").select("*").filter('timestamp', 'eq', date).lte('oneDayOiChange', -5).lte('oneDayPriceChange', 2).order('oneDayOiChange', {ascending:true}).limit(5);
  }


  getStockOiData(symbol: string) { 
    return this.supabase?.from("openInterest").select("*").eq('symbol', symbol).order("timestamp", {ascending:false});
  }
}
