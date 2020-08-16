import pandas as pd
import tensorflow as tf
import datetime
from flask import Flask, request, Response

from fbprophet import Prophet


app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/forecast', methods=['POST'])
def forecast():
    data = request.data
    prediction = predict(data)

    return Response(prediction, mimetype='application/json')


def predict(data):

    df = pd.read_json(data)

    df['ds'] = pd.DatetimeIndex(df['date'])
    df['y'] = pd.DatetimeIndex(df['worth'])
    model = Prophet().fit(df)

    future = model.make_future_dataframe(periods=365, include_history=False)
    forecast = model.predict(future)

    forecast['date'] = pd.DatetimeIndex(forecast['ds']).strftime('%Y-%m-%d')
    forecast['worth'] = forecast['yhat'].round(2)

    result = forecast[['date', 'worth']].to_json(orient='records')
    return result
