import pandas as pd
from fbprophet import Prophet


def predict(data):

    df = pd.read_json(data)

    df['ds'] = pd.DatetimeIndex(df['date'])
    df['y'] = pd.DatetimeIndex(df['worth'])
    model = Prophet().fit(df)

    future = model.make_future_dataframe(periods=365, include_history=False)
    forecast = model.predict(future)

    forecast['date'] = pd.DatetimeIndex(forecast['ds']).strftime('%Y-%m-%d')
    forecast['worth'] = forecast['yhat'].round(2)

    result = forecast[['date', 'worth']].to_dict(orient='records')
    return result
