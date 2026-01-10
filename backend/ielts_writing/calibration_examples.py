# backend/ielts_writing/calibration_examples.py

CALIBRATION_ESSAYS = {
    "task2_opinion": {
        5.0: {
            "essay": """Technology is very important in our life. Many people use technology every 
day. Some people think technology make life complicated but some people 
think it is easy.

I am agree that technology is good. Because we can use phone to call 
people. Also internet is very useful. We can search many information on 
internet. Students can study online which is very helpful.

However technology has some problems. Some people spend too much time on 
phone. This is not good for health. Also children play games too much and 
don't study.

In my opinion technology is useful but we should be careful. Technology 
has good and bad points. We need use it properly.""",
            "word_count": 113,
            "features": {
                "task_response": {
                    "band": 5.0,
                    "reasons": [
                        "Only partially addresses task",
                        "Ideas present but underdeveloped",
                        "'Technology is good' doesn't address 'complicated vs easier'"
                    ]
                },
                "coherence_cohesion": {
                    "band": 5.0,
                    "reasons": [
                        "Basic paragraphing but no logical progression",
                        "Ideas jump around"
                    ]
                },
                "lexical_resource": {
                    "band": 5.0,
                    "reasons": [
                        "Very limited vocabulary ('good', 'useful', 'helpful')",
                        "Repetition of 'technology'"
                    ]
                },
                "grammatical_range_accuracy": {
                    "band": 5.0,
                    "reasons": [
                        "'I am agree' (error)",
                        "'technology make' (subject-verb)",
                        "Limited structures"
                    ]
                }
            },
            "deliberate_errors": [
                "Under word count",
                "I am agree",
                "Subject-verb agreement errors",
                "Doesn't directly answer the question",
                "Repetitive vocabulary"
            ]
        },
        5.5: {
            "essay": """Nowadays, technology is everywhere in our life. Some people believe that 
technology has made life more complicated, while others think it made 
life easier. In my opinion, I think technology makes our life easier, 
but there are some problems.

Firstly, technology helps us to communicate with other people. For 
example, we can use WhatsApp or email to contact friends and family. This 
is faster than writing letters. Also, we can do shopping online without 
going to shops which saves time.

Secondly, technology helps in education. Students can learn online and 
find information on internet. Many schools use computers for teaching. 
This makes learning more interesting for students.

However, there are some disadvantages. Some people become addicted to 
their phones and spend many hours on social media. This can cause health 
problems and people don't talk face to face anymore.

In conclusion, I believe technology makes life easier but we should use 
it carefully. Technology has both advantages and disadvantages.""",
            "word_count": 167,
            "features": {
                "task_response": {
                    "band": 5.5,
                    "reasons": [
                        "Addresses task but incompletely",
                        "Position stated but supporting ideas are generic",
                        "Doesn't fully explore 'complicated'"
                    ]
                },
                "coherence_cohesion": {
                    "band": 5.5,
                    "reasons": [
                        "Clear structure (intro, 2 body, disadvantage, conclusion)",
                        "Mechanical 'Firstly, Secondly'"
                    ]
                },
                "lexical_resource": {
                    "band": 5.5,
                    "reasons": [
                        "Adequate but basic",
                        "'I think/I believe' repeated",
                        "Some topic vocabulary ('addicted', 'social media')"
                    ]
                },
                "grammatical_range_accuracy": {
                    "band": 5.5,
                    "reasons": [
                        "Mix of simple/complex",
                        "'I think technology makes' (correct)",
                        "Some errors ('find information on internet' missing article)"
                    ]
                }
            },
            "deliberate_errors": [
                "Still under word count (major issue)",
                "'In my opinion, I think' (redundant)",
                "Mechanical linking",
                "Ideas present but not fully developed"
            ]
        },
        6.0: {
            "essay": """In the modern era, technology has become an integral part of daily life. 
While some people argue that technological advancements have complicated 
our lives, others believe they have simplified it. I partially agree that 
technology has made certain aspects of life easier, although it has also 
introduced new challenges.

On the one hand, technology has significantly improved convenience in 
many areas. For instance, smartphones enable instant communication across 
the globe, eliminating the delays associated with traditional mail. 
Furthermore, online banking and shopping have reduced the need for 
physical travel, saving both time and effort. These innovations have 
undoubtedly streamlined daily tasks that previously required considerable 
time and energy.

On the other hand, technology has created new forms of complexity. The 
constant connectivity enabled by smartphones means that many workers find 
it difficult to separate their professional and personal lives. 
Additionally, the rapid pace of technological change requires people to 
continuously learn new systems and applications, which can be overwhelming 
for some individuals, particularly older generations.

In conclusion, while technology has provided numerous conveniences, it has 
also introduced new complications. The key lies in finding a balance and 
using technology wisely rather than allowing it to dominate our lives.""",
            "word_count": 203,
            "features": {
                "task_response": {
                    "band": 6.0,
                    "reasons": [
                        "Addresses both sides",
                        "Position clear ('partially agree')",
                        "Ideas could be more fully developed",
                        "Conclusion somewhat generic"
                    ]
                },
                "coherence_cohesion": {
                    "band": 6.0,
                    "reasons": [
                        "Good structure",
                        "'On the one hand/On the other hand' shows balance",
                        "Logical progression within paragraphs"
                    ]
                },
                "lexical_resource": {
                    "band": 6.0,
                    "reasons": [
                        "Wider range ('integral', 'streamlined', 'overwhelming')",
                        "Some good collocations",
                        "Occasional awkward phrasing"
                    ]
                },
                "grammatical_range_accuracy": {
                    "band": 6.0,
                    "reasons": [
                        "Mix of complex structures",
                        "Most sentences accurate",
                        "'The constant connectivity enabled by' (good)",
                        "Minor issues don't impede"
                    ]
                }
            },
            "deliberate_errors": [
                "Word count still slightly low",
                "Conclusion is somewhat generic",
                "Second body paragraph could use specific example"
            ]
        },
        6.5: {
            "essay": """In contemporary society, technology permeates virtually every aspect of 
our daily existence. While some individuals contend that technological 
progress has rendered life more complicated, others maintain that it has 
simplified our routines. I largely disagree with the view that technology 
complicates life, as I believe its benefits in terms of convenience and 
efficiency substantially outweigh the challenges it presents.

The primary way in which technology has simplified life is through 
enhanced communication. Whereas previous generations relied on postal 
services that took days or weeks, modern messaging applications enable 
instantaneous contact with anyone worldwide. For example, my family 
regularly conducts video calls with relatives in different countries, 
maintaining relationships that would have been difficult to sustain 
decades ago. This represents a clear simplification of what was once a 
complex and time-consuming process.

Furthermore, technology has streamlined access to information and services. 
Tasks that previously required physical presence, such as banking, 
shopping, and even medical consultations, can now be completed from home 
within minutes. According to a recent survey, the average person saves 
approximately three hours per week through online services. This 
efficiency gain demonstrates that technology has, on balance, reduced 
rather than increased the complexity of daily life.

Admittedly, technology does present some challenges, particularly regarding 
information overload and the pressure to remain constantly connected. 
However, these issues can be managed through conscious digital habits, 
such as setting screen time limits or designating technology-free periods.

In conclusion, although technology requires some adaptation, it has 
fundamentally simplified numerous aspects of modern life. The conveniences 
it provides far outweigh the adjustments required to use it effectively.""",
            "word_count": 268,
            "features": {
                "task_response": {
                    "band": 6.5,
                    "reasons": [
                        "Addresses all parts",
                        "Clear position maintained",
                        "Ideas developed with examples",
                        "Counterargument acknowledged"
                    ]
                },
                "coherence_cohesion": {
                    "band": 6.5,
                    "reasons": [
                        "Well-organized",
                        "Good topic sentences",
                        "Cohesive devices varied ('Furthermore', 'Admittedly')"
                    ]
                },
                "lexical_resource": {
                    "band": 6.5,
                    "reasons": [
                        "Good range ('permeates', 'contend', 'instantaneous')",
                        "Some sophisticated choices",
                        "Minor repetition"
                    ]
                },
                "grammatical_range_accuracy": {
                    "band": 6.5,
                    "reasons": [
                        "Good variety",
                        "Complex sentences mostly accurate",
                        "'Whereas previous generations relied' (good subordination)"
                    ]
                }
            },
            "deliberate_errors": [
                "Some phrasing slightly formal/stiff",
                "Could extend ideas more"
            ]
        },
        7.0: {
            "essay": """The proliferation of digital technology in recent decades has 
fundamentally transformed how we live, work, and interact. While critics 
argue that this technological revolution has complicated modern existence, 
I firmly believe that technology has, on balance, simplified life 
considerably—though this simplification requires conscious management.

The most compelling evidence for technology's simplifying influence lies 
in the automation of routine tasks. Consider the mundane activity of 
grocery shopping: what once required travel, physical searching through 
aisles, and queue waiting can now be accomplished in minutes through 
delivery applications. Similarly, financial management has been 
revolutionised by mobile banking, eliminating the need for branch visits 
and manual record-keeping. My own experience exemplifies this—I now 
complete in ten minutes administrative tasks that consumed several hours 
of my parents' time a generation ago.

Beyond convenience, technology has democratised access to information 
and services previously available only to the privileged. Educational 
resources that once required expensive textbooks or university enrollment 
are now freely accessible online. Healthcare consultations can reach 
remote communities through telemedicine. These developments represent 
not merely simplification but the removal of barriers that previously 
complicated life for millions.

Critics rightly note that technology introduces new complexities: 
cybersecurity concerns, digital addiction, and the cognitive burden of 
constant notifications. However, these challenges are management problems 
rather than inherent flaws. Just as earlier generations learned to 
navigate the complexities of urban life or automobile ownership, we are 
developing the digital literacy to harness technology's benefits while 
mitigating its drawbacks.

In conclusion, technology has unquestionably simplified the mechanics of 
daily life, even as it demands new forms of self-discipline. The net 
effect remains overwhelmingly positive for those who engage with 
technology thoughtfully.""",
            "word_count": 282,
            "features": {
                "task_response": {
                    "band": 7.0,
                    "reasons": [
                        "Fully addresses task",
                        "Clear position throughout",
                        "Well-developed ideas with specific examples",
                        "Nuanced conclusion"
                    ]
                },
                "coherence_cohesion": {
                    "band": 7.0,
                    "reasons": [
                        "Logical organization",
                        "Each paragraph has clear focus",
                        "Cohesive devices used flexibly ('Similarly', 'Beyond', 'However')"
                    ]
                },
                "lexical_resource": {
                    "band": 7.0,
                    "reasons": [
                        "Wide range ('proliferation', 'democratised', 'cognitive burden')",
                        "Good collocations",
                        "Occasional sophisticated word choice"
                    ]
                },
                "grammatical_range_accuracy": {
                    "band": 7.0,
                    "reasons": [
                        "Variety of complex structures",
                        "'what once required...can now be accomplished' (good)",
                        "Majority error-free"
                    ]
                }
            },
            "deliberate_errors": [
                "Occasional slight over-formality"
            ]
        },
        7.5: {
            "essay": """The digital revolution has reshaped human existence more profoundly than 
any technological shift since industrialisation. While some commentators 
lament that this transformation has burdened us with unprecedented 
complexity, I would argue that technology has fundamentally simplified 
the practical dimensions of life—even as it challenges us to develop new 
forms of wisdom in its application.

Consider the transformation of information access. A research task that 
once demanded hours in libraries, navigating card catalogues and physical 
archives, now requires mere seconds with a search engine. This is not 
merely faster; it represents a qualitative shift in what individuals can 
accomplish independently. When I needed to understand my elderly mother's 
medical condition, I could access peer-reviewed research, compare 
treatment options, and prepare informed questions for her physician—an 
impossible feat for a layperson in the pre-internet era. The complexity 
of navigating healthcare has not disappeared, but technology has provided 
tools that empower rather than overwhelm.

The economic dimension is equally compelling. Technology has compressed 
tasks that once structured entire days into momentary interactions. 
Banking, bill payment, appointment scheduling, shopping—activities that 
collectively consumed substantial portions of previous generations' 
weeks—now occur almost unconsciously, often automated entirely. This 
liberation of time represents genuine simplification, freeing cognitive 
and temporal resources for pursuits of greater meaning.

The objection that technology creates new complexities—digital security 
threats, addictive design patterns, information overload—merits serious 
consideration. Yet these challenges reflect growth pains rather than 
inherent flaws. Early automobiles were dangerous and unreliable; we 
developed traffic systems, safety standards, and driving skills to 
harness their benefits. Digital literacy will similarly mature, and 
indeed is already doing so.

Ultimately, technology has simplified the mechanics of existence while 
inviting us to grapple with deeper questions about attention, connection, 
and purpose. This is not complication but elevation—the exchange of 
mundane struggles for more meaningful ones.""",
            "word_count": 303,
            "features": {
                "task_response": {
                    "band": 7.5,
                    "reasons": [
                        "Fully developed position",
                        "Sophisticated argumentation",
                        "Ideas extended with depth and nuance"
                    ]
                },
                "coherence_cohesion": {
                    "band": 7.5,
                    "reasons": [
                        "Seamless organization",
                        "Paragraphs build on each other",
                        "Cohesion feels natural, not mechanical"
                    ]
                },
                "lexical_resource": {
                    "band": 7.5,
                    "reasons": [
                        "Sophisticated vocabulary used naturally ('qualitative shift', 'cognitive resources', 'growth pains')",
                        "Style appropriate"
                    ]
                },
                "grammatical_range_accuracy": {
                    "band": 7.5,
                    "reasons": [
                        "Wide range of structures",
                        "Complex sentences handled with flexibility",
                        "Very few errors"
                    ]
                }
            },
            "deliberate_errors": []
        }
    }
}
