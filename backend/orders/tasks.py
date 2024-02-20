import json
import os
from datetime import datetime, timedelta
from decimal import Decimal

from celery import Celery
from dotenv import load_dotenv
from orders.models import Order
from rest_framework.compat import requests

load_dotenv()

BANK_TOKEN = os.getenv("BANK_TOKEN")

app = Celery("tasks", broker="redis://localhost")


@app.task
def get_bank_statement():
    now = datetime.now()
    nowFormatted = now.strftime("%Y-%m-%d")
    yesterday = now - timedelta(days=1)
    yesterdayFormatted = yesterday.strftime("%Y-%m-%d")

    response = requests.get(
        f"https://www.fio.cz/ib_api/rest/periods/{BANK_TOKEN}/{yesterdayFormatted}/{nowFormatted}/transactions.json"
    ).json()

    # For testing purposes
    # f = open("orders/responseExample.json", "r")
    # response= json.load(f)

    print(response.get("accountStatement").get("info"))
    print("Successfully got bank statement")

    transactions = (
        response.get("accountStatement").get("transactionList").get("transaction")
    )
    for transaction in transactions:
        print(f"VS: {transaction.get('column5')}")
        print(f"Amount: {transaction.get('column1')}")
        variableSymbol = transaction.get("column5")
        amount = transaction.get("column1")
        if amount:
            amount = Decimal(amount.get("value"))
        if variableSymbol:
            variableSymbol = int(variableSymbol.get("value"))
            order = Order.objects.get(id=variableSymbol)
            if order:
                if order.status == "created":
                    finalPriceConverted = str(order.final_price)
                    amountString = "{:.2f}".format(amount)
                    if amountString == finalPriceConverted:
                        order.status = "paid"
                        print(f"Order with id {variableSymbol} paid")
                        order.save()
                    else:
                        print(
                            f"Order with id {variableSymbol}, ERROR, amount {amount} does not match order price {finalPriceConverted}"
                        )
            else:
                print(f"Order with id {variableSymbol} not found")
