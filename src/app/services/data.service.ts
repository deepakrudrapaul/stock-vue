import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl: string = environment.API_ENDPOINT;
  private apiKey: string = environment.SUPABASE_KEY;
  private supabase?: SupabaseClient;


  constructor() { 
    this.supabase = new SupabaseClient(this.baseUrl, this.apiKey);
  }

  getOiData(date: string) { 
    return this.supabase?.from("openInterest").select("*").filter('timestamp', 'eq', date).gte('oneDayOiChange', 10);
  }
}
