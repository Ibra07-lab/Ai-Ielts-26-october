import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { AuthData } from "./auth";
import { ieltsDB } from "./db";

export interface WritingPrompt {
  taskType: number;
  prompt: string;
  chartMetadata?: string;
}

export interface WritingSubmission {
  userId: string;
  taskType: number;
  prompt: string;
  content: string;
  bandScore?: number;
  grammarFeedback?: string;
  vocabularyFeedback?: string;
  structureFeedback?: string;
  coherenceFeedback?: string;
}

export interface WritingFeedback {
  id: number;
  bandScore: number;
  grammarFeedback: string;
  vocabularyFeedback: string;
  structureFeedback: string;
  coherenceFeedback: string;
}

export interface WritingSession {
  id: number;
  taskType: number;
  prompt: string;
  content: string;
  bandScore?: number;
  grammarFeedback?: string;
  vocabularyFeedback?: string;
  structureFeedback?: string;
  coherenceFeedback?: string;
  createdAt: string;
}

const writingPrompts: Record<number, string[]> = {
  1: [
    "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    "The diagram below shows the process of making chocolate. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    "The table below shows the proportion of different categories of families living in poverty in Australia in 1999. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
  ],
  2: [
    "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer. What, in your opinion, should be the main function of a university?",
    "In many countries, children are engaged in some kind of paid work. Some people regard this as completely wrong, while others consider it as valuable work experience, important for learning and taking responsibility. Discuss both these views and give your own opinion.",
    "Some people believe that technology has made man more social. To what extent do you agree or disagree with this opinion?",
  ],
};

const testSpecificPrompts: Record<number, WritingPrompt> = {
  // --- Task 2 Specific Prompts (Tests 1-20) ---
  2: {
    taskType: 2,
    prompt: "Some people believe that homework is an essential part of schooling, while others think it puts too much pressure on students and limits their free time. To what extent do you agree or disagree?"
  },
  4: {
    taskType: 2,
    prompt: "Artificial intelligence will eventually replace most human jobs in the workplace. To what extent do you agree or disagree with this statement?"
  },
  6: {
    taskType: 2,
    prompt: "Individuals should be responsible for reducing their carbon footprint rather than relying on governments to solve climate change. Do you agree or disagree?"
  },
  8: {
    taskType: 2,
    prompt: "The best way to improve public health is by increasing the number of sports facilities in cities. To what extent do you agree or disagree?"
  },
  25: {
    taskType: 2,
    prompt: "Some people think that the best way to reduce traffic congestion in cities is to build wider roads. Others believe that introducing more public transportation options is more effective. Discuss both views and give your opinion."
  },
  26: {
    taskType: 2,
    prompt: "Some argue that the spread of multinational companies and global brands is beneficial for local economies. Others believe it destroys local cultures and traditional businesses. Discuss both views and give your opinion."
  },
  27: {
    taskType: 2,
    prompt: "Some people believe that children should start learning a foreign language as early as possible. Others think it is better to wait until they are teenagers. Discuss both views and give your opinion."
  },
  28: {
    taskType: 2,
    prompt: "Some people think that the purpose of prison is to punish criminals, while others believe its primary function should be to rehabilitate offenders and prepare them for life outside prison. Discuss both views and give your opinion."
  },
  29: {
    taskType: 2,
    prompt: "An increasing number of people are using social media platforms to communicate and share information. What are the advantages and disadvantages of this trend?"
  },
  30: {
    taskType: 2,
    prompt: "Many companies now offer employees the option to work remotely from home rather than coming into the office. What are the advantages and disadvantages of working from home?"
  },
  31: {
    taskType: 2,
    prompt: "More students are choosing to take online courses and distance learning programs instead of attending traditional universities. What are the advantages and disadvantages of this development?"
  },
  32: {
    taskType: 2,
    prompt: "Some historic buildings and monuments are being converted into tourist attractions to generate income. What are the advantages and disadvantages of using historical sites for tourism purposes?"
  },
  33: {
    taskType: 2,
    prompt: "In many cities, air pollution has reached dangerous levels and is affecting residents' health. What are the main causes of this problem, and what solutions can you suggest?"
  },
  34: {
    taskType: 2,
    prompt: "Obesity rates are rising rapidly in many developed countries, particularly among young people. What are the causes of this trend, and what measures could be taken to address it?"
  },
  35: {
    taskType: 2,
    prompt: "Housing affordability has become a serious problem in major cities around the world, with many people unable to buy their own homes. What are the causes of this issue, and what solutions can you propose?"
  },
  36: {
    taskType: 2,
    prompt: "Many young people today struggle to find employment after graduating from university. What are the causes of this problem, and what solutions can you suggest?"
  },
  37: {
    taskType: 2,
    prompt: "Many people now shop online instead of visiting physical stores. Why is this happening? Do you think this is a positive or negative development?"
  },
  38: {
    taskType: 2,
    prompt: "In many families today, both parents work full-time, and children spend more time in daycare or with grandparents. Why is this trend becoming more common? Is this a positive or negative development for children?"
  },
  39: {
    taskType: 2,
    prompt: "Some countries are experiencing water shortages and drought conditions due to climate change. Why is this happening in some places more than others? What can governments do to address this problem?"
  },
  40: {
    taskType: 2,
    prompt: "Traditional festivals and celebrations are becoming less important to younger generations in many countries. Why is this happening? Do you think this is a positive or negative development?"
  },

  // --- Task 1 Specific Prompts ---
  1: {
    taskType: 1,
    prompt: "The line graph shows the percentage of households with internet access in Norland, Eastaria and Veridia between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type:** Line Graph
**Title:** Internet Access in Norland, Eastaria and Veridia (2000-2020)

**Axes:**
- X-axis: Years (2000, 2005, 2010, 2015, 2020)
- Y-axis: Percentage of households (0-100%)

**Data Series:**
1. **Norland (Blue):** 25% (2000) -> 45% -> 70% -> 85% -> 95% (2020). (Consistent rapid growth)
2. **Eastaria (Red):** 10% (2000) -> 25% -> 50% -> 72% -> 88% (2020). (Starts lowest, grows fastest later)
3. **Veridia (Green):** 5% (2000) -> 12% -> 28% -> 55% -> 78% (2020). (Slowest start, but steady acceleration)

**Key Features:**
1. All three countries show a strong upward trend in internet access.
2. Norland had the highest access throughout the period.
3. Veridia had the lowest access throughout but narrowed the gap significantly by 2020.`
  },
  3: {
    taskType: 1,
    prompt: "The bar chart compares the average daily time spent on four activities by teenagers in 2010 and 2020, measured in minutes per day. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type:** Bar Chart (Clustered)
**Title:** Daily Activity Time for Teenagers (2010 vs 2020)

**Categories (Activities):**
1. Watching TV
2. Playing Games
3. Studying
4. Socializing

**Data:**
- **Watching TV:** 25 mins (2010) -> 15 mins (2020) [Decrease]
- **Playing Games:** 20 mins (2010) -> 45 mins (2020) [Major Increase]
- **Studying:** 35 mins (2010) -> 30 mins (2020) [Slight Decrease]
- **Socializing:** 30 mins (2010) -> 25 mins (2020) [Slight Decrease]

**Key Features:**
1. Gaming time more than doubled.
2. Traditional activities (TV, Socializing) saw a decline.
3. Studying remained relatively stable but slightly lower.`
  },
  5: {
    taskType: 1,
    prompt: "The bar chart shows the average daily water consumption per person in five cities in 2010 and 2020, measured in litres per person per day.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type:** Clustered Bar Chart
**Title:** Average Daily Water Consumption per Person (2010 vs 2020)

**Categories:**
1. City A
2. City B
3. City C
4. City D
5. City E

**Data (Litres per person per day):**
- **City A:** 180 (2010) -> 165 (2020) [Decrease]
- **City B:** 210 (2010) -> 195 (2020) [Decrease]
- **City C:** 160 (2010) -> 170 (2020) [Increase]
- **City D:** 240 (2010) -> 205 (2020) [Decrease - Highest Usage in 2010]
- **City E:** 200 (2010) -> 185 (2020) [Decrease]

**Key Features:**
1. **General Trend:** Consumption decreased in 4 out of 5 cities (A, B, D, E).
2. **Exception:** City C is the only city where consumption increased (160 to 170).
3. **Highest/Lowest:** City D had the highest consumption in both years (240/205), while City C started lowest in 2010 (160) but City A became the lowest in 2020 (165).`
  },
  7: {
    taskType: 1,
    prompt: "The graph illustrates the proportion of commuters using four different modes of transport (car, bus, bicycle, and train) in a European city over a 35-year period from 1985 to 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type and Title**
This is a line graph titled "Percentage of commuters using different modes of transport in a European city, 1985-2020". The graph displays four distinct colored lines representing different transportation methods used by commuters over a 35-year period.

**Axes Information**
- **X-axis (Horizontal):** Time period from 1985 to 2020, marked in 5-year intervals (1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020)
- **Y-axis (Vertical):** Percentage scale ranging from 0% to 70%, marked in 10% increments

**Data Series Details**

**1. Car (Blue solid line with circular markers)**
- **1985:** Starts at approximately 45%
- **1990-2000:** Steady increase to around 56% by 1995 and continuing upward
- **2005:** Reaches peak at approximately 62% (the highest point of any category throughout the entire period)
- **2005-2020:** Consistent decline from 62% down to approximately 48% by 2020
- **Overall trend:** Rise and fall pattern (inverted U-shape), remaining the dominant transport mode throughout, though losing significant ground after 2005

**2. Bus (Red dashed line with circular markers)**
- **1985:** Starts at approximately 25%
- **1985-2005:** Gradual decline to lowest point of approximately 15% around 2005
- **2005-2020:** Recovery phase, rising back to approximately 22% by 2020
- **Overall trend:** U-shaped curve (decline then recovery), second most popular in 1985 but overtaken by bicycle by 2020

**3. Bicycle (Green solid line with diamond/circular markers)**
- **1985:** Starts at approximately 20%
- **1985-2005:** Decline to approximately 12% (lowest point, reaching similar low around 2005-2010)
- **2010-2020:** Dramatic steep increase from ~12% to approximately 28-29% by 2020
- **Notable feature:** The steepest gradient of any line in the final decade (2010-2020), showing rapid growth
- **Crossover:** Overtakes the bus line between 2015 and 2020, becoming the second most popular mode by 2020

**4. Train (Purple dotted line with circular markers)**
- **1985:** Starts at approximately 10%
- **Throughout period:** Remains remarkably stable with minimal fluctuation
- **1995:** Slight peak at approximately 12%
- **2020:** Ends at approximately 12%
- **Overall trend:** Flat/horizontal line representing consistent but low usage, always the least popular option shown

**Key Comparative Features for Evaluation**

1. **Dominance shifts:** Car dominance peaks in 2005 (62%) then declines, while bicycle usage reaches its nadir around the same time (2005) before rising sharply.

2. **Crossover events:** 
   - The bicycle line crosses above the bus line sometime between 2015 and 2020
   - By 2020, bicycle (~28%) significantly exceeds bus (~22%)

3. **Gap analysis:**
   - **1985:** Large gap between car (45%) and bus (25%) - 20 percentage points
   - **2005:** Widest gap between car (62%) and train (11%) - 51 percentage points; also widest gap between car and bicycle (50 points)
   - **2020:** Narrowest gap between top (car ~48%) and second (bicycle ~28%) - only 20 points apart

4. **Inverse relationships:**
   - Car and bicycle show strong inverse correlation after 2005: as car usage declines, bicycle usage rises steeply
   - Bus and bicycle move in similar U-shapes but diverge after 2010 when bicycle growth outpaces bus recovery

5. **Stability vs. volatility:**
   - Train shows maximum stability (±2% variation over 35 years)
   - Car shows moderate volatility (17% range: 45-62%)
   - Bicycle shows high volatility in final decade (16% increase in just 10 years)

**Critical Data Points for Accuracy Checking**
- Car peak: 2005 at ~62%
- Car 2020: ~48% (decline of ~14% from peak)
- Bicycle 2020: ~28% (more than double its 2010 value of ~12%)
- Bus lowest point: ~15% in 2005
- Train consistent: ~10-12% throughout

**Color Coding for Reference**
- Blue = Car
- Red/Dashed = Bus  
- Green = Bicycle
- Purple/Dotted = Train`
  },
  9: {
    taskType: 1,
    prompt: "The bar chart shows household energy consumption by source (electricity, gas, and renewable energy) from 2018 to 2023, while the line graph shows average annual energy bills over the same period. Energy consumption is measured in kilowatt hours (kWh) and costs are given in pounds sterling (£).\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type and Title**
This is a mixed chart task titled "Household Energy Consumption vs. Annual Energy Bills". It consists of two distinct graphs:
1. **Left Side (Bar Chart):** "Household Energy Consumption by Source" (2018, 2020, 2023) showing usage in kilowatt hours (kWh).
2. **Right Side (Line Graph):** "Average Annual Energy Bill" (2018-2023) showing costs in Pounds Sterling (£).

**Axes Information**
**Bar Chart:**
- **X-axis:** Three specific years: 2018, 2020, 2023
- **Y-axis:** Consumption in kWh (scale from 0 to 12,000+)
**Line Graph:**
- **X-axis:** Years from 2018 to 2023
- **Y-axis:** Cost in £ (scale from 0 to ~2,500)

**Data Series Details**

**Part 1: Energy Consumption (Bar Chart - kWh)**
1. **Gas (Highest usage):**
   - **2018:** ~12,000 kWh
   - **2020:** ~11,500 kWh
   - **2023:** ~10,800 kWh
   - **Trend:** Consistent high usage but steady decline.
2. **Electricity (Moderate usage):**
   - **2018:** ~4,200 kWh
   - **2020:** ~4,800 kWh (Peak)
   - **2023:** ~4,500 kWh
   - **Trend:** Relatively stable, with a slight peak in 2020.
3. **Renewable (Lowest but growing):**
   - **2018:** ~200 kWh (Tiny fraction)
   - **2020:** ~600 kWh
   - **2023:** ~1,800 kWh
   - **Trend:** Exponential growth, increasing 9-fold over the period.

**Part 2: Average Annual Bills (Line Graph - £)**
- **2018-2020:** Flat/Stable at approx £1,200 - £1,280.
- **2021:** Moderate rise to £1,450.
- **2022:** **Dramatic Spike** to £2,200 (Highest point).
- **2023:** Slight decrease to £2,050, but still nearly double the 2018 level.

**Key Comparative Features for Evaluation**
1. **Inverse Relationship (Consumption vs. Cost):**
   - While overall energy consumption (specifically Gas, the primary source) decreased from 2018 to 2023, the cost of energy nearly doubled in the same period.
   - Example: In 2023, households used less gas and slightly less electricity than in 2020, yet paid significantly more (£2,050 vs £1,280).

2. **Source Shift:**
   - There is a clear shift towards renewables, although gas remains the dominant energy source by a large margin.
   - Renewable usage is the only consumption category showing consistent, rapid growth.

3. **Cost Volatility:**
   - Energy prices were stable for the first half of the period (2018-2020) but became highly volatile and expensive in the second half (2021-2023).

**Critical Data Points for Accuracy Checking**
- **Gas 2018:** ~12,000 kWh
- **Renewables 2023:** ~1,800 kWh
- **Cost Peak 2022:** ~£2,200
- **Cost Start 2018:** ~£1,200`
  },
  10: {
    taskType: 1,
    prompt: "The table gives information about crop yields (measured in tonnes per hectare) for four different crops (wheat, corn, rice, and soy) grown using three distinct farming methods: traditional, organic, and hydroponic.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type and Title**
This is a table comparing crop yields (tonnes/ha) for four crops across three farming methods.

**Columns:**
1. Crop (Wheat, Corn, Rice, Soy)
2. Traditional Yield
3. Organic Yield
4. Hydroponic Yield

**Data Points (Yields in tonnes/ha):**
- **Wheat:** Hydroponic (12.6) > Traditional (8.2) > Organic (5.4)
- **Corn:** Hydroponic (15.8) > Traditional (10.5) > Organic (7.2)
- **Rice:** Hydroponic (9.4) > Traditional (7.8) > Organic (5.1)
- **Soy:** Hydroponic (6.5) > Traditional (3.2) > Organic (2.8)

**Key Features:**
1. **Hydroponic Superiority in Yield:** Hydroponic farming consistently produces the highest yields for all crops, typically close to double the organic yield.
2. **Organic Efficiency Lag:** Organic farming consistently produces the lowest yields across all crops.
3. **Crop Comparison:** Corn has the highest absolute yields (up to 15.8), while Soy has the lowest (max 6.5).`
  },
  11: {
    taskType: 1,
    prompt: "The line graph compares the percentage of cinema attendance among three age groups (18-25, 26-40, and 41-60 year olds) at a multiplex cinema throughout the course of a year. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type and Title**
Seasonal trend line graph

**Axes Information**
- **X-axis:** Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
- **Y-axis:** 0%-100% (attendance percentage)

**Data Series Details**
1. **18-25 (pink):** High volatility - Jan(45%), Feb trough(25%), Jul peak(85%), Aug dip(80%), Dec spike(78%)
2. **26-40 (blue):** Moderate stability 40-55% range, gentle summer/winter peaks
3. **41-60 (green):** Low flat baseline 15-25%, slight Dec bump to 35%

**Key Features**
Clear seasonality showing inverse relationship between age and volatility`
  },
  12: {
    taskType: 1,
    prompt: "The graph provides data on global ocean temperature anomalies from 1950 to 2023. The chart also includes a ten-year moving average trend line. Figures are measured in degrees Celsius. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type and Title**
Dual line (raw data + trend line)

**Axes Information**
- **X-axis:** 1950-2023 (continuous)
- **Y-axis:** -0.5°C to +1.2°C

**Data Series Details**
1. **Raw data (light blue thin line):** Volatile oscillations, -0.4 to +0.3 (1950-1980), climbing to +1.1 (2023)
2. **Trend line (thick red):** Smooth curve starting -0.1 (1950), crossing 0 (1995), reaching +0.9 (2023)
3. **Zero line reference (dashed horizontal)**

**Key Features**
Notable spikes: 1983, 1998, 2016, 2023 (El Niño events)`
  },
  13: {
    taskType: 1,
    prompt: "The line graph compares the average number of hours per day spent using smartphones and desktop computers by teenagers from 2010 to 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type and Title**
Dual-axis or overlapping line graph

**Axes Information**
- **X-axis:** 2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024
- **Y-axis:** 0-8 hours

**Data Series Details**
1. **Smartphone (pink gradient/fill):** 1.5→2.1→3.0→4.5→5.8→6.8→7.2→7.5 (continuous upward curve, steep after 2014)
2. **Computer (dark purple):** 3.0→2.8→2.6→2.3→2.0→1.8→1.5→1.2 (steady decline)

**Key Features**
1. **Critical feature:** Lines cross between 2014-2016 (intersection point ~2.5 hours)
2. Smartphone ends at 7.5h (6x increase), Computer ends at 1.2h (60% decrease)`
  },
  14: {
    taskType: 1,
    prompt: "The bar chart compares carbon dioxide emissions from four different sectors (transport, manufacturing, agriculture, and energy) in developed and developing countries in 2023. The figures are given in million tonnes. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type and Title**
Grouped/clustered bar chart titled "Carbon Dioxide Emissions by Sector, 2023"

**Axes Information**
- **X-axis:** Sectors (Transport, Manufacturing, Agriculture, Energy)
- **Y-axis:** Million tonnes CO2 (0-10)

**Data Series Details**
1. **Developed (light blue):** Transport 4.2, Manufacturing 2.1, Agriculture 1.8, Energy 5.5
2. **Developing (orange):** Transport 3.8, Manufacturing 6.5, Agriculture 4.2, Energy 7.8

**Key Features**
1. **Widest gap:** Manufacturing (4.4m tonnes difference between developed and developing).
2. **Narrowest gap:** Transport (only 0.4m tonnes difference).
3. **Highest overall:** Energy sector in developing countries (7.8m tonnes).`
  },
  15: {
    taskType: 1,
    prompt: "The chart illustrates the number of international student applications to UK universities across five subject areas in the years 2020 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type and Title**
Horizontal grouped bar chart titled "International Student Applications to UK Universities"

**Axes Information**
- **Y-axis (Categories):** Arts, Medicine, Engineering, Business, Computer Science
- **X-axis:** Number of applications (0-70,000)

**Data Series Details**
1. **2020 (light gray):** Arts 22k, Medicine 15k, Engineering 28k, Business 45k, CompSci 12k
2. **2023 (dark blue):** Arts 19k, Medicine 27k, Engineering 41k, Business 62k, CompSci 38k

**Key Features**
1. **Major Spike:** Computer Science shows over 3x growth (12k to 38k).
2. **Extremes:** Highest applications in Business 2023 (62k), lowest in Arts 2023 (19k).
3. **Sole decline:** Arts is the only category that decreased between 2020 and 2023.`
  },
  16: {
    taskType: 1,
    prompt: "The stacked bar chart shows the composition of municipal waste per capita in five major cities (Tokyo, London, Sydney, Toronto, and Stockholm) in 2022. The chart indicates the proportion of waste recycled, sent to landfill, or incinerated. Figures are measured in kilograms per person. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type and Title**
Absolute stacked bar chart titled "Municipal Waste Composition per Capita, 2022"

**Axes Information**
- **X-axis:** Tokyo, London, Sydney, Toronto, Stockholm
- **Y-axis:** Kilograms per person (0-800)

**Data Series Details (Segments: Recycled [green], Landfill [gray], Incinerated [blue])**
1. **Stockholm:** Total 420kg (Recycled 218kg, Landfill 100kg, Incinerated 102kg)
2. **Toronto:** Total 680kg (Recycled 258kg, Landfill 300kg, Incinerated 122kg)
3. **Sydney:** Total 740kg (Recycled 311kg, Landfill 300kg, Incinerated 129kg)
4. **London:** Total 520kg (Recycled 172kg, Landfill 200kg, Incinerated 148kg)
5. **Tokyo:** Total 380kg (Recycled 80kg, Landfill 200kg, Incinerated 100kg)

**Key Features**
1. **Highest total:** Sydney (740kg).
2. **Lowest total:** Tokyo (380kg).
3. **Highest recycling rate:** Stockholm (218/420 ≈ 52%).`
  },
  17: {
    taskType: 1,
    prompt: "The two pie charts illustrate how the national budget was allocated across different sectors (healthcare, education, defense, infrastructure, social welfare, and other expenditure) in 2013 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type:** Dual pie charts side-by-side
**Title:** National Budget Allocation 2013 vs 2023

**Left Pie (2013):**
- Healthcare: 18% (Red)
- Education: 22% (Blue)
- Defense: 15% (Green)
- Infrastructure: 12% (Orange)
- Social Welfare: 20% (Purple)
- Other: 13% (Gray)

**Right Pie (2023):**
- Healthcare: 28% (Red) [+10%]
- Education: 19% (Blue) [-3%]
- Defense: 12% (Green) [-3%]
- Infrastructure: 8% (Orange) [-4%]
- Social Welfare: 25% (Purple) [+5%]
- Other: 8% (Gray) [-5%]

**Key Features:**
1. Healthcare shows the largest increase (+10%), becoming nearly 1/3 of the pie.
2. Infrastructure and Other both dropped significantly.
3. Social Welfare is the second-largest growth area.`
  },
  18: {
    taskType: 1,
    prompt: "The three pie charts compare the spending patterns of three different types of tourists (backpackers, families, and business travellers) visiting a particular destination. The charts show the percentage of total expenditure across five categories. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type:** Three mini pie charts in a row
**Title:** Tourist Spending Patterns by Type

**Pie 1: Backpackers**
- Accommodation: 25% (Red)
- Food: 35% (Orange)
- Activities: 25% (Blue)
- Transport: 10% (Green)
- Shopping: 5% (Purple)

**Pie 2: Families**
- Accommodation: 40% (Red)
- Food: 20% (Orange)
- Activities: 20% (Blue)
- Transport: 10% (Green)
- Shopping: 10% (Purple)

**Pie 3: Business Travellers**
- Accommodation: 50% (Red)
- Food: 15% (Orange)
- Activities: 5% (Blue)
- Transport: 20% (Green)
- Shopping: 10% (Purple)

**Key Features:**
1. Accommodation increases left-to-right: 25% → 40% → 50%.
2. Activities decrease left-to-right: 25% → 20% → 5%.
3. Food is highest for backpackers (35%).`
  },
  19: {
    taskType: 1,
    prompt: "The pie chart shows the primary sources of plastic pollution in the Pacific Ocean. Additionally, there is an inset chart providing a detailed breakdown of pollution sources specifically from the fishing industry. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type:** Main pie with exploded inset
**Title:** Plastic Pollution Sources in the Pacific Ocean

**Main Chart:**
- Fishing Industry: 46% (Pink/Red, exploded/separated)
- Land-based Runoff: 28% (Dark Blue)
- Shipping: 12% (Teal)
- Offshore Oil/Gas: 8% (Gray)
- Other: 6% (Light Gray)

**Inset Chart (Fishing Industry Breakdown):**
- Nets: 42% (Dark Pink)
- Lines: 31% (Medium Pink)
- Traps: 18% (Light Pink)
- Other Gear: 9% (Very Light Pink)

**Key Features:**
1. Fishing Industry is nearly half of all pollution (46%).
2. Within fishing, nets alone account for 42% of fishing-related pollution.
3. Land-based runoff is second-largest at 28%.`
  },
  20: {
    taskType: 1,
    prompt: "The table compares life expectancy at birth, per capita healthcare expenditure, and the number of doctors per thousand people in six different countries in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type:** Data Table (6 rows × 4 columns)
**Title:** Healthcare Metrics by Country, 2020

| Country | Life Expectancy (years) | Healthcare Spend ($USD) | Doctors per 1000 |
|---------|-------------------------|-------------------------|------------------|
| Japan   | 84.6                    | $4,666                  | 2.5              |
| USA     | 77.5                    | $12,914                 | 2.6              |
| UK      | 80.7                    | $5,387                  | 2.8              |
| Germany | 81.3                    | $7,383                  | 4.2              |
| Brazil  | 75.9                    | $1,153                  | 2.3              |
| Nigeria | 54.3                    | $184                    | 0.4              |

**Key Observations:**
1. Japan has highest life expectancy (84.6) with moderate spend ($4,666).
2. USA has highest spend ($12,914) but lower life expectancy than Japan, UK, Germany.
3. Germany has most doctors per 1000 (4.2).
4. Nigeria is lowest in all categories.
5. USA spends ~70x more than Nigeria but lives 23 years less than Japan.`
  },
  21: {
    taskType: 1,
    prompt: "The table provides data regarding visitor numbers and visitor satisfaction ratings for three museums (Natural History, Science, and Art Gallery) over a six-month period. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type:** Complex Table with Dual Data Points
**Title:** Museum Visitor Numbers and Satisfaction Ratings

| Month | Natural History       | Science Museum        | Art Gallery           |
|-------|-----------------------|-----------------------|-----------------------|
|       | Visitors / Satisfaction | Visitors / Satisfaction | Visitors / Satisfaction |
| Jan   | 12,000 / 92%          | 8,500 / 88%           | 6,200 / 78%           |
| Mar   | 18,500 / 89%          | 11,200 / 85%          | 9,800 / 82%           |
| May   | 25,000 / 85%          | 15,000 / 87%          | 14,500 / 86%          |
| Jul   | 42,000 / 78%          | 22,000 / 90%          | 18,000 / 84%          |
| Sep   | 28,000 / 88%          | 16,500 / 86%          | 12,000 / 85%          |
| Nov   | 15,000 / 94%          | 9,000 / 89%           | 7,500 / 81%           |

**Key Observations:**
1. Natural History has peak visitors in Jul (42,000) but lowest satisfaction (78%).
2. Natural History has highest satisfaction in Nov (94%) with lowest visitors (15,000).
3. Inverse relationship: Higher visitors correlate with lower satisfaction at Natural History.
4. Science Museum maintains consistent satisfaction (85-90%) despite visitor fluctuations.`
  },
  22: {
    taskType: 1,
    prompt: "The diagram shows how a domestic rainwater harvesting system collects, treats, and distributes rainwater for various household uses. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type:** Linear Process Flow Diagram
**Title:** Domestic Rainwater Harvesting System

**Stage 1 - Collection:**
- House with red roof
- Rain collected into blue underground storage tank

**Stage 2 - Treatment:**
- Gray pump extracts water
- Orange filter cleans water

**Stage 3 - Household Use (3 destinations):**
- Toilet: 30%
- Washing: 30%
- Garden: 40%

**Flow Summary:**
Rain → Storage Tank → Pump → Filter → Household Use`
  },
  23: {
    taskType: 1,
    prompt: "The diagram illustrates the process of producing coffee, from harvesting the beans to making a cup of coffee. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type:** 5-Stage Linear Process Diagram
**Title:** Coffee Production Process

**Stages:**
1. **Harvesting:** Picker picking beans from tree/bush.
2. **Drying:** Beans spread in sun.
3. **Roasting:** Beans heated/roasted.
4. **Grinding:** Beans ground into powder.
5. **Brewing:** Water added to filter/machine to make coffee.

**Key Features:**
1. Linear process with 5 distinct steps.
2. Starts with raw natural product (beans on tree) and ends with consumer product (cup of coffee).
3. Involves both natural processes (drying) and mechanical processes (grinding, roasting).`
  },
  24: {
    taskType: 1,
    prompt: "The bar chart compares the percentage of people with access to the Internet and mobile phones in two different countries. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    chartMetadata: `**Chart Type:** Bar Chart
**Title:** Access to Technology: Country A vs Country B

**Data:**
- **Country A:**
  - Internet Access: 80%
  - Mobile Phone Access: 75%
- **Country B:**
  - Internet Access: 45%
  - Mobile Phone Access: 60%

**Key Observations:**
1. Country A has significantly higher internet access (80%) compared to Country B (45%).
2. Mobile phone access is more comparable, though Country A still leads (75% vs 60%).
3. In Country A, internet access is slightly higher than mobile access.
4. In Country B, the trend is reversed: mobile access (60%) is higher than internet access (45%).`
  }
};

// Retrieves a random writing prompt for a specific task type.
export const getWritingPrompt = api<{ taskType: number; test_id?: number }, WritingPrompt>(
  { expose: true, method: "GET", path: "/writing/prompt/:taskType" },
  async ({ taskType, test_id }) => {
    // If a specific test ID is provided and we have a prompt for it, return that
    const id = test_id ? Number(test_id) : null;

    // Use testSpecificPrompts lookup if ID is provided
    if (id !== null && testSpecificPrompts[id]) {
      return testSpecificPrompts[id];
    }


    const prompts = writingPrompts[taskType] || [];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const prompt = prompts[randomIndex];

    return {
      taskType,
      prompt,
    };
  }
);

// Submits writing answers for evaluation.
export const submitWriting = api<WritingSubmission, WritingFeedback>(
  { expose: true, method: "POST", path: "/writing/submit", auth: true },
  async (req) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== req.userId) {
      throw APIError.permissionDenied("You can only submit for yourself");
    }
    console.warn("⚠️  DEPRECATED: submitWriting endpoint called. This generates MOCK data. Use /ielts_writing/evaluate for real AI evaluation.");

    // Mock AI evaluation - in a real app, this would call an AI service
    const wordCount = req.content.split(/\s+/).length;
    const bandScore = req.bandScore ?? (Math.round((Math.random() * 3 + 5) * 10) / 10); // 5.0-8.0 range

    const grammarFeedback = req.grammarFeedback ?? (bandScore >= 7
      ? "Good grammar usage with minor errors. Consider reviewing complex sentence structures."
      : "Focus on improving grammar accuracy. Pay attention to verb tenses and subject-verb agreement.");

    const vocabularyFeedback = req.vocabularyFeedback ?? (bandScore >= 7
      ? "Good range of vocabulary. Try to use more sophisticated and topic-specific words."
      : "Expand your vocabulary range. Use more varied and precise words to express your ideas.");

    const structureFeedback = req.structureFeedback ?? (req.taskType === 1
      ? "Ensure you have a clear introduction, body paragraphs describing the data, and a conclusion."
      : "Make sure you have a clear introduction, body paragraphs with supporting arguments, and a conclusion.");

    const coherenceFeedback = req.coherenceFeedback ?? (wordCount < 150
      ? "Your response is too short. Aim for at least 150 words for Task 1 or 250 words for Task 2."
      : "Good coherence and cohesion. Use more linking words to improve flow between ideas.");

    const session = await ieltsDB.queryRow<WritingFeedback>`
      INSERT INTO writing_submissions
      (user_id, task_type, prompt, content, band_score, grammar_feedback,
        vocabulary_feedback, structure_feedback, coherence_feedback)

VALUES(${req.userId
      }, ${req.taskType}, ${req.prompt}, ${req.content},
  ${bandScore}, ${grammarFeedback}, ${vocabularyFeedback},
  ${structureFeedback}, ${coherenceFeedback})
  RETURNING id, band_score as "bandScore", grammar_feedback as "grammarFeedback",
    vocabulary_feedback as "vocabularyFeedback", structure_feedback as "structureFeedback",
    coherence_feedback as "coherenceFeedback"
`;

    if (!session) {
      throw new Error("Failed to save writing submission");
    }

    return session;
  }
);

export const getWritingSessionById = api<{ id: number }, { session: WritingSession | null }>(
  { expose: true, method: "GET", path: "/writing/sessions/:id", auth: true },
  async ({ id }) => {
    const auth = getAuthData() as AuthData | null;
    const session = await ieltsDB.queryRow<WritingSession & { user_id: string }>`
      SELECT id, user_id as "user_id", task_type as "taskType", prompt, content, band_score as "bandScore",
        grammar_feedback as "grammarFeedback", vocabulary_feedback as "vocabularyFeedback",
        structure_feedback as "structureFeedback", coherence_feedback as "coherenceFeedback",
        created_at as "createdAt"
      FROM writing_submissions
      WHERE id = ${id}
    `;

    if (session && session.user_id !== auth?.userID) {
      throw APIError.permissionDenied("You can only access your own writing sessions");
    }
    return { session };
  }
);

// Retrieves user's writing session history.
export const getWritingSessions = api<{ userId: string }, { sessions: WritingSession[] }>(
  { expose: true, method: "GET", path: "/users/:userId/writing/sessions", auth: true },
  async ({ userId }) => {
    const auth = getAuthData() as AuthData | null;
    if (auth?.userID !== userId) {
      throw APIError.permissionDenied("You can only access your own writing sessions");
    }
    const sessions = await ieltsDB.queryAll<WritingSession>`
      SELECT id, task_type as "taskType", prompt, content, band_score as "bandScore",
  grammar_feedback as "grammarFeedback", vocabulary_feedback as "vocabularyFeedback",
  structure_feedback as "structureFeedback", coherence_feedback as "coherenceFeedback",
  created_at as "createdAt"
      FROM writing_submissions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
  `;

    return { sessions };
  }
);
