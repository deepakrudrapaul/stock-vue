from supabase import create_client, Client
import pandas as pd
import numpy as np
import logging
import logging.handlers
from datetime import datetime
from datetime import date
from datetime import timedelta
import calendar
import json
import os
from nse import fno_bhav_copy, live_option_chain, get_trading_holidays
import csv
import math


SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]


logger = logging.getLogger(__name__)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

is_data_download_success = True;


def get_previous_weekday_date(date):
    one_day = timedelta(days=1)
    while date.weekday() > 4:  # if the given date is a weekend
        date -= one_day
    if date.weekday() == 0:  # if the given date is a Monday
        date -= 3 * one_day
    else:
        date -= one_day
    return date


now = datetime.now()
today = date.today()

currentMonth = now.strftime("%b").upper()
currentYear = str(now.year)
str_today = today.isoformat()

previous_day = get_previous_weekday_date(today)



def download_and_save_bhavcopy(date):
    global is_data_download_success
    df = fno_bhav_copy(trade_date=date)
    if not df.empty:
        print("Reading data....")

        sub_total_df = df.groupby('TckrSymb')[['TtlTradgVol', 'TtlTrfVal', 'OpnIntrst', 'ChngInOpnIntrst']].sum()


        current_expiry = [df['XpryDt'].iloc[0]]
        current_expiry_df = df[df['XpryDt'].isin(current_expiry)]
        filtered_df = current_expiry_df[['TckrSymb', 'ClsPric', 'TradDt', 'PrvsClsgPric']]
        merged_df = pd.merge(filtered_df, sub_total_df, on='TckrSymb')

        merged_df.rename(columns={'TckrSymb': 'symbol'}, inplace=True)
        merged_df.rename(columns={'ClsPric': 'close'}, inplace=True)
        merged_df.rename(columns={'PrvsClsgPric': 'prevClose'}, inplace=True)
        merged_df.rename(columns={'TradDt': 'timestamp'}, inplace=True)
        merged_df.rename(columns={'TtlTradgVol': 'lotsTraded'}, inplace=True)
        merged_df.rename(columns={'OpnIntrst': 'openInterest'}, inplace=True)
        merged_df.rename(columns={'ChngInOpnIntrst': 'changeOi'}, inplace=True)
        merged_df.rename(columns={'TtlTrfVal': 'totalValue'}, inplace=True)
        merged_df.dropna(axis=1, inplace=True)

        result = merged_df.to_dict(orient='records')
        result_json = json.dumps(result)
        final_json = json.loads(result_json)

        print()
        print("Inserting in DB....")

        json_obj = {}
        json_obj["data"] = final_json
        json_obj["timestamp"] = merged_df['timestamp'].iloc[0]
        try:
            supabase.table("bhavcopy").insert(json_obj).execute()
            logger.info("Bhavcopy successfully added")
            is_data_download_success = True
        except KeyError:
            is_data_download_success = False
            logger.info("Error : Not able to fetch bhavcopy data")
    else:
        is_data_download_success = False



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


def last_friday_of_month(year, month):
    last_day = max(calendar.monthcalendar(year, month),
                   key=lambda week: week[calendar.FRIDAY])
    return date(year, month, last_day[calendar.FRIDAY])


def get_percent_change(newValue, oldValue):
    percent = (newValue - oldValue)/oldValue * 100
    return round(percent, 1)


def map_percent_change_with_todays_data(oldData, newData):
    oldDataSet = {item['symbol']: item for item in oldData}
    for data in newData:
        oldValue = oldDataSet.get(data['symbol'])
        if oldValue:
                data['oneDayPriceChange'] = get_percent_change(data['close'], data['prevClose'])
                data['oneDayOiChange'] = get_percent_change(data['openInterest'], oldValue['openInterest'])
                data['oneDayValueChange'] = get_percent_change(data['totalValue'], oldValue['totalValue'])
                data['openInterest'] = format_number(data['openInterest'])
                data['lotsTraded'] = format_number(data['lotsTraded'])
                data['changeOi'] = format_number(data['changeOi'])
                data['totalValue'] = format_number(data['totalValue'])
        else:
            data['oneDayPriceChange'] = 0
            data['oneDayOiChange'] = 0
            data['oneDayValueChange'] = 0
            data['openInterest'] = format_number(data['openInterest'])
            data['lotsTraded'] = format_number(data['lotsTraded'])
            data['changeOi'] = format_number(data['changeOi'])
            data['totalValue'] = format_number(data['totalValue'])
    sorted_data = sorted(newData, key=lambda x: x['symbol'])
    for item in sorted_data:
        add_data_in_db(item)



def get_todays_data(date):
    global todays_data

    try:
        response = supabase.table('bhavcopy').select(
            "*").eq('timestamp', date).single().execute()
        todays_data = response.data['data']
        logger.info("Successfully retrieved today's data : " + date)
    except KeyError:
        logger.error('Error: No data today')
    map_percent_change_with_todays_data(previous_day_data, todays_data)


def get_previous_day_data(date):
    global previous_day_data

    try:
        response = supabase.table('bhavcopy').select(
            "*").eq('timestamp', date).single().execute()
        previous_day_data = response.data['data']
        logger.info('Successfully retrieved previous day : ' + date)
    except KeyError:
        logger.error('Error: No previous day data')


def get_first_day_data():
    year = now.year
    month = now.month - 1 if now.month > 1 else 12
    expiry_start_date = last_friday_of_month(year, month)
    global expiry_start_data
    response = supabase.table('bhavcopy').select(
        "*").eq('timestamp', expiry_start_date).single().execute()
    expiry_start_data = response.data['data']


def add_data_in_db(data):
    del data['prevClose']
    result_json = json.dumps(data)
    final_json = json.loads(result_json)
    try:
        supabase.table("openInterest").insert(final_json).execute()
        logger.info("Successfully added analyzed data")
    except KeyError:
        logger.error('Error: not able to add analyzed data')


def run_logs():
    logger.setLevel(logging.DEBUG)
    logger_file_handler = logging.handlers.RotatingFileHandler(
        "status.log",
        maxBytes=1024 * 1024,
        backupCount=1,
        encoding="utf8",
    )
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    logger_file_handler.setFormatter(formatter)
    logger.addHandler(logger_file_handler)


def isHoliday():
    holidays_df = get_trading_holidays()
    filtered_df = holidays_df.loc[holidays_df['Product'] == 'Equity Derivatives']


def run_app(should_download):
    today = date.today()

    # todays_date = "26-07-2024"
    todays_date = today.strftime("%d-%m-%Y")
    if(should_download):
        download_and_save_bhavcopy(todays_date)


    # prev_date = '2024-07-25'
    # current_date = '2024-07-26'
    prev_date = previous_day.strftime("%Y-%m-%d")
    current_date = today.strftime("%Y-%m-%d")
    if is_data_download_success:
        get_previous_day_data(prev_date)    
        get_todays_data(current_date)

        


# run_logs()
run_app(True) # This should be true to download and save bhav copy data
