import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from datetime import datetime

# Data from PDF extracted and formatted
data = {
    "Date": ["2024-05-02", "2024-05-03", "2024-05-06", "2024-05-07", "2024-05-09", "2024-05-10", "2024-05-11", "2024-05-11", 
             "2024-05-12", "2024-05-12", "2024-05-13", "2024-05-16", "2024-05-18", "2024-05-18", "2024-05-19", "2024-05-19", 
             "2024-05-20", "2024-05-22", "2024-05-23", "2024-05-24", "2024-05-27", "2024-05-28", "2024-05-29", "2024-05-30", "2024-05-31"],
    "Time": ["15:30-22:00", "15:00-22:00", "15:30-22:00", "15:30-22:00", "15:00-22:00", "22:00-00:00", "00:00-08:00", "18:00-00:00", 
             "00:00-08:00", "18:00-00:00", "00:00-08:00", "18:00-22:00", "00:00-08:00", "18:00-00:00", "00:00-08:00", "22:00-00:00", 
             "00:00-08:00", "13:00-15:00", "15:00-22:00", "15:00-22:00", "22:00-00:00", "00:00-08:00", "00:00-08:00", "18:00-00:00", "00:00-08:00"],
    "Type": ["EZ"]*25,
    "Customer": ["Preis, David", "Hönche, Thomas", "Preis, David", "Preis, David", "Preis, David", "Hönche, Thomas", "Hönche, Thomas", "Hönche, Thomas", 
                 "Hönche, Thomas", "Hönche, Thomas", "Hönche, Thomas", "Preis, David", "Hönche, Thomas", "Hönche, Thomas", "Hönche, Thomas", "Hönche, Thomas", 
                 "Hönche, Thomas", "Team Hanauer Landstr.", "Hönche, Thomas", "Hönche, Thomas", "Hönche, Thomas", "Hönche, Thomas", "Hönche, Thomas", "Hönche, Thomas", "Hönche, Thomas"],
    "Hours": [6.5, 7, 6.5, 6.5, 7, 2, 8, 6, 8, 6, 8, 4, 8, 6, 8, 2, 8, 2, 7, 7, 2, 8, 8, 6, 8]
}

# Convert data to DataFrame
df = pd.DataFrame(data)
df["Date"] = pd.to_datetime(df["Date"])

# Create a pivot table
pivot_df = df.pivot(index="Date", columns="Time", values="Customer").fillna("")

# Create a calendar for May 2024
fig, ax = plt.subplots(figsize=(15, 10))
plt.title('Work Schedule for May 2024')

# Create a grid for the calendar
days = pd.date_range(start="2024-05-01", end="2024-05-31", freq='D')
calendar = pd.DataFrame(index=days, columns=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])

# Fill in the calendar with the schedule
for date, row in pivot_df.iterrows():
    for time, customer in row.items():
        if customer:
            calendar.loc[date.strftime("%Y-%m-%d"), date.strftime("%A")] += f"\n{time}: {customer}"

# Plot the calendar
for week in range(5):
    for day in range(7):
        date = days[week * 7 + day]
        day_name = date.strftime("%A")
        text = calendar.loc[date.strftime("%Y-%m-%d"), day_name]
        ax.text(day, week, f"{date.day}\n{text}", ha='center', va='center', fontsize=10, bbox=dict(boxstyle='round,pad=0.3', edgecolor='black', facecolor='lightgray'))

# Set limits and remove axes
ax.set_xlim(-0.5, 6.5)
ax.set_ylim(4.5, -0.5)
ax.axis('off')

# Display the plot
plt.show()
