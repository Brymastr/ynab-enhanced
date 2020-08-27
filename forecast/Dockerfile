FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8
RUN pip install --upgrade pip

WORKDIR /app

RUN pip install numpy pandas convertdate lunarcalendar holidays
RUN pip install pystan
RUN pip install fastapi fbprophet

COPY . .

ENV PORT=3000