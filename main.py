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


SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]



logger = logging.getLogger(__name__)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
holidays = np.array(['2023-01-26', '2023-03-07', '2023-03-30', '2023-04-04', '2023-04-07', '2023-04-14', '2023-05-01',
                    '2023-06-28', '2023-08-15', '2023-09-19', '2023-10-02', '2023-10-24', '2023-11-14', '2023-11-27', '2023-12-25'])


def get_previous_weekday_date(date):
    one_day = timedelta(days=1)
    while date.weekday() > 4:  # if the given date is a weekend
        date -= one_day
    if date.weekday() == 0:  # if the given date is a Monday
        date -= 3 * one_day
    else:
        date -= one_day

    str_date = date.isoformat()
    if str_date in holidays:
        date = get_previous_weekday_date(date)
    return date


now = datetime.now()
today = date.today()

currentMonth = now.strftime("%b").upper()
currentYear = str(now.year)
str_today = today.isoformat()
if str_today in holidays:
    today = get_previous_weekday_date(today)

previous_day = get_previous_weekday_date(today)


# pd.set_option('display.max_rows', None)


def download_and_save_bhavcopy():
    current_date = get_previous_weekday_date(today)
    if (now.hour > 20):
        current_date = today

    formatted_date = current_date.strftime("%d%b%Y").upper()
    # formatted_date = '17JUL2023'

    print('Downloading data for : ' + formatted_date)
    print()

    data_url = 'https://archives.nseindia.com/content/historical/DERIVATIVES/' + \
        currentYear + '/' + currentMonth + '/fo' + formatted_date + 'bhav.csv.zip'

    df = pd.read_csv(data_url, compression='zip')
    column_to_exclude = ['OPTSTK', 'OPTIDX']

    print("Reading data....")
    filtered_df = df[~df['INSTRUMENT'].isin(column_to_exclude)]

    current_expiry = [filtered_df['EXPIRY_DT'].iloc[0]]

    sub_total_df = filtered_df.groupby(
        'SYMBOL')[['CONTRACTS', 'OPEN_INT', 'CHG_IN_OI']].sum()

    current_expiry_df = filtered_df[filtered_df['EXPIRY_DT'].isin(
        current_expiry)]
    current_expiry_df.drop(['VAL_INLAKH', 'SETTLE_PR', 'LOW', 'HIGH', 'OPEN', 'INSTRUMENT', 'INSTRUMENT', 'EXPIRY_DT',
                           'STRIKE_PR', 'OPTION_TYP', 'CONTRACTS', 'VAL_INLAKH', 'OPEN_INT', 'CHG_IN_OI'], axis=1, inplace=True)

    merged_df = pd.merge(current_expiry_df, sub_total_df, on='SYMBOL')
    merged_df.rename(columns={'SYMBOL': 'symbol'}, inplace=True)
    merged_df.rename(columns={'CLOSE': 'close'}, inplace=True)
    merged_df.rename(columns={'TIMESTAMP': 'timestamp'}, inplace=True)
    merged_df.rename(columns={'CONTRACTS': 'lotsTraded'}, inplace=True)
    merged_df.rename(columns={'OPEN_INT': 'openInterest'}, inplace=True)
    merged_df.rename(columns={'CHG_IN_OI': 'changeOi'}, inplace=True)

    merged_df.dropna(axis=1, inplace=True)
    merged_df['timestamp'] = pd.to_datetime(
        merged_df['timestamp'], dayfirst=True)
    merged_df['timestamp'] = merged_df['timestamp'].dt.strftime('%Y-%m-%d')

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
    except KeyError:
        logger.info("Error : Not able to fetch bhavcopy data")


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


def get_percent_change(previous, current):
    percent = (current - previous)/current * 100
    return round(percent, 1)


def map_percent_change_with_todays_data(oldData, newData):
    for index, data in enumerate(newData):
        if oldData[index]['symbol'] == data['symbol']:
            data['oneDayPriceChange'] = get_percent_change(
                oldData[index]['close'], data['close'])
            data['oneDayOiChange'] = get_percent_change(
                oldData[index]['openInterest'], data['openInterest'])
            data['openInterest'] = format_number(data['openInterest'])
            data['lotsTraded'] = format_number(data['lotsTraded'])
            data['changeOi'] = format_number(data['changeOi'])
            add_data_in_db(data)


def get_todays_data(date):
    global todays_data

    try:
        response = supabase.table('bhavcopy').select(
            "*").eq('timestamp', date).single().execute()
        todays_data = response.data['data']
        logger.info("Successfully retrieved today's data")
    except KeyError:
        logger.error('Error: No data today')

    map_percent_change_with_todays_data(previous_day_data, todays_data)


def get_previous_day_data(date):
    global previous_day_data

    try:
        response = supabase.table('bhavcopy').select(
            "*").eq('timestamp', date).single().execute()
        previous_day_data = response.data['data']
        print(previous_day_data)
        logger.info('Successfully retrieved previous day')
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



def run_app(should_download):
    if(should_download):
        download_and_save_bhavcopy();

    today = date.today()

    prev_date = previous_day;
    current_date = today;

    # prev_date = '2023-07-18'
    # current_date = '2023-07-19'

    get_previous_day_data(prev_date)
    get_todays_data(current_date)
        


run_logs()
run_app(True) # This should be true to download and save bhav copy data
