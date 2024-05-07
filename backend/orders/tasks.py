import json
import os
from datetime import datetime, timedelta
from decimal import Decimal

from celery import Celery
from dotenv import load_dotenv
from orders.models import Order
from rest_framework.compat import requests
from django.conf import settings

load_dotenv()

BANK_TOKEN = os.getenv("BANK_TOKEN")

CELERY_BROKER_URL = settings.CELERY_BROKER_URL
app = Celery("tasks", broker=CELERY_BROKER_URL)


@app.task
def get_bank_statement():
    now = datetime.now()
    nowFormatted = now.strftime("%Y-%m-%d")
    yesterday = now - timedelta(days=1)
    yesterdayFormatted = yesterday.strftime("%Y-%m-%d")

    # Get bank statement
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

    # Process every transaction
    for transaction in transactions:
        print(f"VS: {transaction.get('column5')}")
        print(f"Amount: {transaction.get('column1')}")
        variableSymbol = transaction.get("column5")
        amount = transaction.get("column1")
        if amount:
            amount = Decimal(amount.get("value"))
        if variableSymbol:
            variableSymbol = int(variableSymbol.get("value"))
            try: 
                order = Order.objects.get(id=variableSymbol)
            except Order.DoesNotExist:
                order = None
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
