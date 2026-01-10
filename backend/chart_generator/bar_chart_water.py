
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

def generate_water_use_chart():
    """
    Generates the Daily Water Use bar chart based on the provided JSON spec.
    """
    
    # ---------------------------------------------------------
    # The JSON Data provided in the prompt
    # ---------------------------------------------------------
    data = {
      "id": "task1_bar_water_use_2010_2020",
      "type": "bar_chart",
      "prompt": "The bar chart compares the average daily water consumption per person in five cities in 2010 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      "unit": "litres per person per day",
      "data": {
        "labels": ["City A", "City B", "City C", "City D", "City E"],
        "series": [
          { "name": "2010", "values": [180, 210, 160, 240, 200] },
          { "name": "2020", "values": [165, 195, 170, 205, 185] }
        ]
      }
    }

    # Extract data
    labels = data["data"]["labels"]
    series_2010 = data["data"]["series"][0]["values"]
    series_2020 = data["data"]["series"][1]["values"]
    unit = data["unit"]

    # ---------------------------------------------------------
    # Setup Plot
    # ---------------------------------------------------------
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 6))

    # Bar settings
    x = np.arange(len(labels))  # the label locations
    width = 0.35  # the width of the bars

    # Create bars
    # Using typical professional colors: Blue for 2010, Orange/Red for 2020 or similar distinct colors
    rects1 = ax.bar(x - width/2, series_2010, width, label='2010', color='#3b82f6', edgecolor='white')
    rects2 = ax.bar(x + width/2, series_2020, width, label='2020', color='#f97316', edgecolor='white')

    # ---------------------------------------------------------
    # Styling & Labels
    # ---------------------------------------------------------
    ax.set_ylabel(unit, fontsize=12, fontweight='bold')
    ax.set_title('Average Daily Water Consumption per Person\n(2010 vs 2020)', fontsize=14, fontweight='bold', pad=15)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=11)
    
    # Add legend
    ax.legend(fontsize=10)

    # Grid
    ax.yaxis.grid(True, linestyle='--', alpha=0.7)
    ax.set_axisbelow(True)

    # Set Y-axis limit to accommodate labels on top
    # Max value is 240, so 280-300 should be safe
    ax.set_ylim(0, 300)

    # ---------------------------------------------------------
    # Value Labels
    # ---------------------------------------------------------
    def autolabel(rects):
        """Attach a text label above each bar in *rects*, displaying its height."""
        for rect in rects:
            height = rect.get_height()
            ax.annotate(f'{height}',
                        xy=(rect.get_x() + rect.get_width() / 2, height),
                        xytext=(0, 3),  # 3 points vertical offset
                        textcoords="offset points",
                        ha='center', va='bottom', fontsize=9)

    autolabel(rects1)
    autolabel(rects2)

    # Clean look
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    # ---------------------------------------------------------
    # Save Output
    # ---------------------------------------------------------
    # Using the ID from JSON or a descriptive name
    output_filename = f"{data['id']}.png" 
    output_path = Path(f"static/charts/{output_filename}")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white', edgecolor='none')
    plt.close()
    
    print(f"Chart saved to: {output_path.absolute()}")
    return str(output_path)

if __name__ == "__main__":
    generate_water_use_chart()
