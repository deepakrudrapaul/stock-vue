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
    
    url2="https://www.nseindia.com/api/reports"
    request_bhav = nse_urlfetch(url2, params)
    print(request_bhav.status_code)
    print("Getting data from : " + url2)
    if request_bhav.status_code == 200:
        zip_bhav = zipfile.ZipFile(BytesIO(request_bhav.content), 'r')
        for file_name in zip_bhav.filelist:
            if file_name:
                bhav_df = pd.read_csv(zip_bhav.open(file_name))
                bhav_df = bhav_df[~bhav_df['OptnTp'].isin(['CE', 'PE'])]
                bhav_df = bhav_df[['Sgmt', 'TckrSymb', 'XpryDt', 'OpnPric', 'HghPric', 'LwPric',
                    'ClsPric', 'SttlmPric', 'TtlTradgVol', 'TtlTrfVal', 'OpnIntrst', 'ChngInOpnIntrst', 'TradDt']]
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


fno_bhav_copy(trade_date='08-07-2024')