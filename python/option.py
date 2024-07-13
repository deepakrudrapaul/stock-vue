from nse import fno_bhav_copy, live_option_chain
from supabase import create_client, Client
import json
import math


# SUPABASE_URL = os.environ["SUPABASE_URL"]
# SUPABASE_KEY = os.environ["SUPABASE_KEY"]
SUPABASE_URL = "https://cxeowviwukniuzoktejg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZW93dml3dWtuaXV6b2t0ZWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA5MzA1MDMsImV4cCI6MTk5NjUwNjUwM30.9LFMvjTBtqQAU-73tWEyJA-j-pam-utGsdiXWaL5uy8"


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_option_data():
    response = live_option_chain("NIFTY")
    jsonData = json.loads(response)
    records = jsonData['records']
    parsedData = jsonData['filtered']
    currentPrice =  math.ceil(records['underlyingValue']/100 * 100) 
    minPrice = currentPrice - 700
    maxPrice = currentPrice + 700
    print(currentPrice, minPrice, maxPrice)
    optionData = parsedData['data']
    filteredData = [data for data in optionData if data['strikePrice'] > minPrice and data['strikePrice'] < maxPrice]
    jsonObj = {}
    jsonObj['data'] = filteredData
    jsonObj['symbol'] = "NIFTY"
    jsonObj['underlying_value'] = records['underlyingValue']
    jsonObj['time'] = records['timestamp']
    data = supabase.table("option").insert(jsonObj).execute();
    print("Done...")