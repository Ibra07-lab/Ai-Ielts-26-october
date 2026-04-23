import { TopicData } from "./types";

export const transportMobilityTopicData: TopicData = {
    topic: {
        id: 8,
        name: "Transport & Mobility",
        icon: "🚌",
        description: "Advanced academic vocabulary for discussing transportation systems, urban planning, and future mobility.",
        wordsCount: 33,
        color: "bg-indigo-500",
        ieltsSection: "writing",
        status: "new",
        previewWords: ["mass transit", "autonomous vehicle", "active travel"],
        progress: 0,
    },
    words: [
        {
            id: 1,
            word: "private vehicle",
            definition: "The formal, academic term for a personally owned car, motorcycle, or van used for individual rather than shared transport",
            exampleSentence: "In most American suburbs, private vehicle ownership is not a choice — it is a necessity. There are no footpaths, no buses, and the nearest shop is five miles away.",
            writingExample: "The over-reliance on private vehicles in low-density suburban communities is not a reflection of consumer preference but a structural consequence of decades of planning decisions that prioritised road construction over public transport provision.",
            difficultyLevel: 7,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["private vehicle ownership", "private vehicle dependency", "over-reliance on private vehicles", "restrict private vehicle access"]
        },
        {
            id: 2,
            word: "public transport",
            definition: "The collective term for buses, trains, trams, metros, and other shared transport systems available to the general public",
            exampleSentence: "When London introduced the Oyster card, public transport use increased significantly almost overnight. Removing the friction of buying a ticket changed behaviour more effectively than any awareness campaign.",
            writingExample: "Governments that invest seriously in public transport infrastructure consistently achieve lower rates of car dependency, reduced urban carbon emissions, and higher levels of social mobility among low-income residents who cannot afford private vehicle ownership.",
            difficultyLevel: 6,
            topic: "Transport & Mobility",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "B2",
            collocations: ["reliable public transport", "invest in public transport", "public transport ridership", "inadequate public transport"]
        },
        {
            id: 3,
            word: "mass transit",
            definition: "Large-scale, high-capacity public transport systems — particularly underground railways, elevated rail, and bus rapid transit — designed to move very large numbers of people efficiently",
            exampleSentence: "Tokyo's mass transit system carries over eight million passengers on the Metro alone every weekday. The city would be completely paralysed without it — you simply cannot build enough roads for eight million daily journeys.",
            writingExample: "Rapidly growing megacities face an urgent choice: invest ambitiously in mass transit infrastructure now, while urban form is still being established, or allow car-centric development patterns to take hold that will make sustainable transport permanently unviable.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["mass transit system", "invest in mass transit", "efficient mass transit", "mass transit reduces congestion"]
        },
        {
            id: 4,
            word: "freight transport",
            definition: "The movement of goods, cargo, and materials by road, rail, sea, or air — as distinct from passenger transport",
            exampleSentence: "The explosion of online shopping has created a last-mile delivery crisis in cities worldwide. Every package ordered online generates a van journey in dense urban areas, contributing significantly to both congestion and pollution.",
            writingExample: "Decarbonising freight transport presents challenges qualitatively different from electrifying the passenger vehicle fleet — the weight and energy intensity requirements of heavy goods vehicles make battery-electric solutions technically demanding at current levels of battery technology.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["freight transport emissions", "road freight", "shift freight from road to rail", "last-mile freight delivery"]
        },
        {
            id: 5,
            word: "active travel",
            definition: "The formal academic and policy term for modes of travel involving physical activity — primarily walking and cycling",
            exampleSentence: "During the COVID-19 pandemic, cities that installed temporary cycling lanes saw cycling rates increase dramatically almost overnight. The lesson was clear: people had not been cycling before because the infrastructure had not made it feel safe — not because they did not want to.",
            writingExample: "Investment in active travel infrastructure delivers a co-benefits effect — simultaneously reducing carbon emissions, alleviating pressure on road networks, improving population health, and reducing long-term healthcare costs through a single category of infrastructure spending.",
            difficultyLevel: 7,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["active travel infrastructure", "promote active travel", "invest in active travel", "active travel uptake"]
        },
        {
            id: 6,
            word: "high-speed rail",
            definition: "A rail transport system operating at significantly higher speeds than conventional rail — typically above 200 km/h — connecting cities over medium distances",
            exampleSentence: "When France opened its TGV line between Paris and Lyon, Air Inter lost the majority of passengers on that route within a few years — not because anyone was forced onto the train, but because the train became genuinely faster and more convenient than flying.",
            writingExample: "High-speed rail represents the most credible large-scale alternative to short and medium-haul aviation, capable of connecting city pairs up to 800 kilometres apart with journey times competitive with flying once airport access, security, and boarding are included.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["invest in high-speed rail", "high-speed rail network", "high-speed rail as an alternative to flying", "high-speed rail reduces aviation demand"]
        },
        {
            id: 7,
            word: "light rail / tram",
            definition: "An urban rail system operating at lower speeds than underground metro systems, typically running partly or entirely on street level",
            exampleSentence: "Manchester's Metrolink tram system has grown from a modest network in 1992 to nearly 100 stops covering Greater Manchester. Property values along tram corridors have risen and car use on parallel routes has fallen measurably.",
            writingExample: "Light rail occupies a valuable middle position in the spectrum of urban public transport — offering significantly higher capacity than standard buses while avoiding the enormous capital expenditure of underground metro construction, making it particularly suitable for medium-density cities.",
            difficultyLevel: 7,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "B2",
            collocations: ["light rail network", "invest in light rail", "extend the tram network", "light rail corridor"]
        },
        {
            id: 8,
            word: "bus rapid transit (BRT)",
            definition: "A high-capacity bus system operating on dedicated lanes with pre-board ticketing and priority signals, designed to provide metro-like performance at lower cost",
            exampleSentence: "Bogotá's TransMilenio BRT system halved journey times on major corridors within a decade of opening. The system was built for a fraction of what an equivalent metro would have cost, demonstrating that world-class public transport does not require a wealthy city.",
            writingExample: "Bus rapid transit has proven particularly valuable in rapidly urbanising developing-world cities, where the prohibitive cost of underground rail construction and the urgency of mobility demand require a solution that can be implemented quickly and scaled incrementally as cities grow.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["implement BRT", "dedicated BRT corridor", "BRT as an alternative to metro", "BRT ridership"]
        },
        {
            id: 9,
            word: "electric vehicle (EV)",
            definition: "A vehicle powered entirely or primarily by electric motors drawing energy from rechargeable batteries, producing no direct exhaust emissions",
            exampleSentence: "Norway's success in incentivising electric vehicle adoption rested on a simple principle: make the EV the financially rational choice through zero purchase tax, free parking, and access to bus lanes. Behaviour followed economics — as it usually does.",
            writingExample: "While the transition to electric vehicles is essential for transport decarbonisation, it addresses exhaust emissions without addressing congestion, car dependency, or transport inequality — suggesting that electrification, while necessary, is profoundly insufficient as a comprehensive policy response.",
            difficultyLevel: 7,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["electric vehicle adoption", "electric vehicle charging infrastructure", "transition to electric vehicles", "lifecycle emissions of electric vehicles"]
        },
        {
            id: 10,
            word: "autonomous vehicle (AV)",
            definition: "A self-driving vehicle using artificial intelligence and sensor systems to navigate and operate without direct human control",
            exampleSentence: "When a self-driving car faces an unavoidable accident, it makes a life-and-death decision based on an algorithm written months earlier by an engineer. Who authorised that moral choice? These are not science fiction questions — they are being answered right now, largely without public debate.",
            writingExample: "The autonomous vehicle raises profound questions extending well beyond road safety — including legal liability for algorithmically caused harm, the displacement of millions of professional drivers, and the democratic accountability of the software governing life-and-death decisions on public roads.",
            difficultyLevel: 9,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["widespread adoption of autonomous vehicles", "autonomous vehicle regulation", "autonomous vehicle liability", "ethical implications of autonomous vehicles"]
        },
        {
            id: 11,
            word: "cycling infrastructure",
            definition: "Physical facilities designed to enable and encourage cycling — including segregated lanes, cycle paths, secure parking, and bicycle hire schemes",
            exampleSentence: "The Netherlands did not become a cycling nation by accident. It became one through political choices made in the 1970s to redesign streets around cyclists rather than cars. The infrastructure came first — and the cyclists followed.",
            writingExample: "Evidence from the Netherlands, Denmark, and increasingly from London and Paris demonstrates that cycling infrastructure creates its own demand — when high-quality, physically segregated networks are built, cycling rates rise dramatically across all demographic groups, including those previously deterred by safety concerns.",
            difficultyLevel: 7,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["segregated cycling infrastructure", "invest in cycling infrastructure", "high-quality cycling infrastructure", "cycling infrastructure encourages uptake"]
        },
        {
            id: 12,
            word: "transport network",
            definition: "The complete, interconnected system of routes, vehicles, services, and infrastructure that together enable movement within or between areas",
            exampleSentence: "What makes Singapore's transport network exceptional is not any single element but the way everything connects — you can plan a journey from any point to any other, combining multiple modes, and the system guides you seamlessly between them.",
            writingExample: "The effectiveness of public transport in reducing car dependency depends less on the quality of individual services than on the degree of integration within the wider transport network — a unified system is significantly more effective at attracting car users than a collection of uncoordinated services, however individually excellent.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["integrated transport network", "transport network coverage", "gaps in the transport network", "transport network resilience"]
        },
        {
            id: 13,
            word: "road network",
            definition: "The system of roads, motorways, and streets forming the physical infrastructure for vehicle travel within an area",
            exampleSentence: "Houston has the most extensive road network of any major American city — and also some of its worst congestion. The Katy Freeway was widened at enormous cost in 2011. Within a few years, congestion had returned to pre-expansion levels and exceeded them.",
            writingExample: "The persistent expansion of the road network in response to congestion reflects a fundamental misunderstanding of transport economics — induced demand ensures that additional capacity generates additional journeys, rapidly restoring pre-expansion congestion levels while leaving governments with the maintenance costs of a larger network.",
            difficultyLevel: 7,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "B2",
            collocations: ["expand the road network", "road network capacity", "strain on the road network", "road network and induced demand"]
        },
        {
            id: 14,
            word: "urban motorway",
            definition: "A high-capacity road built through or around an urban area, originally designed to carry large volumes of fast-moving traffic through cities",
            exampleSentence: "When San Francisco demolished its earthquake-damaged Embarcadero Freeway, the traffic it had carried did not relocate to other roads — much of it simply disappeared. The waterfront, previously severed from the city by concrete, was reconnected and came alive.",
            writingExample: "The demolition of urban motorways in San Francisco, Seoul, and Milwaukee produced outcomes that confounded traffic engineers — vehicle volumes fell significantly rather than relocating, while previously severed communities were reconnected, generating substantial improvements in urban vitality and public health.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["urban motorway and community severance", "demolish urban motorways", "urban motorway removal", "the legacy of urban motorways"]
        },
        {
            id: 15,
            word: "pedestrian zone",
            definition: "An area of a city from which motor vehicles are excluded or significantly restricted, giving priority to people on foot",
            exampleSentence: "When New York pedestrianised Times Square in 2009, local businesses predicted economic catastrophe. What followed instead was a 71% increase in retail sales in the first year and a 40% fall in pedestrian injuries.",
            writingExample: "Evidence from pedestrianisation schemes in New York, Copenhagen, and Ghent consistently refutes the assumption that restricting vehicle access harms local economic activity — in the majority of documented cases, retail footfall and commercial revenues increase following pedestrianisation as the improved environment attracts more visitors.",
            difficultyLevel: 7,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "B2",
            collocations: ["pedestrianise city centres", "pedestrian zone and retail footfall", "pedestrian zone improves air quality", "expand pedestrian zones"]
        },
        {
            id: 16,
            word: "transport hub",
            definition: "A central location where multiple transport modes converge, enabling passengers to transfer efficiently between different services",
            exampleSentence: "Amsterdam Centraal is the living proof of integrated transport. Within or just outside the building, you can transfer between intercity trains, the metro, trams, ferries, and one of the world's largest cycle parking facilities — the boundaries between modes effectively disappear.",
            writingExample: "Designing cities around major transport hubs — concentrating residential and commercial development within walking distance of principal public transport nodes — represents the most powerful long-term strategy for reducing private vehicle dependency by making car-free living genuinely convenient rather than merely aspirational.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["major transport hub", "integrated transport hub", "transport hub connectivity", "transport hub and urban development"]
        },
        {
            id: 17,
            word: "road capacity",
            definition: "The maximum number of vehicles a road or road network can carry within a given time period under normal operating conditions",
            exampleSentence: "The M25 orbital motorway around London was described as already at capacity before it opened in 1986. Widening schemes followed repeatedly. Each expansion generated the traffic that filled it. The M25 is an expensive monument to induced demand.",
            writingExample: "Increasing road capacity is counter-intuitively self-defeating — the phenomenon of induced demand ensures that new capacity attracts additional journeys that consume the available space within three to five years, returning congestion to pre-expansion levels while leaving governments with the maintenance costs of a permanently larger network.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["increase road capacity", "road capacity expansion", "road capacity and induced demand", "exceed road capacity"]
        },
        {
            id: 18,
            word: "charging infrastructure",
            definition: "The network of electric vehicle charging points and stations needed to make electric vehicle ownership practical at scale",
            exampleSentence: "Range anxiety is not really about daily driving — most journeys are well within battery range. It is the fear of being stranded somewhere unfamiliar without a charger nearby. Until charging infrastructure is as ubiquitous as petrol stations, that fear will continue to deter potential EV buyers.",
            writingExample: "The transition to electric vehicles cannot proceed at the pace demanded by climate targets without parallel investment in public charging infrastructure — particularly in urban areas where most residents live in flats without access to private off-street parking and are entirely dependent on publicly accessible charging networks.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["charging infrastructure gap", "invest in charging infrastructure", "public charging infrastructure", "charging infrastructure rollout"]
        },
        {
            id: 19,
            word: "urban planning",
            definition: "The professional discipline and governmental function concerned with designing and managing urban areas — including land use, building density, transport infrastructure, and public space",
            exampleSentence: "Phoenix and Amsterdam cover roughly similar land areas. Phoenix is one of the most car-dependent cities on earth. Amsterdam is one of the least. The difference is not culture or wealth — it is seventy years of different urban planning decisions about density, land use, and transport investment.",
            writingExample: "Transport problems are, at their deepest level, urban planning problems — the spatial organisation of cities, the density of development, and the allocation of public space between vehicles and people determine mobility patterns far more powerfully than any individual transport policy or technological solution.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["integrated urban planning", "urban planning and transport", "poor urban planning", "urban planning and car dependency"]
        },
        {
            id: 20,
            word: "land use",
            definition: "The way in which land within an area is categorised and regulated — for housing, commerce, industry, or transport infrastructure — and how these categories are mixed or separated",
            exampleSentence: "American zoning laws typically separate homes, offices, shops, and restaurants into entirely different zones, often miles apart. When your daily destinations are in four different places connected only by roads, driving is not a preference — it is an inevitability built into the legal structure of the city.",
            writingExample: "Low-density, single-use development patterns render public transport economically unviable and walking physically impractical, making private vehicle dependency structurally inevitable regardless of the quality of transport provision — which means that meaningful transport reform requires simultaneous land use reform rather than transport investment alone.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["mixed land use", "land use and car dependency", "single-use land development", "land use reform"]
        },
        {
            id: 21,
            word: "transport corridor",
            definition: "A defined geographic route along which significant transport movement is concentrated — typically designated for specific infrastructure investment and associated development",
            exampleSentence: "London's Jubilee Line Extension did not just move people — it transformed everything along its route. Neighbourhoods that had been isolated and economically depressed became vibrant and connected. The transport corridor became a development corridor, and the development generated the passengers that justified the transport.",
            writingExample: "The most effective transit-oriented development concentrates investment along defined transport corridors — permitting higher-density, mixed-use development within walking distance of stations while maintaining lower densities elsewhere, ensuring that infrastructure generates sufficient ridership to be financially sustainable.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "noun phrase",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["transport corridor development", "major transport corridor", "development along transport corridors", "transport corridor and density"]
        },
        {
            id: 22,
            word: "commute",
            definition: "To travel regularly — typically daily — between home and place of work or study",
            exampleSentence: "Research published in the American Economic Review found that the daily commute is one of the activities people enjoy least — ranking below housework. A 23-minute commute, if eliminated, produces the same wellbeing improvement as a 33% pay rise.",
            writingExample: "Commuting time is one of the most significant determinants of urban residents' quality of life — research consistently demonstrates that it correlates negatively with reported wellbeing, and that active travel commutes are associated with markedly higher satisfaction than equivalent journeys made by car.",
            difficultyLevel: 6,
            topic: "Transport & Mobility",
            partOfSpeech: "verb / noun",
            type: "academic",
            cefrLevel: "B1",
            collocations: ["daily commute", "long commute", "commute by train / car / bike", "commuting and wellbeing"]
        },
        {
            id: 23,
            word: "alleviate",
            definition: "To reduce the severity of a problem — to make it less serious without necessarily eliminating it entirely",
            exampleSentence: "Nothing alleviates the psychological misery of traffic congestion quite like a reliable timetable. Public transport, whatever its faults, tells you when you will arrive. That certainty alleviates stress in a way that sitting in unpredictable traffic never can.",
            writingExample: "Investment in public transport can significantly alleviate urban congestion but cannot eliminate it without complementary demand management measures — including congestion pricing and parking restrictions — that actively deter private vehicle use rather than simply offering an alternative.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["alleviate congestion", "alleviate transport poverty", "measures to alleviate", "alleviate pressure on roads"]
        },
        {
            id: 24,
            word: "deter",
            definition: "To discourage a particular behaviour through cost, inconvenience, or perceived risk — to make something less attractive without absolutely prohibiting it",
            exampleSentence: "The London Congestion Charge was designed specifically to deter discretionary car journeys from the city centre during peak hours. Traffic in the charging zone fell by around 30% in its first year — and many of those journeys did not simply move elsewhere. They did not happen at all.",
            writingExample: "Road pricing mechanisms are most effective when calibrated to deter discretionary journeys — those made out of habit or convenience — while remaining affordable for those with no viable alternative, ensuring that behavioural change occurs without penalising those who genuinely depend on private vehicles.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["deter car use", "deter discretionary journeys", "pricing that deters", "deter through cost"]
        },
        {
            id: 25,
            word: "incentivise",
            definition: "To provide positive encouragement or financial benefit to make a particular behaviour more attractive and more likely to occur",
            exampleSentence: "Norway stacked every possible financial incentive in favour of electric vehicles — zero purchase tax, free parking, free motorway tolls, access to bus lanes — until buying a petrol car became the more expensive and less convenient option. Behaviour followed economics, as it usually does.",
            writingExample: "Effective transport policy must simultaneously incentivise sustainable alternatives through subsidised fares and infrastructure investment, and disincentivise car use through road pricing and parking charges — either approach alone is insufficient, since incentivising alternatives without deterring driving leaves the default behaviour unchanged.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["incentivise public transport use", "incentivise electric vehicle adoption", "incentivise modal shift", "incentivise active travel"]
        },
        {
            id: 26,
            word: "exacerbate",
            definition: "To make a problem significantly worse — to intensify or aggravate a negative situation",
            exampleSentence: "Atlanta has more highway lane-miles per capita than almost any other American city — and also some of its worst congestion. Each new road has exacerbated the problem it was meant to solve, generating sprawl and car journeys that fill the new capacity within years.",
            writingExample: "Road expansion, far from alleviating urban congestion, frequently exacerbates it — induced demand ensures that new capacity attracts additional journeys, while simultaneously incentivising the low-density development that generates yet further traffic growth, creating a self-reinforcing cycle from which car-centric cities find it extraordinarily difficult to escape.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["exacerbate congestion", "exacerbate car dependency", "exacerbate inequality", "exacerbate urban sprawl"]
        },
        {
            id: 27,
            word: "facilitate",
            definition: "To make a process or action easier or more achievable — to remove barriers rather than compel behaviour",
            exampleSentence: "A well-designed cycling network does not force anyone to cycle — it facilitates cycling by making it a realistic option for people who would like to but find it too dangerous. Infrastructure does not change values. It changes what values can achieve.",
            writingExample: "High-quality transport infrastructure facilitates economic activity in ways extending beyond reduced journey times — improving accessibility of employment centres, enabling larger labour market catchment areas, and making it viable for businesses to locate in areas previously considered too poorly connected.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["facilitate modal shift", "facilitate active travel", "facilitate economic activity", "facilitate access to"]
        },
        {
            id: 28,
            word: "displace",
            definition: "In transport, to cause journeys to shift from one mode to another — with the important implication that the original demand may or may not follow",
            exampleSentence: "When Stockholm introduced its congestion charge, planners waited for displaced traffic to reappear on surrounding roads. Much of it never came. Many journeys that had been displaced from the city centre had simply not been made at all — the charge had not moved traffic, it had dissolved it.",
            writingExample: "High-capacity public transport on major urban corridors can displace a significant proportion of private vehicle journeys onto more sustainable modes — but the effectiveness of this displacement depends critically on whether the public transport alternative is genuinely superior in terms of speed, cost, and reliability.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["displace car journeys", "displace trips onto public transport", "traffic displacement", "displacement of journeys"]
        },
        {
            id: 29,
            word: "generate",
            definition: "To produce or create — in transport, most commonly used for the generation of traffic, demand, emissions, or economic activity",
            exampleSentence: "A new shopping centre does not serve existing demand — it generates new demand. People do not redirect existing trips; they make additional ones. The same principle applies to roads: new capacity does not accommodate existing journeys more efficiently. It generates journeys that would not otherwise have occurred.",
            writingExample: "New road infrastructure generates traffic through multiple simultaneous mechanisms — attracting peak-hour avoiders, encouraging public transport users to switch to cars, and incentivising development patterns that produce additional vehicle journeys — such that new capacity consistently reproduces and ultimately exceeds pre-expansion congestion levels.",
            difficultyLevel: 7,
            topic: "Transport & Mobility",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "B2",
            collocations: ["generate traffic", "generate additional journeys", "generate emissions", "generate economic activity"]
        },
        {
            id: 30,
            word: "prioritise",
            definition: "To treat something as more important than other things in the allocation of resources, planning decisions, and policy choices",
            exampleSentence: "Every road, every pavement, every bike lane is a political statement about whose needs have been prioritised. When a city builds six lanes of traffic and a narrow footpath, it is saying cars matter more than people. Transport is politics made concrete.",
            writingExample: "Cities that have most successfully reduced car dependency share one characteristic: they have explicitly and consistently prioritised public transport, cycling, and pedestrians in the allocation of road space and public investment over several decades — a long-term political commitment that is both more difficult and more effective than any short-term technological intervention.",
            difficultyLevel: 7,
            topic: "Transport & Mobility",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "B2",
            collocations: ["prioritise public transport", "prioritise pedestrians and cyclists", "prioritise sustainable modes", "prioritise road space"]
        },
        {
            id: 31,
            word: "integrate",
            definition: "To combine different elements into a unified, coherent whole — in transport, to connect different modes, services, and ticketing systems so they work together seamlessly",
            exampleSentence: "Japan's Suica IC card lets you pay for the bullet train, the Tokyo Metro, local buses, taxis, and your coffee at the station convenience store with a single tap. The boundaries between transport modes effectively disappear. That frictionlessness is the single most powerful driver of public transport use.",
            writingExample: "The degree of integration across a transport network is often a more important determinant of public transport use than the quality of any individual service — a unified system with coordinated timetabling and seamless interchange is significantly more effective at attracting car users than a collection of excellent but uncoordinated services.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["integrated transport system", "integrate transport modes", "integrate ticketing systems", "seamlessly integrate"]
        },
        {
            id: 32,
            word: "restrict",
            definition: "To limit or control access to something — in transport, to impose constraints on vehicle use or road access in order to manage demand and improve urban environments",
            exampleSentence: "Oslo removed all on-street car parking from its city centre — not reduced it, removed it completely. The spaces became cycling infrastructure and wider pavements. Shopkeepers predicted ruin. What they got was a cleaner, quieter, more economically vibrant city centre.",
            writingExample: "Restricting private vehicle access to urban centres through low emission zones and the removal of on-street parking has been demonstrated across European cities to improve air quality, reduce road casualties, and stimulate local economic activity — despite the near-universal initial opposition of local businesses who consistently overestimate the commercial importance of driving customers.",
            difficultyLevel: 7,
            topic: "Transport & Mobility",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "B2",
            collocations: ["restrict car access", "restrict private vehicles", "restrict parking", "restrict access to city centres"]
        },
        {
            id: 33,
            word: "subsidise",
            definition: "To use public funding to reduce the price of a service below its market cost — making it more affordable to achieve a social or environmental policy objective",
            exampleSentence: "Vienna's annual public transport pass costs around €365 — roughly one euro per day. The subsidy required is substantial, but the city's calculation is that the social, environmental, and economic returns far exceed the fiscal cost. Vienna consistently ranks as one of the most liveable cities in the world.",
            writingExample: "The economic case for subsidising public transport fares is considerably stronger than public debate typically acknowledges — the wider social benefits generated by high ridership, including reduced congestion costs, lower healthcare expenditure related to air pollution, and improved labour market access for low-income workers, typically exceed the direct fiscal cost of the subsidy by a substantial margin.",
            difficultyLevel: 8,
            topic: "Transport & Mobility",
            partOfSpeech: "verb",
            type: "academic",
            cefrLevel: "C1",
            collocations: ["subsidise public transport", "subsidise fares", "heavily subsidised", "justification for subsidising"]
        }
    ],
    exercises: {
        synonymSwap: [


      // ─── 1. PRIVATE VEHICLE ───────────────────────────────────────────
      {
        "id": 1,
        "sentence": "In most American suburbs, personally owned car use is not a choice — it is a necessity imposed by the absence of any viable alternative.",
        "targetWord": "personally owned car use",
        "options": [
          {
            "id": "A",
            "text": "public transport",
            "isCorrect": false,
            "feedback": "Incorrect. Public transport refers to shared systems like buses and trains — not individually owned vehicles."
          },
          {
            "id": "B",
            "text": "mass transit",
            "isCorrect": false,
            "feedback": "Incorrect. Mass transit refers to large-scale shared transport systems, not individual vehicle ownership."
          },
          {
            "id": "C",
            "text": "private vehicle dependency",
            "isCorrect": true,
            "feedback": "Correct! Private vehicle dependency is the formal academic term for reliance on personally owned cars as a necessity rather than a choice."
          },
          {
            "id": "D",
            "text": "active travel",
            "isCorrect": false,
            "feedback": "Incorrect. Active travel refers to walking and cycling — human-powered modes of transport."
          }
        ]
      },
      {
        "id": 2,
        "sentence": "Governments must reduce the number of individually owned cars on urban roads if they are serious about meeting carbon reduction targets.",
        "targetWord": "individually owned cars",
        "options": [
          {
            "id": "A",
            "text": "freight vehicles",
            "isCorrect": false,
            "feedback": "Incorrect. Freight vehicles carry goods, not personal passengers — this is a different category entirely."
          },
          {
            "id": "B",
            "text": "private vehicles",
            "isCorrect": true,
            "feedback": "Correct! Private vehicles is the precise academic term for individually owned cars and motorcycles used for personal transport."
          },
          {
            "id": "C",
            "text": "autonomous vehicles",
            "isCorrect": false,
            "feedback": "Not quite. Autonomous vehicles are self-driving cars — the sentence is about ownership, not automation."
          },
          {
            "id": "D",
            "text": "light rail",
            "isCorrect": false,
            "feedback": "Incorrect. Light rail is a form of public transport — not individually owned vehicles."
          }
        ]
      },

      // ─── 2. PUBLIC TRANSPORT ─────────────────────────────────────────
      {
        "id": 3,
        "sentence": "Cities that invest in shared bus and train systems consistently achieve lower rates of car dependency and reduced urban carbon emissions.",
        "targetWord": "shared bus and train systems",
        "options": [
          {
            "id": "A",
            "text": "cycling infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Cycling infrastructure refers to lanes and paths for cyclists — not buses and trains."
          },
          {
            "id": "B",
            "text": "freight transport",
            "isCorrect": false,
            "feedback": "Incorrect. Freight transport moves goods, not passengers on buses and trains."
          },
          {
            "id": "C",
            "text": "active travel",
            "isCorrect": false,
            "feedback": "Not quite. Active travel refers to walking and cycling — not motorised shared systems."
          },
          {
            "id": "D",
            "text": "public transport",
            "isCorrect": true,
            "feedback": "Correct! Public transport is the collective term for shared systems — buses, trains, trams, and metros — available to the general public."
          }
        ]
      },
      {
        "id": 4,
        "sentence": "Inadequate shared travel systems leave low-income residents with no viable alternative to owning a car, deepening transport inequality.",
        "targetWord": "shared travel systems",
        "options": [
          {
            "id": "A",
            "text": "public transport",
            "isCorrect": true,
            "feedback": "Correct! Public transport is the formal term for shared travel systems available to the general public, including buses, trains, and trams."
          },
          {
            "id": "B",
            "text": "private vehicles",
            "isCorrect": false,
            "feedback": "Incorrect. Private vehicles are individually owned cars — not shared systems available to the public."
          },
          {
            "id": "C",
            "text": "transport hubs",
            "isCorrect": false,
            "feedback": "Not quite. Transport hubs are locations where modes converge — not the transport systems themselves."
          },
          {
            "id": "D",
            "text": "road networks",
            "isCorrect": false,
            "feedback": "Incorrect. Road networks are the physical infrastructure of roads — not the shared travel systems that operate on them."
          }
        ]
      },

      // ─── 3. MASS TRANSIT ─────────────────────────────────────────────
      {
        "id": 5,
        "sentence": "Tokyo's large-scale high-capacity urban transport system carries over eight million passengers on the Metro alone every weekday.",
        "targetWord": "large-scale high-capacity urban transport system",
        "options": [
          {
            "id": "A",
            "text": "road network",
            "isCorrect": false,
            "feedback": "Incorrect. A road network is the physical system of roads — not a passenger-carrying public transport system."
          },
          {
            "id": "B",
            "text": "mass transit",
            "isCorrect": true,
            "feedback": "Correct! Mass transit refers specifically to large-scale, high-capacity public transport systems designed to move very large numbers of people efficiently."
          },
          {
            "id": "C",
            "text": "bus rapid transit",
            "isCorrect": false,
            "feedback": "Not quite. Bus rapid transit is one specific type of high-capacity system — mass transit is the broader umbrella term."
          },
          {
            "id": "D",
            "text": "active travel",
            "isCorrect": false,
            "feedback": "Incorrect. Active travel refers to walking and cycling — not motorised high-capacity systems."
          }
        ]
      },
      {
        "id": 6,
        "sentence": "Rapidly growing megacities must invest ambitiously in high-volume people-moving systems before car-centric patterns become permanently entrenched.",
        "targetWord": "high-volume people-moving systems",
        "options": [
          {
            "id": "A",
            "text": "charging infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Charging infrastructure refers to electric vehicle charging networks — not passenger transport systems."
          },
          {
            "id": "B",
            "text": "land use",
            "isCorrect": false,
            "feedback": "Incorrect. Land use refers to how land is categorised and regulated — not transport systems that move people."
          },
          {
            "id": "C",
            "text": "mass transit",
            "isCorrect": true,
            "feedback": "Correct! Mass transit is precisely the term for high-volume systems designed to move large numbers of urban passengers efficiently."
          },
          {
            "id": "D",
            "text": "transport corridor",
            "isCorrect": false,
            "feedback": "Not quite. A transport corridor is a geographic route designated for transport investment — not the transport system itself."
          }
        ]
      },

      // ─── 4. FREIGHT TRANSPORT ────────────────────────────────────────
      {
        "id": 7,
        "sentence": "The movement of goods by road, rail, and sea accounts for a significant and often underestimated share of total transport carbon emissions.",
        "targetWord": "movement of goods by road, rail, and sea",
        "options": [
          {
            "id": "A",
            "text": "active travel",
            "isCorrect": false,
            "feedback": "Incorrect. Active travel refers to walking and cycling for personal journeys — not the movement of goods."
          },
          {
            "id": "B",
            "text": "mass transit",
            "isCorrect": false,
            "feedback": "Incorrect. Mass transit moves passengers at scale — not goods and cargo."
          },
          {
            "id": "C",
            "text": "freight transport",
            "isCorrect": true,
            "feedback": "Correct! Freight transport is the precise term for the movement of goods and cargo by road, rail, sea, or air."
          },
          {
            "id": "D",
            "text": "public transport",
            "isCorrect": false,
            "feedback": "Incorrect. Public transport carries passengers — not goods and cargo."
          }
        ]
      },
      {
        "id": 8,
        "sentence": "The explosion of online shopping has created a last-mile cargo delivery crisis, with thousands of vans making individual drop-offs in dense urban areas every day.",
        "targetWord": "last-mile cargo delivery",
        "options": [
          {
            "id": "A",
            "text": "last-mile freight transport",
            "isCorrect": true,
            "feedback": "Correct! Last-mile freight transport is the precise term for the final stage of delivering goods to their destination — exactly what is described here."
          },
          {
            "id": "B",
            "text": "last-mile public transport",
            "isCorrect": false,
            "feedback": "Incorrect. Public transport carries passengers — not packages and goods being delivered."
          },
          {
            "id": "C",
            "text": "last-mile active travel",
            "isCorrect": false,
            "feedback": "Not quite. Active travel refers to walking and cycling for personal journeys — not the delivery of goods."
          },
          {
            "id": "D",
            "text": "last-mile mass transit",
            "isCorrect": false,
            "feedback": "Incorrect. Mass transit moves large volumes of passengers — not individual cargo deliveries."
          }
        ]
      },

      // ─── 5. ACTIVE TRAVEL ────────────────────────────────────────────
      {
        "id": 9,
        "sentence": "Investment in walking and cycling infrastructure delivers environmental, health, and economic benefits simultaneously through a single category of spending.",
        "targetWord": "walking and cycling infrastructure",
        "options": [
          {
            "id": "A",
            "text": "mass transit infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Mass transit infrastructure refers to railways and metro systems — not facilities for walking and cycling."
          },
          {
            "id": "B",
            "text": "active travel infrastructure",
            "isCorrect": true,
            "feedback": "Correct! Active travel is the formal policy term for human-powered transport modes, primarily walking and cycling."
          },
          {
            "id": "C",
            "text": "freight transport infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Freight infrastructure relates to moving goods — not walking and cycling."
          },
          {
            "id": "D",
            "text": "charging infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Charging infrastructure relates to electric vehicles — not human-powered transport."
          }
        ]
      },
      {
        "id": 10,
        "sentence": "Cities that promote human-powered modes of getting around report measurable improvements in population health and reductions in short car journeys.",
        "targetWord": "human-powered modes of getting around",
        "options": [
          {
            "id": "A",
            "text": "autonomous travel",
            "isCorrect": false,
            "feedback": "Incorrect. Autonomous travel refers to self-driving vehicles — the opposite of human-powered movement."
          },
          {
            "id": "B",
            "text": "public transport",
            "isCorrect": false,
            "feedback": "Not quite. Public transport is motorised and shared — it does not involve physical activity by the traveller."
          },
          {
            "id": "C",
            "text": "active travel",
            "isCorrect": true,
            "feedback": "Correct! Active travel is the academic and policy term for modes of transport that involve physical activity — primarily walking and cycling."
          },
          {
            "id": "D",
            "text": "light rail",
            "isCorrect": false,
            "feedback": "Incorrect. Light rail is a motorised tram system — not a human-powered mode of transport."
          }
        ]
      },

      // ─── 6. HIGH-SPEED RAIL ──────────────────────────────────────────
      {
        "id": 11,
        "sentence": "Fast intercity train travel is the most credible large-scale alternative to short-haul flying, connecting cities with journey times competitive with aviation.",
        "targetWord": "fast intercity train travel",
        "options": [
          {
            "id": "A",
            "text": "bus rapid transit",
            "isCorrect": false,
            "feedback": "Incorrect. Bus rapid transit operates within cities — not between them at speeds competitive with aviation."
          },
          {
            "id": "B",
            "text": "light rail",
            "isCorrect": false,
            "feedback": "Not quite. Light rail operates at low speeds within urban areas — not between cities at high speed."
          },
          {
            "id": "C",
            "text": "high-speed rail",
            "isCorrect": true,
            "feedback": "Correct! High-speed rail is the precise term for intercity rail systems operating above 200 km/h — fast enough to compete with short-haul aviation."
          },
          {
            "id": "D",
            "text": "mass transit",
            "isCorrect": false,
            "feedback": "Incorrect. Mass transit is the broader term for high-capacity urban systems — high-speed rail is the specific term for fast intercity connections."
          }
        ]
      },
      {
        "id": 12,
        "sentence": "When France opened its rapid long-distance rail network between Paris and Lyon, the domestic airline on that route lost the majority of its passengers within a few years.",
        "targetWord": "rapid long-distance rail network",
        "options": [
          {
            "id": "A",
            "text": "urban motorway",
            "isCorrect": false,
            "feedback": "Incorrect. Urban motorways are road infrastructure within cities — not long-distance rail connections."
          },
          {
            "id": "B",
            "text": "high-speed rail",
            "isCorrect": true,
            "feedback": "Correct! High-speed rail is the term for rapid long-distance rail services — the TGV between Paris and Lyon is one of the world's most famous examples."
          },
          {
            "id": "C",
            "text": "transport corridor",
            "isCorrect": false,
            "feedback": "Not quite. A transport corridor is a geographic zone designated for transport investment — not the rail service itself."
          },
          {
            "id": "D",
            "text": "bus rapid transit",
            "isCorrect": false,
            "feedback": "Incorrect. Bus rapid transit operates within cities — not between cities at speeds that compete with aviation."
          }
        ]
      },

      // ─── 7. LIGHT RAIL / TRAM ────────────────────────────────────────
      {
        "id": 13,
        "sentence": "Manchester's street-level electric rail system has grown from a modest network in 1992 to nearly 100 stops, measurably reducing car use on parallel routes.",
        "targetWord": "street-level electric rail system",
        "options": [
          {
            "id": "A",
            "text": "high-speed rail",
            "isCorrect": false,
            "feedback": "Incorrect. High-speed rail connects cities at very high speeds — not street-level urban tram systems."
          },
          {
            "id": "B",
            "text": "bus rapid transit",
            "isCorrect": false,
            "feedback": "Not quite. Bus rapid transit uses buses on dedicated lanes — not rail vehicles running on street-level tracks."
          },
          {
            "id": "C",
            "text": "light rail",
            "isCorrect": true,
            "feedback": "Correct! Light rail — also called a tram — is an urban rail system operating at lower speeds on street level, exactly as described here."
          },
          {
            "id": "D",
            "text": "mass transit",
            "isCorrect": false,
            "feedback": "Incorrect. Mass transit is the broader term — light rail is the specific term for the street-level system described."
          }
        ]
      },
      {
        "id": 14,
        "sentence": "Urban tram networks occupy a valuable middle position between standard buses and expensive underground metros, offering higher capacity at lower capital cost.",
        "targetWord": "urban tram networks",
        "options": [
          {
            "id": "A",
            "text": "freight transport networks",
            "isCorrect": false,
            "feedback": "Incorrect. Freight networks move goods — not urban passengers on tram-style systems."
          },
          {
            "id": "B",
            "text": "autonomous vehicle networks",
            "isCorrect": false,
            "feedback": "Incorrect. Autonomous vehicle networks refer to self-driving cars — not fixed-route tram systems."
          },
          {
            "id": "C",
            "text": "light rail networks",
            "isCorrect": true,
            "feedback": "Correct! Light rail and tram are interchangeable terms for urban rail systems running partly or entirely at street level — exactly what is described here."
          },
          {
            "id": "D",
            "text": "transport corridor networks",
            "isCorrect": false,
            "feedback": "Not quite. A transport corridor is a geographic planning zone — not the specific tram system described."
          }
        ]
      },

      // ─── 8. BUS RAPID TRANSIT ────────────────────────────────────────
      {
        "id": 15,
        "sentence": "Bogotá's high-frequency bus system on dedicated lanes halved journey times on major corridors at a fraction of the cost of an underground metro.",
        "targetWord": "high-frequency bus system on dedicated lanes",
        "options": [
          {
            "id": "A",
            "text": "light rail",
            "isCorrect": false,
            "feedback": "Incorrect. Light rail uses fixed rail tracks — not buses on dedicated road lanes."
          },
          {
            "id": "B",
            "text": "bus rapid transit",
            "isCorrect": true,
            "feedback": "Correct! Bus rapid transit is precisely a high-capacity bus system operating on dedicated lanes with metro-like frequency and performance."
          },
          {
            "id": "C",
            "text": "mass transit",
            "isCorrect": false,
            "feedback": "Not quite. Mass transit is the broader umbrella term — bus rapid transit is the specific system described here."
          },
          {
            "id": "D",
            "text": "active travel",
            "isCorrect": false,
            "feedback": "Incorrect. Active travel refers to walking and cycling — not motorised bus systems on dedicated lanes."
          }
        ]
      },
      {
        "id": 16,
        "sentence": "For rapidly urbanising developing cities, a metro-performing bus network on exclusive road corridors offers a scalable and affordable solution to growing mobility demand.",
        "targetWord": "metro-performing bus network on exclusive road corridors",
        "options": [
          {
            "id": "A",
            "text": "high-speed rail",
            "isCorrect": false,
            "feedback": "Incorrect. High-speed rail connects cities at very high speeds — not urban bus systems on exclusive road lanes."
          },
          {
            "id": "B",
            "text": "urban motorway",
            "isCorrect": false,
            "feedback": "Incorrect. Urban motorways are road infrastructure for private vehicles — not exclusive bus transit systems."
          },
          {
            "id": "C",
            "text": "transport hub",
            "isCorrect": false,
            "feedback": "Not quite. A transport hub is a location where modes converge — not the bus transit system itself."
          },
          {
            "id": "D",
            "text": "bus rapid transit",
            "isCorrect": true,
            "feedback": "Correct! Bus rapid transit is specifically designed to deliver metro-like performance using buses on dedicated corridors — at a fraction of the cost of underground construction."
          }
        ]
      },

      // ─── 9. ELECTRIC VEHICLE ─────────────────────────────────────────
      {
        "id": 17,
        "sentence": "Norway's success in promoting battery-powered cars rested on a simple principle: make them the financially rational choice through tax exemptions and free parking.",
        "targetWord": "battery-powered cars",
        "options": [
          {
            "id": "A",
            "text": "autonomous vehicles",
            "isCorrect": false,
            "feedback": "Not quite. Autonomous vehicles are self-driving — the sentence is about the power source, not the level of automation."
          },
          {
            "id": "B",
            "text": "private vehicles",
            "isCorrect": false,
            "feedback": "Incorrect. Private vehicles is a broader term covering all personally owned vehicles, not specifically battery-powered ones."
          },
          {
            "id": "C",
            "text": "electric vehicles",
            "isCorrect": true,
            "feedback": "Correct! Electric vehicles are powered by rechargeable batteries — precisely the battery-powered cars described in Norway's adoption strategy."
          },
          {
            "id": "D",
            "text": "freight vehicles",
            "isCorrect": false,
            "feedback": "Incorrect. Freight vehicles carry goods — the sentence is about personal passenger cars."
          }
        ]
      },
      {
        "id": 18,
        "sentence": "While zero-emission cars are essential for decarbonisation, they address exhaust pollution without solving congestion, car dependency, or transport inequality.",
        "targetWord": "zero-emission cars",
        "options": [
          {
            "id": "A",
            "text": "autonomous vehicles",
            "isCorrect": false,
            "feedback": "Incorrect. Autonomous vehicles are self-driving — they may still run on fossil fuels and are not specifically zero-emission."
          },
          {
            "id": "B",
            "text": "electric vehicles",
            "isCorrect": true,
            "feedback": "Correct! Electric vehicles produce no direct exhaust emissions at the point of use — making them the zero-emission cars referred to here."
          },
          {
            "id": "C",
            "text": "light rail vehicles",
            "isCorrect": false,
            "feedback": "Incorrect. Light rail vehicles are trams — a form of public transport, not privately owned zero-emission cars."
          },
          {
            "id": "D",
            "text": "mass transit vehicles",
            "isCorrect": false,
            "feedback": "Incorrect. Mass transit vehicles are shared public transport — not the individually owned zero-emission cars described."
          }
        ]
      },

      // ─── 10. AUTONOMOUS VEHICLE ──────────────────────────────────────
      {
        "id": 19,
        "sentence": "Self-driving cars raise profound questions about legal liability when algorithmic decisions cause harm on public roads.",
        "targetWord": "self-driving cars",
        "options": [
          {
            "id": "A",
            "text": "electric vehicles",
            "isCorrect": false,
            "feedback": "Incorrect. Electric vehicles are defined by their power source — not by their ability to drive themselves."
          },
          {
            "id": "B",
            "text": "freight vehicles",
            "isCorrect": false,
            "feedback": "Incorrect. Freight vehicles carry goods — the sentence is about passenger cars that drive themselves."
          },
          {
            "id": "C",
            "text": "autonomous vehicles",
            "isCorrect": true,
            "feedback": "Correct! Autonomous vehicles are self-driving vehicles that use AI to navigate without direct human control — precisely what is described."
          },
          {
            "id": "D",
            "text": "private vehicles",
            "isCorrect": false,
            "feedback": "Not quite. Private vehicles is the broad term for personally owned cars — autonomous is the specific term for self-driving capability."
          }
        ]
      },
      {
        "id": 20,
        "sentence": "The widespread adoption of AI-navigated cars could displace millions of professional drivers, representing one of the most significant labour market disruptions in history.",
        "targetWord": "AI-navigated cars",
        "options": [
          {
            "id": "A",
            "text": "electric vehicles",
            "isCorrect": false,
            "feedback": "Incorrect. Electric vehicles are defined by battery power — not by artificial intelligence navigation."
          },
          {
            "id": "B",
            "text": "autonomous vehicles",
            "isCorrect": true,
            "feedback": "Correct! Autonomous vehicles use artificial intelligence to navigate — the AI-navigated cars described here that would displace human drivers."
          },
          {
            "id": "C",
            "text": "bus rapid transit",
            "isCorrect": false,
            "feedback": "Incorrect. Bus rapid transit is a form of public transport — not AI-navigated private vehicles."
          },
          {
            "id": "D",
            "text": "mass transit",
            "isCorrect": false,
            "feedback": "Incorrect. Mass transit refers to large-scale shared systems — not individually operated AI-navigated cars."
          }
        ]
      },

      // ─── 11. CYCLING INFRASTRUCTURE ─────────────────────────────────
      {
        "id": 21,
        "sentence": "The Netherlands built a nation of cyclists not through culture but through dedicated lanes, secure parking, and safe road crossings that made cycling feel natural for everyone.",
        "targetWord": "dedicated lanes, secure parking, and safe road crossings",
        "options": [
          {
            "id": "A",
            "text": "transport hubs",
            "isCorrect": false,
            "feedback": "Incorrect. Transport hubs are locations where multiple modes converge — not the physical facilities that enable cycling."
          },
          {
            "id": "B",
            "text": "charging infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Charging infrastructure refers to electric vehicle charging points — not cycling facilities."
          },
          {
            "id": "C",
            "text": "cycling infrastructure",
            "isCorrect": true,
            "feedback": "Correct! Cycling infrastructure is the collective term for all physical facilities — lanes, parking, crossings — that enable and encourage cycling."
          },
          {
            "id": "D",
            "text": "active travel policy",
            "isCorrect": false,
            "feedback": "Not quite. Active travel policy refers to the broader policy framework — cycling infrastructure refers specifically to the physical facilities."
          }
        ]
      },
      {
        "id": 22,
        "sentence": "Cities that build high-quality, physically separated bike lanes see cycling rates rise dramatically, demonstrating that safety facilities create their own demand.",
        "targetWord": "physically separated bike lanes",
        "options": [
          {
            "id": "A",
            "text": "pedestrian zones",
            "isCorrect": false,
            "feedback": "Incorrect. Pedestrian zones exclude motor vehicles from areas — they are not specifically bike lanes for cyclists."
          },
          {
            "id": "B",
            "text": "transport corridors",
            "isCorrect": false,
            "feedback": "Incorrect. Transport corridors are geographic planning zones — not specifically the physical bike lanes described."
          },
          {
            "id": "C",
            "text": "segregated cycling infrastructure",
            "isCorrect": true,
            "feedback": "Correct! Segregated cycling infrastructure — physically separated bike lanes — is precisely the facility described, and the most effective type of cycling provision."
          },
          {
            "id": "D",
            "text": "road capacity",
            "isCorrect": false,
            "feedback": "Incorrect. Road capacity refers to how many vehicles a road can carry — not bike-specific physical infrastructure."
          }
        ]
      },

      // ─── 12. TRANSPORT NETWORK ───────────────────────────────────────
      {
        "id": 23,
        "sentence": "Singapore's interconnected system of trains, buses, cycling paths, and ferries allows passengers to travel seamlessly from any point to any other in the city.",
        "targetWord": "interconnected system of trains, buses, cycling paths, and ferries",
        "options": [
          {
            "id": "A",
            "text": "urban motorway",
            "isCorrect": false,
            "feedback": "Incorrect. An urban motorway is a single road infrastructure — not a system connecting multiple modes."
          },
          {
            "id": "B",
            "text": "transport network",
            "isCorrect": true,
            "feedback": "Correct! A transport network is the complete, interconnected system of routes, vehicles, and services that together enable movement — exactly as described."
          },
          {
            "id": "C",
            "text": "road network",
            "isCorrect": false,
            "feedback": "Not quite. A road network refers specifically to roads and motorways — not a multi-modal system including trains and ferries."
          },
          {
            "id": "D",
            "text": "transport hub",
            "isCorrect": false,
            "feedback": "Incorrect. A transport hub is a single location where modes converge — not the entire interconnected system."
          }
        ]
      },
      {
        "id": 24,
        "sentence": "Gaps in the city's overall mobility system leave outer suburban communities without any connection to employment centres or essential services.",
        "targetWord": "overall mobility system",
        "options": [
          {
            "id": "A",
            "text": "transport network",
            "isCorrect": true,
            "feedback": "Correct! A transport network is the complete system of routes, services, and infrastructure that together enable mobility — gaps in it leave communities disconnected."
          },
          {
            "id": "B",
            "text": "land use",
            "isCorrect": false,
            "feedback": "Incorrect. Land use refers to how land is categorised — not the mobility system connecting communities."
          },
          {
            "id": "C",
            "text": "road capacity",
            "isCorrect": false,
            "feedback": "Incorrect. Road capacity is about how many vehicles roads can carry — not the broader mobility system."
          },
          {
            "id": "D",
            "text": "urban planning",
            "isCorrect": false,
            "feedback": "Not quite. Urban planning is the discipline that shapes cities — the transport network is the specific system described here."
          }
        ]
      },

      // ─── 13. ROAD NETWORK ────────────────────────────────────────────
      {
        "id": 25,
        "sentence": "Houston's extensive system of motorways and highways is one of the most comprehensive in the world — and yet the city also has some of America's worst traffic congestion.",
        "targetWord": "system of motorways and highways",
        "options": [
          {
            "id": "A",
            "text": "mass transit system",
            "isCorrect": false,
            "feedback": "Incorrect. A mass transit system carries passengers on trains and buses — not a system of motorways and highways."
          },
          {
            "id": "B",
            "text": "transport network",
            "isCorrect": false,
            "feedback": "Not quite. Transport network is the broader term covering all modes — road network specifically refers to the system of roads described."
          },
          {
            "id": "C",
            "text": "road network",
            "isCorrect": true,
            "feedback": "Correct! A road network is the system of roads, motorways, and highways — precisely what Houston has built so extensively."
          },
          {
            "id": "D",
            "text": "cycling infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Cycling infrastructure refers to bike lanes and paths — not motorways and highways."
          }
        ]
      },
      {
        "id": 26,
        "sentence": "Expanding the web of roads and motorways in response to congestion reflects a fundamental misunderstanding of how additional capacity generates additional demand.",
        "targetWord": "web of roads and motorways",
        "options": [
          {
            "id": "A",
            "text": "road network",
            "isCorrect": true,
            "feedback": "Correct! A road network is the web of roads, motorways, and streets forming the physical infrastructure for vehicle travel — exactly what is described."
          },
          {
            "id": "B",
            "text": "transport corridor",
            "isCorrect": false,
            "feedback": "Not quite. A transport corridor is a specific route designated for investment — not the entire web of roads."
          },
          {
            "id": "C",
            "text": "pedestrian zone",
            "isCorrect": false,
            "feedback": "Incorrect. Pedestrian zones exclude vehicles — the opposite of a road network built for them."
          },
          {
            "id": "D",
            "text": "charging infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Charging infrastructure refers to EV charging points — not the road system itself."
          }
        ]
      },

      // ─── 14. URBAN MOTORWAY ──────────────────────────────────────────
      {
        "id": 27,
        "sentence": "San Francisco demolished its earthquake-damaged elevated city highway, and the traffic it had carried largely disappeared rather than relocating to other routes.",
        "targetWord": "elevated city highway",
        "options": [
          {
            "id": "A",
            "text": "transport hub",
            "isCorrect": false,
            "feedback": "Incorrect. A transport hub is a location where modes converge — not an elevated road built for vehicle traffic."
          },
          {
            "id": "B",
            "text": "transport corridor",
            "isCorrect": false,
            "feedback": "Not quite. A transport corridor is a planning zone — not the specific physical elevated road described."
          },
          {
            "id": "C",
            "text": "road network",
            "isCorrect": false,
            "feedback": "Incorrect. Road network refers to the entire system of roads — urban motorway is the specific term for a high-capacity road built through a city."
          },
          {
            "id": "D",
            "text": "urban motorway",
            "isCorrect": true,
            "feedback": "Correct! An urban motorway is a high-capacity road built through or around a city — the Embarcadero Freeway in San Francisco is a famous example."
          }
        ]
      },
      {
        "id": 28,
        "sentence": "High-speed roads driven through city neighbourhoods have caused community severance, cutting communities off from each other for decades.",
        "targetWord": "high-speed roads driven through city neighbourhoods",
        "options": [
          {
            "id": "A",
            "text": "pedestrian zones",
            "isCorrect": false,
            "feedback": "Incorrect. Pedestrian zones exclude vehicles — the opposite of high-speed roads cutting through neighbourhoods."
          },
          {
            "id": "B",
            "text": "urban motorways",
            "isCorrect": true,
            "feedback": "Correct! Urban motorways are high-capacity, high-speed roads built through urban areas — and community severance is one of their most damaging consequences."
          },
          {
            "id": "C",
            "text": "light rail corridors",
            "isCorrect": false,
            "feedback": "Incorrect. Light rail corridors are tram routes — not high-speed roads causing community division."
          },
          {
            "id": "D",
            "text": "bus rapid transit lanes",
            "isCorrect": false,
            "feedback": "Incorrect. BRT lanes are dedicated bus lanes — not the high-speed roads through neighbourhoods described here."
          }
        ]
      },

      // ─── 15. PEDESTRIAN ZONE ─────────────────────────────────────────
      {
        "id": 29,
        "sentence": "When New York restricted vehicles from Times Square, retail sales increased by 71% and pedestrian injuries fell by 40% in the first year alone.",
        "targetWord": "restricted vehicles from Times Square",
        "options": [
          {
            "id": "A",
            "text": "created a transport hub in Times Square",
            "isCorrect": false,
            "feedback": "Incorrect. A transport hub is where modes converge — not an area from which vehicles are excluded."
          },
          {
            "id": "B",
            "text": "built a road network through Times Square",
            "isCorrect": false,
            "feedback": "Incorrect. Building a road network would increase vehicle access — the opposite of what happened."
          },
          {
            "id": "C",
            "text": "created a pedestrian zone in Times Square",
            "isCorrect": true,
            "feedback": "Correct! A pedestrian zone is an area from which motor vehicles are excluded or restricted — exactly what was created in Times Square."
          },
          {
            "id": "D",
            "text": "introduced a congestion charge in Times Square",
            "isCorrect": false,
            "feedback": "Not quite. A congestion charge deters vehicles through pricing — a pedestrian zone physically excludes them."
          }
        ]
      },
      {
        "id": 30,
        "sentence": "Car-free areas in city centres consistently attract more visitors, encourage longer dwell times, and create more vibrant public spaces than vehicle-dominated streets.",
        "targetWord": "car-free areas in city centres",
        "options": [
          {
            "id": "A",
            "text": "transport corridors",
            "isCorrect": false,
            "feedback": "Incorrect. Transport corridors are routes designated for transport investment — not car-free public spaces."
          },
          {
            "id": "B",
            "text": "pedestrian zones",
            "isCorrect": true,
            "feedback": "Correct! Pedestrian zones are car-free areas where motor vehicles are excluded, giving priority to people on foot — exactly what is described."
          },
          {
            "id": "C",
            "text": "urban motorways",
            "isCorrect": false,
            "feedback": "Incorrect. Urban motorways are built for vehicle traffic — the complete opposite of car-free pedestrian spaces."
          },
          {
            "id": "D",
            "text": "cycling infrastructure",
            "isCorrect": false,
            "feedback": "Not quite. Cycling infrastructure provides facilities for cyclists — pedestrian zones are specifically for people on foot."
          }
        ]
      },

      // ─── 16. TRANSPORT HUB ───────────────────────────────────────────
      {
        "id": 31,
        "sentence": "Amsterdam Centraal allows passengers to transfer between intercity trains, the metro, trams, ferries, and bicycle parking within a single location.",
        "targetWord": "single location where passengers can transfer between multiple modes",
        "options": [
          {
            "id": "A",
            "text": "transport corridor",
            "isCorrect": false,
            "feedback": "Incorrect. A transport corridor is a geographic route — not a specific location where passengers transfer between modes."
          },
          {
            "id": "B",
            "text": "pedestrian zone",
            "isCorrect": false,
            "feedback": "Incorrect. A pedestrian zone is a car-free area — not a location specifically designed for multi-modal transfers."
          },
          {
            "id": "C",
            "text": "transport hub",
            "isCorrect": true,
            "feedback": "Correct! A transport hub is precisely a central location where multiple transport modes converge, enabling passengers to transfer efficiently between them."
          },
          {
            "id": "D",
            "text": "road network",
            "isCorrect": false,
            "feedback": "Incorrect. A road network is the system of roads — not a specific location for multi-modal passenger transfers."
          }
        ]
      },
      {
        "id": 32,
        "sentence": "Concentrating residential and commercial development around major interchange points maximises public transport use and reduces car dependency.",
        "targetWord": "major interchange points",
        "options": [
          {
            "id": "A",
            "text": "urban motorways",
            "isCorrect": false,
            "feedback": "Incorrect. Urban motorways are high-speed roads — not interchange points designed for passenger transfers between modes."
          },
          {
            "id": "B",
            "text": "transport hubs",
            "isCorrect": true,
            "feedback": "Correct! Transport hubs are the major interchange points where multiple modes converge — concentrating development around them is the principle of transit-oriented development."
          },
          {
            "id": "C",
            "text": "charging infrastructure points",
            "isCorrect": false,
            "feedback": "Incorrect. Charging infrastructure points are for EV charging — not multi-modal passenger interchange locations."
          },
          {
            "id": "D",
            "text": "pedestrian zones",
            "isCorrect": false,
            "feedback": "Not quite. Pedestrian zones are car-free areas — not specifically the interchange points where transport modes converge."
          }
        ]
      },

      // ─── 17. ROAD CAPACITY ───────────────────────────────────────────
      {
        "id": 33,
        "sentence": "Increasing the maximum number of vehicles a road can carry rarely solves congestion because new journeys rapidly fill the additional space.",
        "targetWord": "maximum number of vehicles a road can carry",
        "options": [
          {
            "id": "A",
            "text": "road network",
            "isCorrect": false,
            "feedback": "Incorrect. Road network refers to the entire system of roads — road capacity is the specific term for how many vehicles a road can handle."
          },
          {
            "id": "B",
            "text": "transport corridor",
            "isCorrect": false,
            "feedback": "Incorrect. A transport corridor is a geographic planning zone — not a measurement of how many vehicles a road can carry."
          },
          {
            "id": "C",
            "text": "road capacity",
            "isCorrect": true,
            "feedback": "Correct! Road capacity is precisely the term for the maximum number of vehicles a road can accommodate within a given time period."
          },
          {
            "id": "D",
            "text": "urban planning",
            "isCorrect": false,
            "feedback": "Incorrect. Urban planning is the discipline of designing cities — not the measurement of how many vehicles a road can carry."
          }
        ]
      },
      {
        "id": 34,
        "sentence": "The M25 was widened at enormous cost, yet its vehicle-carrying ability was exceeded again within years as new journeys were generated by the additional space.",
        "targetWord": "vehicle-carrying ability",
        "options": [
          {
            "id": "A",
            "text": "road capacity",
            "isCorrect": true,
            "feedback": "Correct! Road capacity is the technical term for the vehicle-carrying ability of a road — the M25 is a famous example of induced demand exhausting new capacity."
          },
          {
            "id": "B",
            "text": "road network",
            "isCorrect": false,
            "feedback": "Not quite. Road network refers to the entire system of roads — capacity is the specific measurement of how many vehicles a single road can handle."
          },
          {
            "id": "C",
            "text": "transport resilience",
            "isCorrect": false,
            "feedback": "Incorrect. Transport resilience refers to a system's ability to withstand disruption — not how many vehicles a road can carry."
          },
          {
            "id": "D",
            "text": "land use",
            "isCorrect": false,
            "feedback": "Incorrect. Land use refers to how land is categorised — not the vehicle-carrying ability of roads."
          }
        ]
      },

      // ─── 18. CHARGING INFRASTRUCTURE ────────────────────────────────
      {
        "id": 35,
        "sentence": "Range anxiety persists because the network of public EV charging points remains wholly inadequate, particularly in urban areas where residents lack private off-street parking.",
        "targetWord": "network of public EV charging points",
        "options": [
          {
            "id": "A",
            "text": "cycling infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Cycling infrastructure refers to bike lanes and parking — not EV charging points."
          },
          {
            "id": "B",
            "text": "transport network",
            "isCorrect": false,
            "feedback": "Incorrect. Transport network refers to the entire interconnected mobility system — not specifically EV charging points."
          },
          {
            "id": "C",
            "text": "charging infrastructure",
            "isCorrect": true,
            "feedback": "Correct! Charging infrastructure is the term for the network of electric vehicle charging points and stations — exactly what is described here."
          },
          {
            "id": "D",
            "text": "road capacity",
            "isCorrect": false,
            "feedback": "Incorrect. Road capacity refers to how many vehicles roads can carry — not the network of EV charging facilities."
          }
        ]
      },
      {
        "id": 36,
        "sentence": "The EV transition cannot reach the pace required by climate targets without a parallel rollout of publicly accessible battery-replenishment facilities across the country.",
        "targetWord": "publicly accessible battery-replenishment facilities",
        "options": [
          {
            "id": "A",
            "text": "freight transport terminals",
            "isCorrect": false,
            "feedback": "Incorrect. Freight terminals are for loading and unloading goods — not for replenishing electric vehicle batteries."
          },
          {
            "id": "B",
            "text": "transport hubs",
            "isCorrect": false,
            "feedback": "Incorrect. Transport hubs are where modes converge for passenger transfers — not specifically battery-replenishment facilities."
          },
          {
            "id": "C",
            "text": "charging infrastructure",
            "isCorrect": true,
            "feedback": "Correct! Charging infrastructure is precisely the network of publicly accessible facilities for replenishing electric vehicle batteries — essential for the EV transition."
          },
          {
            "id": "D",
            "text": "active travel infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Active travel infrastructure refers to cycling and walking facilities — not EV battery-replenishment facilities."
          }
        ]
      },

      // ─── 19. URBAN PLANNING ──────────────────────────────────────────
      {
        "id": 37,
        "sentence": "Phoenix and Amsterdam cover similar land areas but have entirely different mobility cultures — the result of decades of different decisions about how to design and manage their cities.",
        "targetWord": "decisions about how to design and manage their cities",
        "options": [
          {
            "id": "A",
            "text": "road capacity decisions",
            "isCorrect": false,
            "feedback": "Not quite. Road capacity decisions are one element — urban planning is the broader discipline covering all decisions about city design and management."
          },
          {
            "id": "B",
            "text": "land use decisions",
            "isCorrect": false,
            "feedback": "Not quite. Land use is one component of urban planning — the sentence refers to the broader discipline of city design and management."
          },
          {
            "id": "C",
            "text": "urban planning decisions",
            "isCorrect": true,
            "feedback": "Correct! Urban planning is the professional discipline concerned with designing and managing urban areas — the different outcomes in Phoenix and Amsterdam reflect different planning philosophies."
          },
          {
            "id": "D",
            "text": "transport corridor decisions",
            "isCorrect": false,
            "feedback": "Incorrect. Transport corridors are a specific planning tool — urban planning is the broader discipline that encompasses all city design decisions."
          }
        ]
      },
      {
        "id": 38,
        "sentence": "Transport problems are, at their deepest level, problems of city design — the spatial organisation of urban areas determines mobility patterns more powerfully than any individual transport policy.",
        "targetWord": "problems of city design",
        "options": [
          {
            "id": "A",
            "text": "problems of road capacity",
            "isCorrect": false,
            "feedback": "Incorrect. Road capacity is one element — the sentence refers to the broader discipline of how cities are spatially organised and designed."
          },
          {
            "id": "B",
            "text": "problems of charging infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Charging infrastructure is specific to EVs — the sentence refers to the entire spatial organisation of cities."
          },
          {
            "id": "C",
            "text": "problems of urban planning",
            "isCorrect": true,
            "feedback": "Correct! Urban planning is the discipline concerned with city design and spatial organisation — and transport problems are fundamentally urban planning problems."
          },
          {
            "id": "D",
            "text": "problems of transport hubs",
            "isCorrect": false,
            "feedback": "Incorrect. Transport hubs are specific interchange locations — not the broader discipline of city design described here."
          }
        ]
      },

      // ─── 20. LAND USE ────────────────────────────────────────────────
      {
        "id": 39,
        "sentence": "American zoning laws that separate homes, offices, shops, and restaurants into different zones miles apart make car dependency structurally inevitable.",
        "targetWord": "how land is categorised and separated into different zones",
        "options": [
          {
            "id": "A",
            "text": "road capacity",
            "isCorrect": false,
            "feedback": "Incorrect. Road capacity is about how many vehicles roads can carry — not how land is categorised into different zones."
          },
          {
            "id": "B",
            "text": "land use",
            "isCorrect": true,
            "feedback": "Correct! Land use refers to how land is categorised and regulated — including zoning decisions that separate homes, shops, and offices, creating car dependency."
          },
          {
            "id": "C",
            "text": "transport network",
            "isCorrect": false,
            "feedback": "Incorrect. Transport network refers to the mobility system — not the regulatory categorisation of land into different zones."
          },
          {
            "id": "D",
            "text": "urban motorway",
            "isCorrect": false,
            "feedback": "Incorrect. Urban motorways are roads — not the zoning regulations that determine how land is used."
          }
        ]
      },
      {
        "id": 40,
        "sentence": "Mixed-use development — where homes, shops, and workplaces coexist in the same area — dramatically reduces the distances people need to travel and makes walking viable.",
        "targetWord": "mixed-use development",
        "options": [
          {
            "id": "A",
            "text": "mixed transport network",
            "isCorrect": false,
            "feedback": "Incorrect. A mixed transport network refers to multiple modes — not the mixing of different land uses in the same area."
          },
          {
            "id": "B",
            "text": "mixed land use",
            "isCorrect": true,
            "feedback": "Correct! Mixed land use is the planning term for developing areas where homes, shops, and workplaces coexist — reducing travel distances and enabling active travel."
          },
          {
            "id": "C",
            "text": "mixed road capacity",
            "isCorrect": false,
            "feedback": "Incorrect. Road capacity refers to how many vehicles roads can carry — not how different types of development are mixed in an area."
          },
          {
            "id": "D",
            "text": "mixed charging infrastructure",
            "isCorrect": false,
            "feedback": "Incorrect. Charging infrastructure relates to EV charging — not the mixing of different land uses in a neighbourhood."
          }
        ]
      },

      // ─── 21. TRANSPORT CORRIDOR ──────────────────────────────────────
      {
        "id": 41,
        "sentence": "London's Jubilee Line Extension transformed deprived neighbourhoods along its route into vibrant, economically active communities — proving that transport investment shapes development.",
        "targetWord": "along its route",
        "options": [
          {
            "id": "A",
            "text": "along its road network",
            "isCorrect": false,
            "feedback": "Incorrect. The Jubilee Line is a railway — not a road network — and the concept described is about a defined route of transport investment."
          },
          {
            "id": "B",
            "text": "along its transport corridor",
            "isCorrect": true,
            "feedback": "Correct! A transport corridor is a defined geographic route along which significant transport investment is concentrated — the Jubilee Line Extension is a classic example."
          },
          {
            "id": "C",
            "text": "along its pedestrian zone",
            "isCorrect": false,
            "feedback": "Incorrect. Pedestrian zones are car-free areas — not the routes along which transport investment transforms surrounding communities."
          },
          {
            "id": "D",
            "text": "along its urban motorway",
            "isCorrect": false,
            "feedback": "Incorrect. Urban motorways are high-speed roads — not the underground railway routes that generate neighbourhood transformation."
          }
        ]
      },
      {
        "id": 42,
        "sentence": "The most effective transit-oriented development concentrates higher-density housing and commercial activity along defined routes of transport investment.",
        "targetWord": "defined routes of transport investment",
        "options": [
          {
            "id": "A",
            "text": "transport hubs",
            "isCorrect": false,
            "feedback": "Not quite. Transport hubs are specific interchange points — transport corridors are the broader routes along which investment and development are concentrated."
          },
          {
            "id": "B",
            "text": "road networks",
            "isCorrect": false,
            "feedback": "Incorrect. Road networks are the entire system of roads — transport corridors are the specific routes designated for concentrated investment and development."
          },
          {
            "id": "C",
            "text": "transport corridors",
            "isCorrect": true,
            "feedback": "Correct! Transport corridors are defined geographic routes designated for transport investment — concentrating development along them is the core principle of transit-oriented planning."
          },
          {
            "id": "D",
            "text": "charging infrastructure routes",
            "isCorrect": false,
            "feedback": "Incorrect. Charging infrastructure routes relate to EV charging — not the broader transport investment routes that shape urban development."
          }
        ]
      },

      // ─── 22. COMMUTE ─────────────────────────────────────────────────
      {
        "id": 43,
        "sentence": "Research found that the daily journey to and from work is one of the activities people enjoy least, and that eliminating it produces wellbeing gains equivalent to a 33% pay rise.",
        "targetWord": "daily journey to and from work",
        "options": [
          {
            "id": "A",
            "text": "daily freight transport",
            "isCorrect": false,
            "feedback": "Incorrect. Freight transport moves goods — not people travelling between home and work."
          },
          {
            "id": "B",
            "text": "daily active travel",
            "isCorrect": false,
            "feedback": "Not quite. Active travel is a mode of transport — commute is the specific term for the regular journey between home and work."
          },
          {
            "id": "C",
            "text": "daily commute",
            "isCorrect": true,
            "feedback": "Correct! The commute is specifically the regular journey between home and place of work — and research confirms it is one of the least enjoyable daily activities."
          },
          {
            "id": "D",
            "text": "daily transit corridor",
            "isCorrect": false,
            "feedback": "Incorrect. A transit corridor is a geographic route for investment — not the personal journey between home and work."
          }
        ]
      },
      {
        "id": 44,
        "sentence": "Cities that enable short, pleasant, active journeys between home and work are producing healthier and happier populations than those built around long car-based travel.",
        "targetWord": "journeys between home and work",
        "options": [
          {
            "id": "A",
            "text": "commutes",
            "isCorrect": true,
            "feedback": "Correct! Commutes are specifically the regular journeys between home and work — and the mode and length of commuting significantly affects population health and wellbeing."
          },
          {
            "id": "B",
            "text": "freight journeys",
            "isCorrect": false,
            "feedback": "Incorrect. Freight journeys move goods — not people travelling between home and work."
          },
          {
            "id": "C",
            "text": "modal shifts",
            "isCorrect": false,
            "feedback": "Incorrect. Modal shift describes a change in transport mode patterns — not the individual journeys between home and work."
          },
          {
            "id": "D",
            "text": "land use patterns",
            "isCorrect": false,
            "feedback": "Incorrect. Land use patterns refer to how land is categorised — not the personal journeys between home and work."
          }
        ]
      },

      // ─── 23. ALLEVIATE ───────────────────────────────────────────────
      {
        "id": 45,
        "sentence": "Investment in public transport can significantly reduce the severity of urban congestion — though it cannot eliminate it without complementary demand management measures.",
        "targetWord": "reduce the severity of",
        "options": [
          {
            "id": "A",
            "text": "exacerbate",
            "isCorrect": false,
            "feedback": "Incorrect. To exacerbate means to make worse — the opposite of reducing the severity of a problem."
          },
          {
            "id": "B",
            "text": "generate",
            "isCorrect": false,
            "feedback": "Incorrect. To generate means to produce or create — not to reduce the severity of something."
          },
          {
            "id": "C",
            "text": "alleviate",
            "isCorrect": true,
            "feedback": "Correct! To alleviate means to reduce the severity of a problem without necessarily eliminating it — exactly what public transport investment achieves with congestion."
          },
          {
            "id": "D",
            "text": "restrict",
            "isCorrect": false,
            "feedback": "Incorrect. To restrict means to limit access — not to reduce the severity of congestion."
          }
        ]
      },
      {
        "id": 46,
        "sentence": "Cycling infrastructure eases the burden on overcrowded public transport networks by offering commuters a viable alternative for short urban journeys.",
        "targetWord": "eases the burden on",
        "options": [
          {
            "id": "A",
            "text": "displaces",
            "isCorrect": false,
            "feedback": "Not quite. To displace means to shift journeys from one mode to another — alleviate specifically means to reduce the burden or severity."
          },
          {
            "id": "B",
            "text": "alleviates",
            "isCorrect": true,
            "feedback": "Correct! To alleviate means to ease or reduce the burden of something — cycling infrastructure alleviates pressure on overcrowded public transport."
          },
          {
            "id": "C",
            "text": "integrates",
            "isCorrect": false,
            "feedback": "Incorrect. To integrate means to combine elements into a unified whole — not to ease the burden of overcrowding."
          },
          {
            "id": "D",
            "text": "incentivises",
            "isCorrect": false,
            "feedback": "Incorrect. To incentivise means to encourage through reward — not to ease the burden on an overcrowded system."
          }
        ]
      },

      // ─── 24. DETER ───────────────────────────────────────────────────
      {
        "id": 47,
        "sentence": "The London Congestion Charge was designed to discourage through cost those car journeys made out of habit rather than genuine necessity.",
        "targetWord": "discourage through cost",
        "options": [
          {
            "id": "A",
            "text": "subsidise",
            "isCorrect": false,
            "feedback": "Incorrect. To subsidise means to lower prices with public money — the opposite of discouraging behaviour through cost."
          },
          {
            "id": "B",
            "text": "integrate",
            "isCorrect": false,
            "feedback": "Incorrect. To integrate means to combine elements into a whole — not to discourage behaviour through pricing."
          },
          {
            "id": "C",
            "text": "deter",
            "isCorrect": true,
            "feedback": "Correct! To deter means to discourage a behaviour through cost, inconvenience, or risk — precisely what congestion charges do."
          },
          {
            "id": "D",
            "text": "facilitate",
            "isCorrect": false,
            "feedback": "Incorrect. To facilitate means to make something easier — the opposite of discouraging it through cost."
          }
        ]
      },
      {
        "id": 48,
        "sentence": "High parking charges in city centres discourage drivers from making unnecessary journeys when viable public transport alternatives exist.",
        "targetWord": "discourage drivers from making unnecessary journeys",
        "options": [
          {
            "id": "A",
            "text": "alleviate drivers from making unnecessary journeys",
            "isCorrect": false,
            "feedback": "Incorrect. To alleviate means to reduce severity — not to discourage a specific behaviour."
          },
          {
            "id": "B",
            "text": "deter drivers from making unnecessary journeys",
            "isCorrect": true,
            "feedback": "Correct! To deter means to discourage a behaviour through cost or inconvenience — high parking charges are a classic deterrence mechanism."
          },
          {
            "id": "C",
            "text": "displace drivers from making unnecessary journeys",
            "isCorrect": false,
            "feedback": "Not quite. To displace means to shift journeys to another mode — deter specifically means to discourage the journey from happening at all."
          },
          {
            "id": "D",
            "text": "generate drivers from making unnecessary journeys",
            "isCorrect": false,
            "feedback": "Incorrect. To generate means to create or produce — the opposite of discouraging journeys."
          }
        ]
      },

      // ─── 25. INCENTIVISE ─────────────────────────────────────────────
      {
        "id": 49,
        "sentence": "Norway stacked financial rewards in favour of electric vehicles — zero purchase tax, free parking, and bus lane access — until buying a petrol car became the less rational economic choice.",
        "targetWord": "stacked financial rewards in favour of",
        "options": [
          {
            "id": "A",
            "text": "restricted",
            "isCorrect": false,
            "feedback": "Incorrect. To restrict means to limit access — not to provide financial rewards to encourage a behaviour."
          },
          {
            "id": "B",
            "text": "incentivised",
            "isCorrect": true,
            "feedback": "Correct! To incentivise means to provide positive encouragement or financial benefit to make a behaviour more attractive — exactly what Norway did for EV adoption."
          },
          {
            "id": "C",
            "text": "deterred",
            "isCorrect": false,
            "feedback": "Incorrect. To deter means to discourage through cost — the opposite of providing financial rewards."
          },
          {
            "id": "D",
            "text": "subsidised",
            "isCorrect": false,
            "feedback": "Close, but subsidise specifically means using public money to reduce prices — incentivise is the broader term for any positive encouragement including tax exemptions and access privileges."
          }
        ]
      },
      {
        "id": 50,
        "sentence": "Governments must provide positive financial encouragement for sustainable transport choices while simultaneously making car use more costly — neither approach alone is sufficient.",
        "targetWord": "provide positive financial encouragement for",
        "options": [
          {
            "id": "A",
            "text": "exacerbate",
            "isCorrect": false,
            "feedback": "Incorrect. To exacerbate means to make worse — not to provide positive encouragement for sustainable choices."
          },
          {
            "id": "B",
            "text": "restrict",
            "isCorrect": false,
            "feedback": "Incorrect. To restrict means to limit access — not to provide positive encouragement."
          },
          {
            "id": "C",
            "text": "incentivise",
            "isCorrect": true,
            "feedback": "Correct! To incentivise means to provide positive encouragement or reward to make a behaviour more attractive — exactly what is described here for sustainable transport."
          },
          {
            "id": "D",
            "text": "displace",
            "isCorrect": false,
            "feedback": "Incorrect. To displace means to shift journeys from one mode to another — not to provide financial encouragement."
          }
        ]
      },

      // ─── 26. EXACERBATE ──────────────────────────────────────────────
      {
        "id": 51,
        "sentence": "Road expansion, far from solving congestion, makes it significantly worse by generating additional journeys that rapidly fill the new capacity.",
        "targetWord": "makes it significantly worse",
        "options": [
          {
            "id": "A",
            "text": "alleviates it",
            "isCorrect": false,
            "feedback": "Incorrect. To alleviate means to reduce severity — the opposite of making something significantly worse."
          },
          {
            "id": "B",
            "text": "facilitates it",
            "isCorrect": false,
            "feedback": "Incorrect. To facilitate means to make something easier — not to make a problem worse."
          },
          {
            "id": "C",
            "text": "exacerbates it",
            "isCorrect": true,
            "feedback": "Correct! To exacerbate means to make a problem significantly worse — precisely what road expansion does to congestion through induced demand."
          },
          {
            "id": "D",
            "text": "integrates it",
            "isCorrect": false,
            "feedback": "Incorrect. To integrate means to combine elements into a whole — not to intensify a problem."
          }
        ]
      },
      {
        "id": 52,
        "sentence": "Car-centric urban development intensifies transport inequality by creating communities that are physically inaccessible without a privately owned vehicle.",
        "targetWord": "intensifies",
        "options": [
          {
            "id": "A",
            "text": "alleviates",
            "isCorrect": false,
            "feedback": "Incorrect. To alleviate means to reduce — the opposite of intensifying a problem."
          },
          {
            "id": "B",
            "text": "exacerbates",
            "isCorrect": true,
            "feedback": "Correct! To exacerbate means to intensify or aggravate a negative situation — car-centric development exacerbates transport inequality by making car ownership essential."
          },
          {
            "id": "C",
            "text": "subsidises",
            "isCorrect": false,
            "feedback": "Incorrect. To subsidise means to use public funds to lower prices — not to intensify a problem."
          },
          {
            "id": "D",
            "text": "displaces",
            "isCorrect": false,
            "feedback": "Incorrect. To displace means to shift something from one place to another — not to intensify or worsen a problem."
          }
        ]
      },

      // ─── 27. FACILITATE ──────────────────────────────────────────────
      {
        "id": 53,
        "sentence": "Good cycling infrastructure does not force people onto bikes — it removes the barriers that make cycling feel unsafe, making it a realistic option for the first time.",
        "targetWord": "removes the barriers that make cycling feel unsafe, making it a realistic option",
        "options": [
          {
            "id": "A",
            "text": "deters cycling",
            "isCorrect": false,
            "feedback": "Incorrect. To deter means to discourage — the opposite of removing barriers and making something possible."
          },
          {
            "id": "B",
            "text": "restricts cycling",
            "isCorrect": false,
            "feedback": "Incorrect. To restrict means to limit — the opposite of removing barriers and enabling a behaviour."
          },
          {
            "id": "C",
            "text": "facilitates cycling",
            "isCorrect": true,
            "feedback": "Correct! To facilitate means to make something easier by removing obstacles — exactly what good cycling infrastructure does."
          },
          {
            "id": "D",
            "text": "generates cycling",
            "isCorrect": false,
            "feedback": "Close, but facilitate is more precise here — it emphasises removing barriers rather than simply creating demand."
          }
        ]
      },
      {
        "id": 54,
        "sentence": "High-quality transport infrastructure makes economic activity easier across a city by improving access to employment centres and enlarging labour market catchment areas.",
        "targetWord": "makes economic activity easier",
        "options": [
          {
            "id": "A",
            "text": "exacerbates economic activity",
            "isCorrect": false,
            "feedback": "Incorrect. To exacerbate means to worsen — not to make something easier or more achievable."
          },
          {
            "id": "B",
            "text": "restricts economic activity",
            "isCorrect": false,
            "feedback": "Incorrect. To restrict means to limit — the opposite of making economic activity easier."
          },
          {
            "id": "C",
            "text": "facilitates economic activity",
            "isCorrect": true,
            "feedback": "Correct! To facilitate means to make a process easier or more achievable — good transport infrastructure facilitates economic activity by improving connectivity."
          },
          {
            "id": "D",
            "text": "deters economic activity",
            "isCorrect": false,
            "feedback": "Incorrect. To deter means to discourage — the opposite of making economic activity easier."
          }
        ]
      },

      // ─── 28. DISPLACE ────────────────────────────────────────────────
      {
        "id": 55,
        "sentence": "When Stockholm introduced its congestion charge, many car journeys did not simply move to other routes — they did not happen at all.",
        "targetWord": "move to other routes",
        "options": [
          {
            "id": "A",
            "text": "generate to other routes",
            "isCorrect": false,
            "feedback": "Incorrect. To generate means to create — not to shift existing journeys to different routes."
          },
          {
            "id": "B",
            "text": "integrate to other routes",
            "isCorrect": false,
            "feedback": "Incorrect. To integrate means to combine into a unified whole — not to shift journeys to different routes."
          },
          {
            "id": "C",
            "text": "be displaced to other routes",
            "isCorrect": true,
            "feedback": "Correct! To displace means to cause journeys to shift from one place or mode to another — Stockholm's experience showed that many journeys were not displaced but dissolved entirely."
          },
          {
            "id": "D",
            "text": "be subsidised to other routes",
            "isCorrect": false,
            "feedback": "Incorrect. To subsidise means to reduce prices with public money — not to shift journeys to different routes."
          }
        ]
      },
      {
        "id": 56,
        "sentence": "New metro lines can shift a significant proportion of car journeys onto rail — but only when the service is genuinely superior in speed, cost, and reliability.",
        "targetWord": "shift a significant proportion of car journeys onto rail",
        "options": [
          {
            "id": "A",
            "text": "exacerbate a significant proportion of car journeys onto rail",
            "isCorrect": false,
            "feedback": "Incorrect. To exacerbate means to worsen — it cannot describe journeys moving from cars to trains."
          },
          {
            "id": "B",
            "text": "displace a significant proportion of car journeys onto rail",
            "isCorrect": true,
            "feedback": "Correct! To displace in transport means to cause journeys to shift from one mode to another — new metro lines can displace car journeys onto rail."
          },
          {
            "id": "C",
            "text": "subsidise a significant proportion of car journeys onto rail",
            "isCorrect": false,
            "feedback": "Incorrect. To subsidise means to reduce prices with public funds — not to cause journeys to shift between modes."
          },
          {
            "id": "D",
            "text": "restrict a significant proportion of car journeys onto rail",
            "isCorrect": false,
            "feedback": "Not quite. To restrict means to limit access — displace is the precise term for shifting existing journeys from one mode to another."
          }
        ]
      },

      // ─── 29. GENERATE ────────────────────────────────────────────────
      {
        "id": 57,
        "sentence": "New roads do not merely accommodate existing journeys more efficiently — they create entirely new journeys that would not otherwise have occurred.",
        "targetWord": "create entirely new journeys",
        "options": [
          {
            "id": "A",
            "text": "alleviate entirely new journeys",
            "isCorrect": false,
            "feedback": "Incorrect. To alleviate means to reduce — not to create new journeys."
          },
          {
            "id": "B",
            "text": "restrict entirely new journeys",
            "isCorrect": false,
            "feedback": "Incorrect. To restrict means to limit — the opposite of creating new journeys."
          },
          {
            "id": "C",
            "text": "generate entirely new journeys",
            "isCorrect": true,
            "feedback": "Correct! To generate means to produce or create — this is the precise term used in transport economics for the new traffic that new roads create through induced demand."
          },
          {
            "id": "D",
            "text": "integrate entirely new journeys",
            "isCorrect": false,
            "feedback": "Incorrect. To integrate means to combine elements into a whole — not to create new journeys."
          }
        ]
      },
      {
        "id": 58,
        "sentence": "Online shopping has produced enormous volumes of last-mile delivery traffic in cities, significantly worsening congestion in areas already under pressure.",
        "targetWord": "produced enormous volumes of last-mile delivery traffic",
        "options": [
          {
            "id": "A",
            "text": "displaced enormous volumes of last-mile delivery traffic",
            "isCorrect": false,
            "feedback": "Incorrect. To displace means to shift existing traffic — not to produce new volumes of it."
          },
          {
            "id": "B",
            "text": "integrated enormous volumes of last-mile delivery traffic",
            "isCorrect": false,
            "feedback": "Incorrect. To integrate means to combine into a whole — not to produce new volumes of traffic."
          },
          {
            "id": "C",
            "text": "generated enormous volumes of last-mile delivery traffic",
            "isCorrect": true,
            "feedback": "Correct! To generate means to produce or create — online shopping has generated enormous new volumes of last-mile delivery traffic."
          },
          {
            "id": "D",
            "text": "alleviated enormous volumes of last-mile delivery traffic",
            "isCorrect": false,
            "feedback": "Incorrect. To alleviate means to reduce — the opposite of producing new volumes of traffic."
          }
        ]
      },

      // ─── 30. PRIORITISE ──────────────────────────────────────────────
      {
        "id": 59,
        "sentence": "Cities that have given precedence to public transport, cycling, and pedestrians in road space allocation have most successfully reduced car dependency.",
        "targetWord": "given precedence to",
        "options": [
          {
            "id": "A",
            "text": "subsidised",
            "isCorrect": false,
            "feedback": "Incorrect. To subsidise means to reduce prices with public funds — not to give precedence in resource allocation."
          },
          {
            "id": "B",
            "text": "restricted",
            "isCorrect": false,
            "feedback": "Incorrect. To restrict means to limit access — not to give a particular group or mode precedence over others."
          },
          {
            "id": "C",
            "text": "prioritised",
            "isCorrect": true,
            "feedback": "Correct! To prioritise means to treat something as more important than others in resource allocation decisions — giving pedestrians and cyclists precedence over cars in road space."
          },
          {
            "id": "D",
            "text": "generated",
            "isCorrect": false,
            "feedback": "Incorrect. To generate means to create or produce — not to give precedence in planning decisions."
          }
        ]
      },
      {
        "id": 60,
        "sentence": "Every transport planning decision is ultimately a statement about whose needs are treated as most important — and most cities have historically ranked car users above everyone else.",
        "targetWord": "treated as most important",
        "options": [
          {
            "id": "A",
            "text": "facilitated",
            "isCorrect": false,
            "feedback": "Incorrect. To facilitate means to make something easier — not to rank it as most important in planning decisions."
          },
          {
            "id": "B",
            "text": "integrated",
            "isCorrect": false,
            "feedback": "Incorrect. To integrate means to combine into a whole — not to treat as most important in resource decisions."
          },
          {
            "id": "C",
            "text": "prioritised",
            "isCorrect": true,
            "feedback": "Correct! To prioritise means to treat something as most important — and transport planning decisions reveal whose needs have been prioritised through the infrastructure that is built."
          },
          {
            "id": "D",
            "text": "displaced",
            "isCorrect": false,
            "feedback": "Incorrect. To displace means to shift something from one place to another — not to rank something as most important."
          }
        ]
      },

      // ─── 31. INTEGRATE ───────────────────────────────────────────────
      {
        "id": 61,
        "sentence": "Japan's Suica card combines trains, buses, taxis, and retail payments into a single unified system, dissolving the boundaries between transport modes.",
        "targetWord": "combines trains, buses, taxis, and retail payments into a single unified system",
        "options": [
          {
            "id": "A",
            "text": "restricts trains, buses, and taxis into a single system",
            "isCorrect": false,
            "feedback": "Incorrect. To restrict means to limit access — not to combine different modes into a unified system."
          },
          {
            "id": "B",
            "text": "generates trains, buses, and taxis into a single system",
            "isCorrect": false,
            "feedback": "Incorrect. To generate means to produce or create — not to combine existing modes into a unified system."
          },
          {
            "id": "C",
            "text": "integrates trains, buses, and taxis into a single system",
            "isCorrect": true,
            "feedback": "Correct! To integrate means to combine different elements into a unified, coherent whole — exactly what the Suica card does across multiple transport modes."
          },
          {
            "id": "D",
            "text": "displaces trains, buses, and taxis into a single system",
            "isCorrect": false,
            "feedback": "Incorrect. To displace means to shift something from one mode or place to another — not to combine modes into a unified payment system."
          }
        ]
      },
      {
        "id": 62,
        "sentence": "A unified transport system with coordinated timetabling and seamless interchange attracts far more car users than a collection of individually excellent but disconnected services.",
        "targetWord": "unified transport system with coordinated timetabling and seamless interchange",
        "options": [
          {
            "id": "A",
            "text": "subsidised transport system",
            "isCorrect": false,
            "feedback": "Not quite. A subsidised system has reduced prices — an integrated system is unified in operations, timetabling, and ticketing."
          },
          {
            "id": "B",
            "text": "integrated transport system",
            "isCorrect": true,
            "feedback": "Correct! An integrated transport system is one where different modes are combined into a coherent, unified whole with coordinated timetabling and seamless connections."
          },
          {
            "id": "C",
            "text": "restricted transport system",
            "isCorrect": false,
            "feedback": "Incorrect. A restricted system limits access — an integrated system connects and unifies different modes."
          },
          {
            "id": "D",
            "text": "prioritised transport system",
            "isCorrect": false,
            "feedback": "Incorrect. A prioritised system gives precedence to certain modes — an integrated system combines different modes into a unified whole."
          }
        ]
      },

      // ─── 32. RESTRICT ────────────────────────────────────────────────
      {
        "id": 63,
        "sentence": "Oslo removed all on-street car parking from its city centre, and the spaces became cycling infrastructure and wider pavements — making the city more economically vibrant.",
        "targetWord": "removed all on-street car parking",
        "options": [
          {
            "id": "A",
            "text": "subsidised all on-street car parking",
            "isCorrect": false,
            "feedback": "Incorrect. To subsidise means to reduce prices with public funds — not to remove parking spaces."
          },
          {
            "id": "B",
            "text": "generated all on-street car parking",
            "isCorrect": false,
            "feedback": "Incorrect. To generate means to create or produce — the opposite of removing existing parking."
          },
          {
            "id": "C",
            "text": "restricted all on-street car parking",
            "isCorrect": true,
            "feedback": "Correct! To restrict means to limit or remove access — Oslo restricted and ultimately eliminated on-street car parking in its city centre."
          },
          {
            "id": "D",
            "text": "facilitated all on-street car parking",
            "isCorrect": false,
            "feedback": "Incorrect. To facilitate means to make something easier — the opposite of removing parking access."
          }
        ]
      },
      {
        "id": 64,
        "sentence": "Low emission zones limit vehicle access for the most polluting cars, improving urban air quality despite consistent initial opposition from businesses.",
        "targetWord": "limit vehicle access for",
        "options": [
          {
            "id": "A",
            "text": "incentivise vehicle access for",
            "isCorrect": false,
            "feedback": "Incorrect. To incentivise means to encourage through reward — the opposite of limiting access."
          },
          {
            "id": "B",
            "text": "integrate vehicle access for",
            "isCorrect": false,
            "feedback": "Incorrect. To integrate means to combine into a whole — not to limit access for certain vehicles."
          },
          {
            "id": "C",
            "text": "restrict vehicle access for",
            "isCorrect": true,
            "feedback": "Correct! To restrict means to limit or control access — low emission zones restrict access for the most polluting vehicles."
          },
          {
            "id": "D",
            "text": "displace vehicle access for",
            "isCorrect": false,
            "feedback": "Incorrect. To displace means to shift journeys from one mode to another — not to limit which vehicles can enter an area."
          }
        ]
      },

      // ─── 33. SUBSIDISE ───────────────────────────────────────────────
      {
        "id": 65,
        "sentence": "Vienna uses public money to keep its annual transport pass at around €365 — roughly one euro per day — generating social, environmental, and economic returns that far exceed the cost.",
        "targetWord": "uses public money to keep its annual transport pass at a low price",
        "options": [
          {
            "id": "A",
            "text": "restricts its annual transport pass",
            "isCorrect": false,
            "feedback": "Incorrect. To restrict means to limit access — not to use public money to keep prices low."
          },
          {
            "id": "B",
            "text": "subsidises its annual transport pass",
            "isCorrect": true,
            "feedback": "Correct! To subsidise means to use public funding to reduce the cost of a service below its market price — exactly what Vienna does with its €365 transport pass."
          },
          {
            "id": "C",
            "text": "generates its annual transport pass",
            "isCorrect": false,
            "feedback": "Incorrect. To generate means to create or produce — not to use public money to keep prices affordable."
          },
          {
            "id": "D",
            "text": "integrates its annual transport pass",
            "isCorrect": false,
            "feedback": "Incorrect. To integrate means to combine modes into a unified system — not to use public funds to keep ticket prices low."
          }
        ]
      },
      {
        "id": 66,
        "sentence": "The economic case for using public funds to lower bus and train fares is stronger than debate suggests — reduced congestion, lower healthcare costs, and improved labour market access exceed the fiscal outlay.",
        "targetWord": "using public funds to lower bus and train fares",
        "options": [
          {
            "id": "A",
            "text": "incentivising bus and train fares",
            "isCorrect": false,
            "feedback": "Close, but subsidise specifically means using public money to reduce prices below market cost — incentivise is the broader term for any positive encouragement."
          },
          {
            "id": "B",
            "text": "facilitating bus and train fares",
            "isCorrect": false,
            "feedback": "Incorrect. To facilitate means to make something easier — not to use public money to reduce the cost of fares."
          },
          {
            "id": "C",
            "text": "prioritising bus and train fares",
            "isCorrect": false,
            "feedback": "Incorrect. To prioritise means to give precedence — not to use public funds to reduce prices."
          },
          {
            "id": "D",
            "text": "subsidising bus and train fares",
            "isCorrect": true,
            "feedback": "Correct! To subsidise means to use public funding to reduce the cost of a service — and subsidising public transport fares generates wider social and economic returns that justify the investment."
          }
        ]
      }


        ],
        contextTetris: [

    {
      "id": 1,
      "set_name": "Section 1 — Modes of Transport (Band 6-7)",
      "instruction": "Fill each gap with the correct word or phrase from the box.",
      "word_bank": [
        "private vehicles",
        "public transport",
        "mass transit",
        "active travel",
        "high-speed rail",
        "light rail",
        "bus rapid transit",
        "electric vehicles",
        "autonomous vehicles",
        "cycling infrastructure",
        "freight transport"
      ],
      "items": [
        {
          "item_id": 1,
          "gap_sentence": "In most American suburbs, reliance on ___ is not a lifestyle choice but a structural necessity created by decades of car-centric planning.",
          "answer": "private vehicles"
        },
        {
          "item_id": 2,
          "gap_sentence": "Cities that invest in reliable, affordable ___ consistently achieve lower rates of car dependency and reduced urban carbon emissions.",
          "answer": "public transport"
        },
        {
          "item_id": 3,
          "gap_sentence": "Rapidly growing megacities must invest ambitiously in ___ systems — underground railways, elevated rail, and dedicated bus networks — before car-centric patterns become permanently entrenched.",
          "answer": "mass transit"
        },
        {
          "item_id": 4,
          "gap_sentence": "Investment in ___ — walking and cycling — delivers a co-benefits effect, simultaneously reducing emissions, alleviating congestion, and improving population health.",
          "answer": "active travel"
        },
        {
          "item_id": 5,
          "gap_sentence": "When France opened its TGV network, domestic airlines on competing routes lost the majority of their passengers — demonstrating the transformative potential of ___.",
          "answer": "high-speed rail"
        },
        {
          "item_id": 6,
          "gap_sentence": "Manchester's ___ network has grown from a modest system in 1992 to nearly 100 stops, measurably reducing car use on parallel routes.",
          "answer": "light rail"
        },
        {
          "item_id": 7,
          "gap_sentence": "Bogotá's ___ system halved journey times on major corridors at a fraction of the cost of underground metro construction, proving that world-class mobility does not require a wealthy city.",
          "answer": "bus rapid transit"
        },
        {
          "item_id": 8,
          "gap_sentence": "While the transition to ___ is essential for decarbonisation, it addresses exhaust emissions without solving congestion, car dependency, or transport inequality.",
          "answer": "electric vehicles"
        },
        {
          "item_id": 9,
          "gap_sentence": "___ raise profound questions extending beyond road safety — including legal liability for algorithmically caused harm and the displacement of millions of professional drivers.",
          "answer": "autonomous vehicles"
        },
        {
          "item_id": 10,
          "gap_sentence": "Evidence from the Netherlands demonstrates that high-quality, segregated ___ creates its own demand — when safe routes are built, cycling rates rise dramatically across all age groups.",
          "answer": "cycling infrastructure"
        },
        {
          "item_id": 11,
          "gap_sentence": "Decarbonising ___ presents challenges qualitatively different from electrifying the passenger vehicle fleet, given the weight and energy intensity requirements of heavy goods vehicles.",
          "answer": "freight transport"
        }
      ]
    },

    {
      "id": 2,
      "set_name": "Section 2 — Infrastructure & Urban Space (Band 6-7)",
      "instruction": "Fill each gap with the correct word or phrase from the box.",
      "word_bank": [
        "transport network",
        "road network",
        "urban motorway",
        "pedestrian zone",
        "transport hub",
        "road capacity",
        "charging infrastructure",
        "urban planning",
        "land use",
        "transport corridor"
      ],
      "items": [
        {
          "item_id": 1,
          "gap_sentence": "What makes Singapore's mobility system exceptional is not any single service but the degree of integration across its entire ___, where trains, buses, cycling, and ferries connect seamlessly.",
          "answer": "transport network"
        },
        {
          "item_id": 2,
          "gap_sentence": "Houston has one of the most extensive ___ systems in the world — and yet remains one of America's most congested cities, demonstrating that road-building alone cannot solve traffic problems.",
          "answer": "road network"
        },
        {
          "item_id": 3,
          "gap_sentence": "When San Francisco demolished its earthquake-damaged ___, the traffic it had carried largely disappeared rather than relocating — a phenomenon transport economists call traffic evaporation.",
          "answer": "urban motorway"
        },
        {
          "item_id": 4,
          "gap_sentence": "When New York created a ___ in Times Square, retail sales increased by 71% and pedestrian injuries fell by 40% in the first year — confounding the predictions of local businesses.",
          "answer": "pedestrian zone"
        },
        {
          "item_id": 5,
          "gap_sentence": "Amsterdam Centraal is the living proof of what an integrated ___ can achieve — intercity trains, metro, trams, ferries, and one of the world's largest cycle parking facilities converge in a single location.",
          "answer": "transport hub"
        },
        {
          "item_id": 6,
          "gap_sentence": "Increasing ___ is counter-intuitively self-defeating — the phenomenon of induced demand ensures that additional space attracts new journeys that reproduce congestion within a few years.",
          "answer": "road capacity"
        },
        {
          "item_id": 7,
          "gap_sentence": "The EV transition cannot proceed at the pace required by climate targets without a parallel rollout of publicly accessible ___, particularly in urban areas where residents lack private off-street parking.",
          "answer": "charging infrastructure"
        },
        {
          "item_id": 8,
          "gap_sentence": "Transport problems are, at their deepest level, ___ problems — the spatial organisation of cities determines mobility patterns far more powerfully than any individual transport policy.",
          "answer": "urban planning"
        },
        {
          "item_id": 9,
          "gap_sentence": "Single-use ___ patterns — separating homes, workplaces, and shops into different zones miles apart — make car dependency structurally inevitable regardless of the quality of public transport provision.",
          "answer": "land use"
        },
        {
          "item_id": 10,
          "gap_sentence": "London's Jubilee Line Extension transformed deprived neighbourhoods along its ___ into vibrant, economically active communities — proving that transport investment fundamentally shapes urban development.",
          "answer": "transport corridor"
        }
      ]
    },

    {
      "id": 3,
      "set_name": "Section 3 — Movement & Journey Verbs (Band 6-7)",
      "instruction": "Fill each gap with the correct verb from the box. Use the correct form where necessary.",
      "word_bank": [
        "commute",
        "alleviate",
        "deter",
        "incentivise",
        "exacerbate",
        "facilitate",
        "displace",
        "generate",
        "prioritise",
        "integrate",
        "restrict",
        "subsidise"
      ],
      "items": [
        {
          "item_id": 1,
          "gap_sentence": "Research consistently shows that people who ___ by bicycle report significantly higher levels of wellbeing than those who drive the same distance — even when journey times are equivalent.",
          "answer": "commute"
        },
        {
          "item_id": 2,
          "gap_sentence": "Investment in public transport can significantly ___ urban congestion — though it cannot eliminate it without complementary demand management measures such as road pricing.",
          "answer": "alleviate"
        },
        {
          "item_id": 3,
          "gap_sentence": "High parking charges in city centres are specifically designed to ___ discretionary car journeys — those made out of habit rather than genuine necessity.",
          "answer": "deter"
        },
        {
          "item_id": 4,
          "gap_sentence": "Norway ___ electric vehicle adoption so effectively — through tax exemptions, free parking, and bus lane access — that buying a petrol car became the less rational economic choice.",
          "answer": "incentivised"
        },
        {
          "item_id": 5,
          "gap_sentence": "Road expansion, far from solving congestion, frequently ___ it — induced demand ensures that new capacity attracts additional journeys that reproduce congestion within a few years.",
          "answer": "exacerbates"
        },
        {
          "item_id": 6,
          "gap_sentence": "Good cycling infrastructure does not force people onto bikes — it ___ cycling by removing the barriers of danger and inconvenience that previously made it feel impractical.",
          "answer": "facilitates"
        },
        {
          "item_id": 7,
          "gap_sentence": "Stockholm's congestion charge ___ many car journeys from the city centre — but crucially, a significant proportion of those journeys did not relocate to other routes. They simply did not happen.",
          "answer": "displaced"
        },
        {
          "item_id": 8,
          "gap_sentence": "New roads do not merely accommodate existing traffic more efficiently — they ___ entirely new journeys through the mechanism of induced demand, rapidly filling the available capacity.",
          "answer": "generate"
        },
        {
          "item_id": 9,
          "gap_sentence": "Cities that have most successfully reduced car dependency have consistently ___ public transport, cycling, and pedestrians in the allocation of road space over several decades.",
          "answer": "prioritised"
        },
        {
          "item_id": 10,
          "gap_sentence": "The effectiveness of public transport depends less on individual service quality than on how well different modes are ___ — a unified system with seamless interchange consistently outperforms a collection of uncoordinated services.",
          "answer": "integrated"
        },
        {
          "item_id": 11,
          "gap_sentence": "Several European cities have ___ private vehicle access to their historic centres, replacing parking spaces with cycling infrastructure and wider pavements — to the eventual approval of the businesses that initially opposed the change.",
          "answer": "restricted"
        },
        {
          "item_id": 12,
          "gap_sentence": "The economic case for ___ public transport fares is stronger than debate suggests — the wider social benefits of high ridership, including reduced congestion and lower healthcare costs, typically exceed the fiscal cost of the policy.",
          "answer": "subsidising"
        }
      ]
    },

    {
      "id": 4,
      "set_name": "Mixed Transport Vocabulary — Band 7 Challenge",
      "instruction": "Fill each gap with the correct word or phrase from the box. Each item tests your understanding of meaning in context.",
      "word_bank": [
        "induced demand",
        "modal shift",
        "transit-oriented development",
        "carbon footprint",
        "transport inequality",
        "community severance",
        "active travel",
        "congestion pricing",
        "urban sprawl",
        "charging infrastructure",
        "mass transit",
        "autonomous vehicles"
      ],
      "items": [
        {
          "item_id": 1,
          "gap_sentence": "The phenomenon of ___ — whereby new road capacity generates new journeys rather than accommodating existing ones — is so consistently documented that transport economists have called it the fundamental law of road congestion.",
          "answer": "induced demand"
        },
        {
          "item_id": 2,
          "gap_sentence": "Achieving a meaningful ___ away from private car use requires both making alternatives genuinely superior and making driving in cities genuinely less convenient — neither approach alone is sufficient.",
          "answer": "modal shift"
        },
        {
          "item_id": 3,
          "gap_sentence": "___ — designing higher-density, mixed-use communities around public transport nodes — is the planning principle that underlies the success of cities like Tokyo and Zurich in maintaining low car dependency despite rapid growth.",
          "answer": "transit-oriented development"
        },
        {
          "item_id": 4,
          "gap_sentence": "Transport accounts for approximately 24% of global ___ emissions, making the decarbonisation of how people and goods move one of the most urgent climate policy challenges.",
          "answer": "carbon footprint"
        },
        {
          "item_id": 5,
          "gap_sentence": "___ is one of the most acute and least acknowledged forms of social exclusion — when communities lack affordable mobility, they are effectively cut off from employment, education, and social participation.",
          "answer": "transport inequality"
        },
        {
          "item_id": 6,
          "gap_sentence": "Urban motorways have inflicted ___ on countless neighbourhoods — physically dividing communities in ways that undermine social cohesion and expose residents to chronic noise and air pollution.",
          "answer": "community severance"
        },
        {
          "item_id": 7,
          "gap_sentence": "Investment in ___ delivers what researchers call a co-benefits effect — reducing emissions, easing congestion, improving public health, and reducing long-term healthcare costs simultaneously.",
          "answer": "active travel"
        },
        {
          "item_id": 8,
          "gap_sentence": "___ is arguably the most economically efficient tool for managing urban traffic — evidence from London, Stockholm, and Singapore consistently shows it reduces vehicle volumes and improves air quality.",
          "answer": "congestion pricing"
        },
        {
          "item_id": 9,
          "gap_sentence": "___ and sustainable transport are structurally incompatible — low-density outward expansion of cities makes efficient public transport economically unviable, locking communities into car dependency for generations.",
          "answer": "urban sprawl"
        },
        {
          "item_id": 10,
          "gap_sentence": "The EV transition will stall without adequate ___ — particularly for the millions of urban residents who live in flats without access to private off-street parking and depend entirely on publicly accessible charging.",
          "answer": "charging infrastructure"
        },
        {
          "item_id": 11,
          "gap_sentence": "Megacities that fail to invest in ___ systems early — before car-centric development patterns become entrenched — face the prospect of near-permanent gridlock as vehicle ownership rates rise.",
          "answer": "mass transit"
        },
        {
          "item_id": 12,
          "gap_sentence": "___ raise profound governance questions that go well beyond road safety — including who is legally liable when an algorithm causes harm, and who authorised the moral choices embedded in that algorithm.",
          "answer": "autonomous vehicles"
        }
      ]
    },

    {
      "id": 5,
      "set_name": "IELTS Writing Sentences — Band 7-8 Academic Context",
      "instruction": "Each sentence below is from an IELTS Task 2 essay. Fill the gap with the correct academic transport term from the box.",
      "word_bank": [
        "private vehicle dependency",
        "public transport infrastructure",
        "modal shift",
        "carbon emissions",
        "urban planning",
        "land use reform",
        "transport corridor",
        "road capacity",
        "cycling infrastructure",
        "subsidising",
        "prioritised",
        "exacerbates",
        "facilitated",
        "integrated",
        "deterring"
      ],
      "items": [
        {
          "item_id": 1,
          "gap_sentence": "The over-reliance on ___ in suburban communities is not a reflection of consumer preference but a structural consequence of planning decisions that made car ownership effectively compulsory.",
          "answer": "private vehicle dependency"
        },
        {
          "item_id": 2,
          "gap_sentence": "Countries that have invested heavily in ___ over the past century — Japan, Switzerland, the Netherlands — consistently rank among the most economically productive and socially equitable in the world.",
          "answer": "public transport infrastructure"
        },
        {
          "item_id": 3,
          "gap_sentence": "Achieving a meaningful ___ away from private cars requires long-term political commitment to both improving alternatives and making driving in urban areas genuinely less convenient.",
          "answer": "modal shift"
        },
        {
          "item_id": 4,
          "gap_sentence": "Transport accounts for approximately 24% of global ___, making it one of the most urgent targets for decarbonisation policy and one of the hardest to address.",
          "answer": "carbon emissions"
        },
        {
          "item_id": 5,
          "gap_sentence": "Transport problems are fundamentally ___ problems — the spatial organisation of cities determines mobility patterns far more powerfully than any individual transport technology or policy.",
          "answer": "urban planning"
        },
        {
          "item_id": 6,
          "gap_sentence": "Meaningful transport reform requires simultaneous ___ — permitting and incentivising mixed-use, higher-density development near public transport nodes rather than transport investment alone.",
          "answer": "land use reform"
        },
        {
          "item_id": 7,
          "gap_sentence": "Concentrating residential and commercial development within walking distance of a major ___ ensures that transport infrastructure generates sufficient ridership to be financially sustainable.",
          "answer": "transport corridor"
        },
        {
          "item_id": 8,
          "gap_sentence": "The counter-intuitive reality of ___ expansion is that it generates additional demand through induced demand, such that new space is typically absorbed within three to five years of opening.",
          "answer": "road capacity"
        },
        {
          "item_id": 9,
          "gap_sentence": "Evidence from the Netherlands and Denmark demonstrates unambiguously that high-quality, segregated ___ creates its own demand — when safe routes are built, cycling rates rise across all demographic groups.",
          "answer": "cycling infrastructure"
        },
        {
          "item_id": 10,
          "gap_sentence": "The economic case for ___ public transport fares is stronger than public debate typically acknowledges — the wider social and environmental returns consistently exceed the direct fiscal cost.",
          "answer": "subsidising"
        },
        {
          "item_id": 11,
          "gap_sentence": "Cities that have most successfully reduced car dependency have ___ public transport, cycling, and pedestrians in road space allocation through decades of consistent political commitment.",
          "answer": "prioritised"
        },
        {
          "item_id": 12,
          "gap_sentence": "Road expansion, far from alleviating urban congestion, frequently ___ it — induced demand ensures that additional capacity attracts new journeys that reproduce and often exceed pre-expansion traffic levels.",
          "answer": "exacerbates"
        },
        {
          "item_id": 13,
          "gap_sentence": "Good cycling infrastructure ___ cycling by removing the barriers of danger and inconvenience — it does not compel behaviour, it makes a sustainable choice genuinely viable for the first time.",
          "answer": "facilitates"
        },
        {
          "item_id": 14,
          "gap_sentence": "A transport system in which buses, trains, cycling, and walking are seamlessly ___ through unified ticketing and coordinated timetabling is significantly more effective at reducing car use than a collection of individually excellent but disconnected services.",
          "answer": "integrated"
        },
        {
          "item_id": 15,
          "gap_sentence": "Effective urban transport policy requires both incentivising sustainable alternatives and ___ car use through parking restrictions and road pricing — neither approach alone produces lasting behavioural change.",
          "answer": "deterring"
        }
      ]
    }

  ],
        speakToUnlock: []
    }
};
