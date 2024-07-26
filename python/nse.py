import os
from datetime import datetime, timedelta, date
import requests
import numpy as np
from dateutil.relativedelta import relativedelta
import pandas as pd
import datetime as dt
import zipfile
from io import BytesIO
import json


dd_mm_yyyy = '%d-%m-%Y'
header = {
    "Connection": "keep-alive",
    "Cache-Control": "max-age=0",
    "DNT": "1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/111.0.0.0 Safari/537.36",
    "Sec-Fetch-User": "?1", "Accept": "*/*", "Sec-Fetch-Site": "none", "Sec-Fetch-Mode": "navigate",
    "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.9,hi;q=0.8"
    }


def nse_urlfetch(url, params=None):
    r_session = requests.session()
    nse_live = r_session.get("http://nseindia.com", headers=header)
    if params is not None:
        return r_session.get(url, headers=header, params=params)
    else:
        return r_session.get(url, headers=header)


def fno_bhav_copy(trade_date: str):
    """
    NSE future option bhav copy from 2008 on wards
    :param trade_date: eg:'01-06-2023'
    :return: pandas Data frame
    """
    trade_date = datetime.strptime(trade_date, dd_mm_yyyy)
    params = {
    'archives': json.dumps([{
        "name": "F&O - UDiFF Common Bhavcopy Final (zip)",
        "type": "archives",
        "category": "derivatives",
        "section": "equity"
    }]),
    'date': str(trade_date.strftime('%d-%b-%Y')),
    'type': 'equity',
    'mode': 'single'
    }
    bhav_df = ''
    url2="https://www.nseindia.com/api/reports"
    request_bhav = nse_urlfetch(url2, params)
    print("Getting data from : " + trade_date.__str__() + "  " + url2)
    if request_bhav.status_code == 200:
        zip_bhav = zipfile.ZipFile(BytesIO(request_bhav.content), 'r')
        for file_name in zip_bhav.filelist:
            if file_name:
                bhav_df = pd.read_csv(zip_bhav.open(file_name))
                bhav_df = bhav_df[~bhav_df['OptnTp'].isin(['CE', 'PE'])]
                bhav_df = bhav_df[['Sgmt', 'TckrSymb', 'XpryDt', 'OpnPric', 'HghPric', 'LwPric',
                    'ClsPric', 'SttlmPric', 'PrvsClsgPric', 'TtlTradgVol', 'TtlTrfVal', 'OpnIntrst', 'ChngInOpnIntrst', 'TradDt']]
    elif request_bhav.status_code == 403:
        raise FileNotFoundError(f' Data not found, change the date...')
    return bhav_df


def live_option_chain(symbol):
    url = 'https://www.nseindia.com/api/option-chain-indices?symbol=' + symbol
    request = nse_urlfetch(url=url)
    if request.status_code == 200:
        print(request)
    else:
        print("Error")
    return request.content

def get_trading_holidays():
    url = 'https://www.nseindia.com/api/holiday-master?type=trading'
    request = nse_urlfetch(url=url)
    if request.status_code == 200:
        data_dict = request.json()
        data_df = pd.DataFrame(columns=['Product', 'tradingDate', 'weekDay', 'description', 'Sr_no'])
    for prod in data_dict:
        h_df = pd.DataFrame(data_dict[prod])
        h_df['Product'] = prod
        data_df = pd.concat([data_df, h_df])
    condition = [data_df['Product'] == 'CBM', data_df['Product'] == 'CD', data_df['Product'] == 'CM',
                 data_df['Product'] == 'CMOT', data_df['Product'] == 'COM', data_df['Product'] == 'FO',
                 data_df['Product'] == 'IRD', data_df['Product'] == 'MF', data_df['Product'] == 'NDM',
                 data_df['Product'] == 'NTRP', data_df['Product'] == 'SLBS']
    value = ['Corporate Bonds', 'Currency Derivatives', 'Equities', 'CMOT', 'Commodity Derivatives', 'Equity Derivatives',
             'Interest Rate Derivatives', 'Mutual Funds', 'New Debt Segment', 'Negotiated Trade Reporting Platform',
             'Securities Lending & Borrowing Schemes']
    data_df['Product'] = np.select(condition, value)
    return data_df

# fno_bhav_copy(trade_date='08-07-2024')