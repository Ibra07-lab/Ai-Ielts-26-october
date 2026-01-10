import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
from pathlib import Path


def generate_line_graph_internet():
    """
    Generate the internet access line graph.
    Saves to static/charts/
    """
    
    # Your data
    years = [2000, 2005, 2010, 2015, 2020]
    country_a = [25, 45, 70, 85, 92]
    country_b = [10, 25, 50, 72, 88]
    country_c = [5, 12, 28, 55, 78]
    
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Plot lines
    ax.plot(years, country_a, marker='o', linewidth=2, markersize=8, 
            label='Country A', color='#2563eb')
    ax.plot(years, country_b, marker='s', linewidth=2, markersize=8, 
            label='Country B', color='#dc2626')
    ax.plot(years, country_c, marker='^', linewidth=2, markersize=8, 
            label='Country C', color='#16a34a')
    
    # Styling
    ax.set_xlabel('Year', fontsize=12, fontweight='bold')
    ax.set_ylabel('Percentage of households (%)', fontsize=12, fontweight='bold')
    ax.set_title('Percentage of Households with Internet Access\n(2000-2020)', 
                 fontsize=14, fontweight='bold', pad=15)
    
    # Grid
    ax.grid(True, linestyle='--', alpha=0.7)
    ax.set_axisbelow(True)
    
    # Y-axis from 0 to 100
    ax.set_ylim(0, 100)
    ax.set_xlim(1998, 2022)
    
    # X-axis ticks
    ax.set_xticks(years)
    
    # Legend
    ax.legend(loc='lower right', fontsize=10)
    
    # Clean look
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    # Save
    output_path = Path("static/charts/line_graph_internet.png")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', 
                facecolor='white', edgecolor='none')
    plt.close()
    
    print(f"Saved: {output_path}")
    return str(output_path)


def generate_bar_chart_teenagers():
    """
    Generate the teenagers activities bar chart.
    """
    
    # Data
    activities = ['Studying', 'Sports', 'Social Media', 'Television']
    year_2010 = [95, 65, 20, 90]
    year_2020 = [110, 45, 105, 50]
    
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Bar positions
    x = np.arange(len(activities))
    width = 0.35
    
    # Create bars
    bars1 = ax.bar(x - width/2, year_2010, width, label='2010', 
                   color='#3b82f6', edgecolor='white')
    bars2 = ax.bar(x + width/2, year_2020, width, label='2020', 
                   color='#f97316', edgecolor='white')
    
    # Labels
    ax.set_xlabel('Activity', fontsize=12, fontweight='bold')
    ax.set_ylabel('Minutes per day', fontsize=12, fontweight='bold')
    ax.set_title('Average Daily Time Spent on Activities by Teenagers\n(2010 vs 2020)', 
                 fontsize=14, fontweight='bold', pad=15)
    
    # X-axis labels
    ax.set_xticks(x)
    ax.set_xticklabels(activities, fontsize=11)
    
    # Y-axis
    ax.set_ylim(0, 130)
    
    # Grid (horizontal only)
    ax.yaxis.grid(True, linestyle='--', alpha=0.7)
    ax.set_axisbelow(True)
    
    # Legend
    ax.legend(loc='upper right', fontsize=10)
    
    # Add value labels on bars
    def add_labels(bars):
        for bar in bars:
            height = bar.get_height()
            ax.annotate(f'{int(height)}',
                       xy=(bar.get_x() + bar.get_width() / 2, height),
                       xytext=(0, 3),
                       textcoords="offset points",
                       ha='center', va='bottom', fontsize=9)
    
    add_labels(bars1)
    add_labels(bars2)
    
    # Clean look
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    # Save
    output_path = Path("static/charts/bar_chart_teenagers.png")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight',
                facecolor='white', edgecolor='none')
    plt.close()
    
    print(f"Saved: {output_path}")
    return str(output_path)


if __name__ == "__main__":
    generate_line_graph_internet()
    generate_bar_chart_teenagers()
    print("All charts generated!")
