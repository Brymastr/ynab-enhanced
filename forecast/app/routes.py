from app import app
from fastapi import Request
from app.predict import predict


@app.get('/')
async def hello_world():
    return 'Hello, World!'


@app.post('/forecast')
async def forecast(request: Request):
    data = await request.body()
    prediction = predict(data)

    return prediction
