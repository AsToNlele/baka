# Author: Alexandr Celakovsky - xcelak00
import json
from greenhouse.models import GreenhousePlantEmission


def get_emission_stats(user_flowerbed):
    # Get user harvests
    harvests = user_flowerbed.flowerbedharvest_set.all()

    # Get plant emissions from greenhouse
    plantEmissions = GreenhousePlantEmission.objects.filter(
        greenhouse=user_flowerbed.flowerbed.greenhouse, is_default=False
    )

    defaultEmission = GreenhousePlantEmission.objects.filter(
        greenhouse=user_flowerbed.flowerbed.greenhouse, is_default=True
    ).first()

    emissionSum = 0

    if plantEmissions.count() == 0:
        return [0, "No emission data available for this greenhouse."]

    # Match harvest with plant emissions
    for harvest in harvests:
        found = False
        for plantEmission in plantEmissions:
            if harvest.name in plantEmission.plant_names:
                found = True
                emissionSum += plantEmission.co2grams_per_piece * harvest.quantity

        # If no match found, use default emissions if available
        if not found and defaultEmission:
            emissionSum += defaultEmission.co2grams_per_piece * harvest.quantity

    # Constant
    emissionGramsPerKm = 137

    comparisons = [
        {"name": "from Brno to Prague", "km": 208},
        {"name": "from Brno to Zlín", "km": 98},
        {"name": "from Ostrava to Olomouc", "km": 92},
        {"name": "from Pardubice to Hradec Králové", "km": 25},
        {"name": "from Zlín to Olomouc", "km": 62},
        {"name": "from Prague to Vienna", "km": 293},
        {"name": "from Uherské Hradiště to Brno", "km": 74},
        {"name": "from Uherský Brod to Uherské Hradiště", "km": 19},
        {"name": "from VUT FIT to Brno main station", "km": 5},
    ]

    biggestComparison = comparisons[0]

    for comparison in comparisons:
        # Calculate emission per trip
        emissions = emissionGramsPerKm * comparison["km"]
        # Compare it to current emissions
        comparedTo = emissionSum / emissions
        # Assign results to comparison
        comparison["emissions"] = emissions
        comparison["comparedTo"] = comparedTo
        if comparedTo > biggestComparison["comparedTo"]:
            biggestComparison = comparison

    finalComparison = None

    # First find comparisons in range 1-4
    for comparison in comparisons:
        if comparison["comparedTo"] >= 1 and comparison["comparedTo"] <= 4:
            finalComparison = comparison
            break

    if finalComparison is None:
        # If not found, try bigger range
        for comparison in comparisons:
            if comparison["comparedTo"] >= 4:
                finalComparison = comparison
                break

        # Finally, find the highest comparison
        finalComparison = biggestComparison

    # Convert to kg
    emissionSum = emissionSum / 1000

    # Round to 2 decimal places
    emissionSum = round(emissionSum, 2)
    finalComparison["comparedTo"] = round(finalComparison["comparedTo"], 2)
    

    comparisonSentence = f"Thats an equivalent to {finalComparison.get('comparedTo')} trips {finalComparison['name']}."

    return [emissionSum, comparisonSentence]

def get_savings_stats(user_flowerbed):
    # Get user harvests
    harvests = user_flowerbed.flowerbedharvest_set.all()

    # Load json with stats
    # Source: https://www.szif.cz/cs/CmDocument?rid=/apa_anon/cs/zpravy/tis/zpravy_o_trhu/09/1713854958248.pdf
    f = open("flowerbed/cropstats.json", "r")
    response= json.load(f)

    # Match harvest with pricing
    savingsSum = 0

    for harvest in harvests:
        for crop in response:
            if harvest.name in crop["names"]:
                if crop["type"] == "priceKg":
                    savingsSum += crop["priceKg"] * crop["singleWeight"] * harvest.quantity
                elif crop["type"] == "pricePiece":
                    savingsSum += crop["pricePiece"] * harvest.quantity

    # Round to 2 decimal places
    savingsSum = round(savingsSum, 2)

    return savingsSum
    
