import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  private baseUrl: string = environment.API_ENDPOINT || '';
  private apiKey: string = environment.SUPABASE_KEY || '';
  private supabase?: SupabaseClient;

  constructor() {
    this.supabase = new SupabaseClient(this.baseUrl, this.apiKey);
  }

  getOptionOiData(symbol: string, date: string) {
    let query = this.supabase?.from('option-chain').select('*');
      query?.eq('symbol', symbol);

      query?.filter('timestamp', 'gte', '2024-07-15')
      query?.filter('timestamp', 'lt', '2024-07-16');
    return query
      ?.order('created_at', { ascending: true });
  }
}
