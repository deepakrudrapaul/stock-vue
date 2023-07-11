import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private baseUrl: string = environment.API_ENDPOINT || '';
  private apiKey: string = environment.SUPABASE_KEY || '';
  private supabase?: SupabaseClient;

  constructor() {
    this.supabase = new SupabaseClient(this.baseUrl, this.apiKey);
  }

  getOiGainersData(date: string) {
    return this.supabase
      ?.from('openInterest')
      .select('*')
      .filter('timestamp', 'eq', date)
      .gte('oneDayOiChange', 5)
      .order('oneDayOiChange', { ascending: false })
      .limit(5);
  }

  getOiLosersData(date: string) {
    return this.supabase
      ?.from('openInterest')
      .select('*')
      .filter('timestamp', 'eq', date)
      .lte('oneDayOiChange', -5)
      .order('oneDayOiChange', { ascending: true })
      .limit(5);
  }

  getIndexOiData(symbol: string, date: string) {
    return this.supabase
      ?.from('openInterest')
      .select('*')
      .like('symbol', `%${symbol}%`)
      .eq('timestamp', date);
  }

  getStockOiData(symbol: string) {
    return this.supabase
      ?.from('openInterest')
      .select('*')
      .eq('symbol', symbol)
      .order('timestamp', { ascending: false });
  }
}
