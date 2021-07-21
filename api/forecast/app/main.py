import pandas as pd
from prophet import Prophet
import json


def handler(event, context):
    body = event['body']
    granularity = event['queryStringParameters']['granularity']
    periods = event['queryStringParameters']['periods']
    result = predict(body, granularity, int(periods))
    return {
        "statusCode": 200,
        "body": json.dumps(result),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Credentials": True,
            "Content-Type": "application/json",
        }
    }


def predict(data, granularity, periods):
    df = pd.read_json(data)

    df['ds'] = pd.DatetimeIndex(df['date'])
    df['y'] = pd.DatetimeIndex(df['worth'])
    model = Prophet(seasonality_mode='multiplicative').fit(df)

    if granularity == 'monthly' or granularity == 'm':
        future = monthly(model, periods)
    elif granularity == 'annually' or granularity == 'a':
        future = annually(model, periods)
    else:
        future = daily(model, periods)

    forecast = model.predict(future)

    forecast['date'] = pd.DatetimeIndex(forecast['ds']).strftime('%Y-%m-%d')
    forecast['worth'] = forecast['yhat'].round(2)

    result = forecast[['date', 'worth']].to_dict(orient='records')
    return result


def daily(model, n=730):
    return model.make_future_dataframe(periods=n, include_history=False, freq='D')


def monthly(model, n=48):
    return model.make_future_dataframe(periods=n, include_history=False, freq='M')


def annually(model, n=10):
    return model.make_future_dataframe(periods=n, include_history=False, freq='A')
