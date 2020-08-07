# Trade Analysis

Simple application that calculates OHLC(Open, High, Low, Close) based on time series data

## Tech Stack

-   Node JS
-   Websockets(for communication between client and application)
-   RabbitMQ(for communication between microservice)

## Architecture

This application is powered by 3 microservices.

### Read File

Reads the file containing time series data line by line and pushes each transaction to `line` queue

### Interpret Data

Consumes data from `line` queue, generates OHLC data and publishes the result to `ohlc` queue

### Client Service

Consume data from `ohlc` queue and publishes the data to all the clients subscribed.

![alt text](https://github.com/VaishakVk/trade-analysis/blob/master/Trader.png?raw=true)

## Prerequisite

-   Node JS
-   Rabbit MQ

## Steps to Install and Run

-   Clone the directory

```
git clone https://github.com/VaishakVk/trade-analysis.git
```

### ReadFile

-   Navigate to ReadFile directory. Create `.env` file based on `.env.example`
-   Create folder `data` and place your sample json file with name `trades.json`. Follow the below structure

```
{"sym":"XZECXXBT", "T":"Trade",  "P":0.01947, "Q":0.1, "TS":1538409720.3813, "side": "s", "TS2":1538409725339216503}
{"sym":"XETHZUSD", "T":"Trade",  "P":226.85, "Q":0.02, "TS":1538409733.3449, "side": "b", "TS2":1538409738828589281}

```

-   Run `npm install`
-   Run `npm start`

### InterpretData and Client

-   Navigate to respective folders
-   Run `npm install`
-   Run `npm start`

### Websocket Client setup

-   Create a Javascript client and connect to Websocket
-   Emit `subscribe` with stock symbol
-   Listen to `ohlc_event` to get real time data processing result.
