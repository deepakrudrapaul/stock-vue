from nse import fno_bhav_copy, live_option_chain
from supabase import create_client, Client
from datetime import datetime, timedelta
import json
import math
import csv
import random
import os
import schedule
import time


SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def format_number(amount):
    def truncate_float(number, places):
        return int(number * (10 ** places)) / 10 ** places

    if amount < 1e3:
        return str(amount)

    if 1e3 <= amount < 1e5:
        return str(truncate_float((amount / 1e5) * 100, 2)) + " K"

    if 1e5 <= amount < 1e7:
        return str(truncate_float((amount / 1e7) * 100, 2)) + " L"

    if amount > 1e7:
        return str(truncate_float(amount / 1e7, 2)) + " Cr"
    

def fetch_option_data():
    response = live_option_chain("NIFTY")
    jsonData = json.loads(response)
    records = jsonData['records']
    parsedData = jsonData['filtered']
    currentPrice =  math.ceil(records['underlyingValue']/100 * 100) 
    minPrice = currentPrice - 700
    maxPrice = currentPrice + 700
    optionData = parsedData['data']
    filteredData = [data for data in optionData if data['strikePrice'] > minPrice and data['strikePrice'] < maxPrice]
    prepareCallPutDiffData(filteredData, records)

def prepareCallPutDiffData(filteredData, records):
    ceSum = 0
    peSum = 0
    for item in filteredData:
        ceSum = ceSum + item['CE']['changeinOpenInterest']
        peSum = peSum + item['PE']['changeinOpenInterest']

    jsonObj = {}
    jsonObj['ceChange'] = ceSum
    jsonObj['peChange'] = peSum
    jsonObj['diff'] = peSum - ceSum  
    jsonObj['pcr'] = round(peSum/ceSum, 2)
    jsonObj['symbol'] = "NIFTY"
    jsonObj['underlyingValue'] = records['underlyingValue']
    jsonObj['timestamp'] = records['timestamp']
    data = supabase.table("option-chain").insert(jsonObj).execute();
    print(jsonObj)
    print("Done...")




def export_csv(data, fileName):
    fieldnames = data[0].keys()
    with open( fileName + '.csv', 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        # Write the header
        writer.writeheader()

        # Write the data
        writer.writerows(data)

# Schedule the function to run every 5 minutes
# schedule.every(5).minutes.do(fetch_option_data)

# while True:
#     schedule.run_pending()
#     time.sleep(1)

fetch_option_data()


