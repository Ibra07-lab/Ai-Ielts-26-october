import matplotlib.pyplot as plt
import numpy as np
import os

# Ensure the directory exists
output_dir = r"c:\Users\Honor\Desktop\Новая папка (4)\Ai-Ielts-26-october\frontend\public\charts"
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "energy_consumption_costs.png")

# Data
years_bar = np.array([2018, 2020, 2023])
elec = [4200, 4800, 4500]
gas = [12000, 11500, 10800]
renewable = [200, 600, 1800]

years_line = [2018, 2019, 2020, 2021, 2022, 2023]
costs = [1200, 1250, 1280, 1450, 2200, 2050]

# Setup Figure
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 10))
fig.suptitle('Test 20: Household Energy Analysis (2018-2023)', fontsize=24, fontweight='bold')

# --- Plot 1: Bar Chart (Consumption) ---
x = np.arange(len(years_bar))
width = 0.25

rects1 = ax1.bar(x - width, elec, width, label='Electricity', color='#1f77b4')
rects2 = ax1.bar(x, gas, width, label='Gas', color='#ff7f0e')
rects3 = ax1.bar(x + width, renewable, width, label='Renewable', color='#2ca02c')

ax1.set_ylabel('Consumption (kWh)', fontsize=14)
ax1.set_title('Household Energy Consumption by Source', fontsize=18)
ax1.set_xticks(x)
ax1.set_xticklabels(years_bar, fontsize=12)
ax1.tick_params(axis='y', labelsize=12)
ax1.legend(fontsize=12)
ax1.grid(axis='y', linestyle='--', alpha=0.7)
ax1.set_ylim(0, 14000) # Increased limit slightly to fit larger labels

# Add value labels
def autolabel(rects):
    for rect in rects:
        height = rect.get_height()
        ax1.annotate('{}'.format(height),
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=12, fontweight='bold')

autolabel(rects1)
autolabel(rects2)
autolabel(rects3)

# --- Plot 2: Line Graph (Costs) ---
ax2.plot(years_line, costs, marker='o', color='#d62728', linewidth=2, markersize=8)
ax2.set_ylabel('Average Annual Bill (£)', fontsize=14)
ax2.set_xlabel('Year', fontsize=14)
ax2.set_title('Average Annual Energy Bill', fontsize=18)
ax2.tick_params(axis='both', labelsize=12)
ax2.grid(True, linestyle='--', alpha=0.7)
ax2.set_ylim(0, 2600)

# Add value labels for line graph
for i, txt in enumerate(costs):
    ax2.annotate('£{}'.format(txt), (years_line[i], costs[i]), 
                 xytext=(0, 15), textcoords='offset points', ha='center', fontweight='bold', fontsize=12)

plt.tight_layout(rect=[0, 0.03, 1, 0.95]) # Adjust for suptitle
plt.savefig(output_path, dpi=300, bbox_inches='tight')
print(f"Chart saved to: {output_path}")
