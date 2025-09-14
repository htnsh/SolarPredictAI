import pymongo
from datetime import datetime, timedelta

# MongoDB connection
client = pymongo.MongoClient("mongodb+srv://Hetansh_Panchal:id4vxGPKAEIDlyVE@hetansh.pcfax7n.mongodb.net/solarpredict?retryWrites=true&w=majority")
db = client['solarpredict']
collection = db['historical data']

city = "Ahmedabad"
date_str = "2025-09-01"
base_date = datetime.strptime(date_str, "%Y-%m-%d")

# Example: Insert 24 records for each hour of the day
for hour in range(24):
    doc = {
        "City": city,
        "Date": base_date,  # Always midnight for the day
        "Time": f"{hour:02d}:00",
        "Panel area (m^2)": 10.19,
        "Tilt (deg)": 27.2,
        "Azimuth (deg)": 190.8,
        "GHI (W/m^2)": 0,
        "DNI (W/m^2)": 0,
        "Temperature (C)": 33.1,
        "Humidity (%)": 43.6,
        "Wind Speed (m/s)": 3.65,
        "Cloud Cover (%)": 42.8,
        "Power Generated (kW)": hour * 0.5,  # Example: increasing power
        "Power Consumed (kW)": 0.77
    }
    collection.insert_one(doc)

print("Inserted 24 records for Ahmedabad on 2025-09-01.")
