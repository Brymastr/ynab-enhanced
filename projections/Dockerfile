FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8
RUN pip install --upgrade pip

WORKDIR /app
RUN mkdir /app/app

COPY ./requirements.txt ./requirements.txt

RUN pip install numpy pandas convertdate lunarcalendar holidays
RUN pip install pystan
RUN pip install fastapi fbprophet

# RUN pip install -r requirements.txt

# COPY ./setup.py /app
RUN ls -la ./app
COPY ./src/ ./app