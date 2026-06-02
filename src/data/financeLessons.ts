import { Lesson } from "@/types/academy";

export const FINANCE_LESSONS: Lesson[] = [
  {
    id: "1",
    slug: "money-psychology",
    number: 1,
    title: "Money Psychology",
    subtitle: "Understand the invisible forces that govern your wealth.",
    shortDescription: "Learn the neurobiology of spending and the emotional feedback loops that dictate your financial destiny.",
    estimatedMinutes: 15,
    difficulty: "Beginner",
    theme: "#00FFA3",
    transitionStyle: "neural-zoom",
    scenes: [
      {
        id: "mp-1",
        type: "intro",
        title: "The Invisible Blueprint",
        subtitle: "Money is 80% behavior.",
        content: "Most people think personal finance is about math—spreadsheets and interest rates. In reality, money is a reflection of your subconscious habits and emotional triggers.",
        visualType: "image",
        visualData: { src: "academy_money_psychology_3d_1778787418811.png" }
      },
      {
        id: "mp-2",
        type: "concept",
        title: "The Dopamine Loop",
        subtitle: "Why we spend what we don't have.",
        content: "Modern consumerism is engineered to hijack your brain's reward system. Every purchase releases dopamine, creating an addiction cycle that prioritizes short-term pleasure over long-term freedom.",
        visualType: "diagram",
        visualData: { type: "neural-cycle" }
      },
      {
        id: "mp-3",
        type: "explanation",
        title: "Identity and Validation",
        content: "We often buy things not because we need them, but to validate our status to others. True wealth is built by separating your self-worth from material possessions.",
        visualType: "card",
        points: ["Assets do not define social status", "Wealth is what you do not see", "Controlling impulses buys freedom"]
      },
      {
        id: "mp-4",
        type: "example",
        title: "The $100 Challenge",
        content: "Imagine two people: One buys a $100 designer shirt on credit. The other invests $100 in an index fund. After 30 years, the shirt is trash; but the $100 investment has compounded to $1,000.",
        visualType: "chart",
        example: "The opportunity cost of every dollar spent today is the future freedom you could have bought."
      },
      {
        id: "mp-5",
        type: "mistake",
        title: "The Comparison Trap",
        content: "Trying to keep up with others is the fastest way to stay poor. Most people who look rich are actually drowning in debt.",
        visualType: "mistake-compare",
        mistake: {
          bad: "Buying a luxury car to look successful while having $0 savings.",
          good: "Living below your means to quietly build a $10M empire."
        }
      },
      {
        id: "mp-6",
        type: "quiz",
        title: "Neural Audit",
        content: "Test your cognitive understanding of financial behavior.",
        visualType: "icon",
        quiz: {
          question: "Which of the following is the primary driver of impulsive emotional spending?",
          options: ["Logical planning", "Amygdala emotional response", "Long-term goal alignment", "Interest rate analysis"],
          correctIndex: 1,
          explanation: "The amygdala processes emotions like fear and desire, often bypassing the logical prefrontal cortex during impulse purchases."
        }
      },
      {
        id: "mp-7",
        type: "completion",
        title: "Psychology Synchronized",
        content: "You completed the first module. You now understand that your mind is the most powerful financial tool you possess.",
        visualType: "icon",
        summaryPoints: ["Money is behavior, not math", "Audit your emotional triggers", "Delayed gratification is the ultimate skill"]
      }
    ],
    nextLessonSlug: "how-money-works"
  },
  {
    id: "2",
    slug: "how-money-works",
    number: 2,
    title: "How Money Works",
    subtitle: "Decode the global fiat and credit system.",
    shortDescription: "Learn the mechanics of the financial system, inflation, and why 'saving' is a slow way to lose wealth.",
    estimatedMinutes: 20,
    difficulty: "Beginner",
    theme: "#00E0FF",
    transitionStyle: "network-flow",
    scenes: [
      {
        id: "hm-1",
        type: "intro",
        title: "The Grand Illusion",
        subtitle: "Money is a ledger of trust.",
        content: "Most people think money is 'backed' by something physical. In reality, modern currency is a digital system of trust and debt used to transfer value across time and space.",
        visualType: "image",
        visualData: { src: "academy_global_network_3d_1778788118714.png" }
      },
      {
        id: "hm-2",
        type: "concept",
        title: "Fiat and Inflation",
        subtitle: "The melting ice cube.",
        content: "In a fiat system, central banks can create money at will. This expands the money supply, meaning each of your dollars becomes a smaller slice of the overall pie. This is the hidden tax of inflation.",
        visualType: "diagram",
        visualData: { type: "inflation-melt" }
      },
      {
        id: "hm-3",
        type: "explanation",
        title: "The Cantillon Effect",
        content: "Those closest to the money source (banks, governments) receive new currency first before prices rise. By the time it reaches you, your purchasing power has already diminished.",
        visualType: "card",
        points: ["Money is created through debt", "Inflation rewards debtors", "Inflation penalizes savers"]
      },
      {
        id: "hm-4",
        type: "example",
        title: "The Cost of Milk",
        content: "In 1970, a gallon of milk cost $1.32. Today, it is over $4.00. The milk didn't change; the value of the currency used to buy it was diluted by expanding the money supply.",
        visualType: "chart",
        example: "Your income must grow faster than the money supply to maintain your current standard of living."
      },
      {
        id: "hm-5",
        type: "mistake",
        title: "The 'Safe' Savings Account",
        content: "Keeping 100% of your wealth in a bank account isn't 'safe'—it guarantees a 2-5% loss in purchasing power every year.",
        visualType: "mistake-compare",
        mistake: {
          bad: "Hoarding cash in a savings account yielding 0.01% interest.",
          good: "Owning assets (stocks, real estate, BTC) that grow faster than the money supply."
        }
      },
      {
        id: "hm-6",
        type: "quiz",
        title: "System Check",
        content: "Test your understanding of monetary mechanics.",
        visualType: "icon",
        quiz: {
          question: "What happens to the value of each dollar when the overall money supply expands?",
          options: ["It increases", "It remains the same", "It decreases", "It becomes more stable"],
          correctIndex: 2,
          explanation: "More currency chasing the same amount of goods causes the purchasing power of each individual unit to fall."
        }
      },
      {
        id: "hm-7",
        type: "completion",
        title: "Mechanics Mastered",
        content: "You now see the matrix. You understand that the system is engineered to reward asset owners and penalize cash holders.",
        visualType: "icon",
        summaryPoints: ["Money is based on debt", "Inflation is a hidden tax", "Own assets to stay ahead"]
      }
    ],
    nextLessonSlug: "budgeting-saving"
  },
  {
    id: "3",
    slug: "budgeting-saving",
    number: 3,
    title: "Budgeting & Saving",
    subtitle: "Build your financial empire's engine.",
    shortDescription: "Construct a systematic allocation blueprint that automates discipline and builds your war chest.",
    estimatedMinutes: 12,
    difficulty: "Beginner",
    theme: "#FFB800",
    transitionStyle: "block-stack",
    scenes: [
      {
        id: "bs-1",
        type: "intro",
        title: "Systemic Stacks",
        subtitle: "Budgeting is about priority, not restriction.",
        content: "A budget is not a cage—it is a roadmap. It is the act of telling your money where to go instead of wondering where it went. Without a system, your wealth leaks into impulse spending.",
        visualType: "image",
        visualData: { src: "academy_budgeting_blocks_3d_1778788132704.png" }
      },
      {
        id: "bs-2",
        type: "concept",
        title: "The 50/30/20 Framework",
        subtitle: "Simple allocation for absolute control.",
        content: "50% for Needs, 30% for Wants, and 20% for the Future. This simple ratio ensures your empire grows while keeping your current lifestyle comfortable.",
        visualType: "diagram",
        visualData: { type: "allocation-pie" }
      },
      {
        id: "bs-3",
        type: "explanation",
        title: "Pay Yourself First",
        content: "Most people pay their bills, buy coffee, and save whatever is 'left over.' Successful operators route money to their investments the moment they are paid, then live on the rest.",
        visualType: "card",
        points: ["Automation > Willpower", "Treat savings as an invoice", "Peace of mind fund"]
      },
      {
        id: "bs-4",
        type: "example",
        title: "The Defense Moat",
        content: "Holding 6 months of expenses in a high-yield account is your 'moat.' It allows you to take calculated risks and make long-term decisions because you aren't living in survival mode.",
        visualType: "chart",
        example: "A $20,000 emergency fund is the difference between a minor setback and financial ruin."
      },
      {
        id: "bs-5",
        type: "mistake",
        title: "The Manual Tracker",
        content: "Trying to manually track every penny with pen and paper is a recipe for failure. You will burn out and quit.",
        visualType: "mistake-compare",
        mistake: {
          bad: "Spending hours on weekends logging receipts manually.",
          good: "Automating your transfers so your budget runs on autopilot while you sleep."
        }
      },
      {
        id: "bs-6",
        type: "quiz",
        title: "Allocation Audit",
        content: "Test your ability to prioritize your financial stack.",
        visualType: "icon",
        quiz: {
          question: "What is the core principle of 'Pay yourself first'?",
          options: ["Buying a reward after a long week", "Transferring money to savings/investments before paying other expenses", "Demanding a salary increase", "Checking your bank balance daily"],
          correctIndex: 1,
          explanation: "By prioritizing your future first, you guarantee that wealth building is consistent and non-negotiable."
        }
      },
      {
        id: "bs-7",
        type: "completion",
        title: "Optimization Complete",
        content: "Your engine is now tuned. You have transitioned from chaotic spending to systematic wealth allocation.",
        visualType: "icon",
        summaryPoints: ["Automate your discipline", "Prioritize the future", "Build your emergency moat"]
      }
    ],
    nextLessonSlug: "investing-compounding"
  },
  {
    id: "4",
    slug: "investing-compounding",
    number: 4,
    title: "Investing & Compounding",
    subtitle: "Harness the eighth wonder of the world.",
    shortDescription: "Learn to own a piece of global productivity and let time work exponentially for you.",
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    theme: "#A300FF",
    transitionStyle: "growth-path",
    scenes: [
      {
        id: "ic-1",
        type: "intro",
        title: "Exponential Leverage",
        subtitle: "Time is your greatest asset.",
        content: "Investing is the transition from being a 'laborer' to becoming an 'owner.' When you own assets, you benefit from the work and ingenuity of others while you sleep.",
        visualType: "image",
        visualData: { src: "academy_growth_curve_3d_1778788213083.png" }
      },
      {
        id: "ic-2",
        type: "concept",
        title: "Compound Interest",
        subtitle: "The vertical inflection.",
        content: "Compounding is boring at first. For 20 years, it looks like a flat line. Then, interest begins earning interest, and the curve goes vertical. This is how ordinary people become multi-millionaires.",
        visualType: "diagram",
        visualData: { type: "compounding-graph" }
      },
      {
        id: "ic-3",
        type: "explanation",
        title: "Index Funds and ETFs",
        content: "Don't try to find the next Amazon. Buy the whole market. Index funds let you own a tiny slice of thousands of top companies, ensuring you win as humanity progresses.",
        visualType: "card",
        points: ["Diversification is your shield", "Low fees = higher net returns", "Ignore market noise"]
      },
      {
        id: "ic-4",
        type: "example",
        title: "The Value of Time",
        content: "A 20-year-old investing $200 a month will have more money at age 60 than a 30-year-old investing $500 a month. Time does the heavy lifting, not capital.",
        visualType: "chart",
        example: "The best time to invest was 20 years ago. The second best time is today."
      },
      {
        id: "ic-5",
        type: "mistake",
        title: "Timing the Market",
        content: "Trying to guess when the market will go up or down is a loser's game. Even professionals fail at this 90% of the time.",
        visualType: "mistake-compare",
        mistake: {
          bad: "Waiting for the 'perfect' dip while cash loses value to inflation.",
          good: "Investing a fixed amount every month regardless of news (Dollar-Cost Averaging)."
        }
      },
      {
        id: "ic-6",
        type: "quiz",
        title: "Growth Verification",
        content: "Test your understanding of exponential wealth.",
        visualType: "icon",
        quiz: {
          question: "Which factor has the greatest mathematical impact on the final outcome of compound interest?",
          options: ["The initial principal", "The interest rate", "The duration of time", "The broker used"],
          correctIndex: 2,
          explanation: "Time is the exponent in the compounding equation. The longer capital remains invested, the more powerful the compounding effect."
        }
      },
      {
        id: "ic-7",
        type: "completion",
        title: "Horizons Aligned",
        content: "You are now an investor. You understand that patience is the highest leverage skill in finance.",
        visualType: "icon",
        summaryPoints: ["Own global productivity", "Patience yields vertical growth", "Start immediately"]
      }
    ],
    nextLessonSlug: "debt-credit-leverage"
  },
  {
    id: "5",
    slug: "debt-credit-leverage",
    number: 5,
    title: "Debt, Credit & Leverage",
    subtitle: "The double-edged sword of acceleration.",
    shortDescription: "Master the mathematics of borrowing and learn how to use other people's money to multiply your returns.",
    estimatedMinutes: 18,
    difficulty: "Intermediate",
    theme: "#FF005C",
    transitionStyle: "pressure-stack",
    scenes: [
      {
        id: "dl-1",
        type: "intro",
        title: "The Leverage Scale",
        subtitle: "Debt is either a tool or a trap.",
        content: "For the untrained, debt is a cage that consumes future labor. For the wealthy, debt is a lever used to acquire income-producing assets. Mastering leverage is the key to massive scale.",
        visualType: "image",
        visualData: { src: "academy_leverage_scale_3d_1778788225328.png" }
      },
      {
        id: "dl-2",
        type: "concept",
        title: "Good vs. Bad Debt",
        subtitle: "Consumptive vs. Productive.",
        content: "Bad debt (credit cards, car loans) carries high interest and pays for depreciating items. Good debt (mortgages, business loans) carries low interest and pays for appreciating or cash-flowing assets.",
        visualType: "diagram",
        visualData: { type: "debt-quadrant" }
      },
      {
        id: "dl-3",
        type: "explanation",
        title: "Your Credit Profile",
        content: "Your credit score is a measure of trust. A high score allows you to borrow capital at a lower cost, directly increasing your profit margins in leveraged transactions.",
        visualType: "card",
        points: ["Always pay on time", "Keep credit utilization low", "Credit is a long-term asset"]
      },
      {
        id: "dl-4",
        type: "example",
        title: "The Power of OPM",
        content: "Other People's Money. If you buy a $1M property with $200k of your cash and $800k from a bank, and the property appreciates 10%, you didn't make a 10% return—you made a 50% return on your invested capital.",
        visualType: "chart",
        example: "Leverage amplifies both gains and losses. Use with surgical precision."
      },
      {
        id: "dl-5",
        type: "mistake",
        title: "The Consumer Trap",
        content: "Using credit cards to buy luxury goods you haven't earned is the fastest way to become a slave to the bank.",
        visualType: "mistake-compare",
        mistake: {
          bad: "Paying 25% APR interest on a credit card for a summer vacation.",
          good: "Borrowing at 4% to acquire an asset yielding 10% annually."
        }
      },
      {
        id: "dl-6",
        type: "quiz",
        title: "Risk Assessment",
        content: "Evaluate your ability to manage financial leverage.",
        visualType: "icon",
        quiz: {
          question: "What is the primary risk of using high leverage when investing?",
          options: ["Lower taxes", "It amplifies losses during market downturns", "Higher credit scores", "Less paperwork"],
          correctIndex: 1,
          explanation: "Leverage is a multiplier. While it increases potential gains, a small decline in asset value can wipe out your entire initial capital."
        }
      },
      {
        id: "dl-7",
        type: "completion",
        title: "Leverage Authorized",
        content: "You understand the double-edged sword. You know how to avoid the cage and build the ladder.",
        visualType: "icon",
        summaryPoints: ["Avoid high-interest consumer debt", "Build a pristine credit profile", "Use leverage only for cash-flowing assets"]
      }
    ],
    nextLessonSlug: "business-cashflow"
  },
  {
    id: "6",
    slug: "business-cashflow",
    number: 6,
    title: "Business & Cashflow",
    subtitle: "Design your autonomous wealth machine.",
    shortDescription: "Transition from trading time for money to building systems that produce profit while you sleep.",
    estimatedMinutes: 22,
    difficulty: "Advanced",
    theme: "#0075FF",
    transitionStyle: "machine-engine",
    scenes: [
      {
        id: "bc-1",
        type: "intro",
        title: "The Capital Engine",
        subtitle: "Business is a system, not a job.",
        content: "If you have to be there for work to get done, you have a job. If work gets done without you, you have a business. The goal is to build an engine that cash-flows 24/7.",
        visualType: "image",
        visualData: { src: "" }
      },
      {
        id: "bc-2",
        type: "concept",
        title: "Unit Economics",
        subtitle: "The math of a single customer.",
        content: "How much does it cost to acquire one customer (CAC) and how much profit do they bring over time (LTV)? If LTV is at least 3x CAC, you have a scalable business machine.",
        visualType: "diagram",
        visualData: { type: "unit-math" }
      },
      {
        id: "bc-3",
        type: "explanation",
        title: "Profit Margins",
        content: "Revenue is vanity. Profit is sanity. Cash flow is reality. High-margin businesses (like software or media) are superior because they require less capital to grow.",
        visualType: "card",
        points: ["Scale with code and content", "Minimize fixed overhead", "Decouple time from income"]
      },
      {
        id: "bc-4",
        type: "example",
        title: "The SaaS Model",
        content: "A developer builds a software tool once. 10,000 customers pay $20 a month for it. The developer's effort remains identical whether they have 1 customer or 10,000. That is infinite leverage.",
        visualType: "chart",
        example: "Focus on creating assets that have zero marginal cost of replication."
      },
      {
        id: "bc-5",
        type: "mistake",
        title: "The Soloworker CEO",
        content: "Spending all your time doing the task instead of building the process to delegate the task. You are the bottleneck.",
        visualType: "mistake-compare",
        mistake: {
          bad: "Handling every single customer call and technical issue yourself.",
          good: "Hiring and automating, freeing your time to focus on high-level strategy and growth."
        }
      },
      {
        id: "bc-6",
        type: "quiz",
        title: "Economic Analysis",
        content: "Test your understanding of scalable business mechanics.",
        visualType: "icon",
        quiz: {
          question: "Which metric is most critical for the long-term survival of a business?",
          options: ["Gross revenue", "Social media followers", "Positive cash flow", "Headcount"],
          correctIndex: 2,
          explanation: "Cash flow is the oxygen of business. A company can be profitable on paper but still fail if it runs out of cash to pay its bills."
        }
      },
      {
        id: "bc-7",
        type: "completion",
        title: "Systems Aligned",
        content: "You completed the business architecture module. You are now a system designer, not just a worker.",
        visualType: "icon",
        summaryPoints: ["Build systems, not jobs", "Master your unit economics", "Scale with zero marginal cost"]
      }
    ],
    nextLessonSlug: "digital-economy-ai-income"
  },
  {
    id: "7",
    slug: "digital-economy-ai-income",
    number: 7,
    title: "Digital Economy & AI Income",
    subtitle: "Thrive in the age of permissionless leverage.",
    shortDescription: "Harness AI tools and digital platforms to build infinite leverage assets.",
    estimatedMinutes: 15,
    difficulty: "Advanced",
    theme: "#00FFA3",
    transitionStyle: "pixel-portal",
    scenes: [
      {
        id: "de-1",
        type: "intro",
        title: "The Age of Leverage",
        subtitle: "No banks, no bosses, just code.",
        content: "In the 21st century, the internet is the ultimate leverage. You can reach billions of people at zero cost. AI tools now allow a single person to execute the work of a 50-person agency.",
        visualType: "image",
        visualData: { src: "" }
      },
      {
        id: "de-2",
        type: "concept",
        title: "The AI Multiplier",
        subtitle: "Human logic, machine speed.",
        content: "Do not fear AI—leverage it. AI allows you to automate content creation, coding, data analysis, and customer service. It is a cognitive magnifier for your business.",
        visualType: "diagram",
        visualData: { type: "ai-multiplier" }
      },
      {
        id: "de-3",
        type: "explanation",
        title: "The Creator Economy",
        content: "Attention is the new currency. By building an audience around your specific knowledge, you create a distribution channel that belongs to you forever.",
        visualType: "card",
        points: ["Specific knowledge cannot be automated", "Build in public to build trust", "Your network is your net worth"]
      },
      {
        id: "de-4",
        type: "example",
        title: "The Solopreneur",
        content: "A single operator uses ChatGPT to write code, Midjourney to design UI, and social platforms to source customers, running a $500k/year business with zero employees.",
        visualType: "chart",
        example: "The 'one-person company' is the most profitable business model in history."
      },
      {
        id: "de-5",
        type: "mistake",
        title: "The Luddite Trap",
        content: "Ignoring new technology because it feels 'scary' or 'complex,' while competitors use it to outperform you 100 to 1.",
        visualType: "mistake-compare",
        mistake: {
          bad: "Rejecting AI tools and spending 40 hours a week on manual tasks.",
          good: "Using AI to complete those tasks in 1 hour, spending 39 hours on high-value growth."
        }
      },
      {
        id: "de-6",
        type: "quiz",
        title: "Digital Verification",
        content: "Test your readiness for the digital economy.",
        visualType: "icon",
        quiz: {
          question: "What is the primary advantage of the digital economy over the industrial economy?",
          options: ["Higher taxes", "Better offices", "Zero marginal cost of replication and distribution", "More stable jobs"],
          correctIndex: 2,
          explanation: "In the digital world, once you create an asset (code, content, media), serving it to 1,000,000 users costs virtually nothing."
        }
      },
      {
        id: "de-7",
        type: "completion",
        title: "Protocol Aligned",
        content: "You are ready for the future. You understand that in the digital age, leverage is infinite and permissionless.",
        visualType: "icon",
        summaryPoints: ["Use AI as an intelligence multiplier", "Build digital leverage assets", "Control your distribution"]
      }
    ],
    nextLessonSlug: "financial-freedom"
  },
  {
    id: "8",
    slug: "financial-freedom",
    number: 8,
    title: "Financial Freedom",
    subtitle: "The ultimate goal: Buying back your time.",
    shortDescription: "Define your 'Enough' number and design a life driven by purpose, not survival.",
    estimatedMinutes: 30,
    difficulty: "Advanced",
    theme: "#FFFFFF",
    transitionStyle: "open-horizon",
    scenes: [
      {
        id: "ff-1",
        type: "intro",
        title: "Horizon of Freedom",
        subtitle: "Freedom is the ability to say 'No'.",
        content: "Money is just a tool. The ultimate goal is not a massive bank balance—it is the ability to wake up and decide exactly how to spend your day. Financial independence is when work becomes optional.",
        visualType: "image",
        visualData: { src: "" }
      },
      {
        id: "ff-2",
        type: "concept",
        title: "The 4% Rule",
        subtitle: "The mathematics of safety.",
        content: "If you can live on 4% of your total invested portfolio per year, you are financially independent. Your capital is now a self-sustaining engine that funds your life indefinitely.",
        visualType: "diagram",
        visualData: { type: "fi-number" }
      },
      {
        id: "ff-3",
        type: "explanation",
        title: "Ownership and Consumption",
        content: "To remain free, maintain an owner's mindset. Do not let lifestyle inflation consume your passive yield. The more you own, the freer you are.",
        visualType: "card",
        points: ["Define your 'Enough' number", "Invest in experiences, not things", "Time is your only non-renewable resource"]
      },
      {
        id: "ff-4",
        type: "example",
        title: "Mini-Retirements",
        content: "Instead of waiting until age 65, freedom seekers take 'mini-retirements' every few years to enjoy health and vitality while they have them.",
        visualType: "chart",
        example: "Life is a journey, not a destination. Do not trade your best years solely for a paycheck."
      },
      {
        id: "ff-5",
        type: "mistake",
        title: "Golden Handcuffs",
        content: "Earning a high income but inflating your lifestyle costs so much that you are just as trapped as someone earning minimum wage.",
        visualType: "mistake-compare",
        mistake: {
          bad: "Upgrading your home and car every time you receive a salary increase.",
          good: "Keeping expenses stable as income grows, accelerating your freedom date."
        }
      },
      {
        id: "ff-6",
        type: "quiz",
        title: "Freedom Clearance",
        content: "The final check of your financial independence mindset.",
        visualType: "icon",
        quiz: {
          question: "What is the definition of the 'Safe Withdrawal Rate'?",
          options: ["The amount you can spend without working", "The maximum amount you can borrow from a bank", "The percentage of your portfolio you can withdraw annually without running out of money", "Your annual salary after taxes"],
          correctIndex: 2,
          explanation: "The safe withdrawal rate (typically 4%) is the percentage you can withdraw from your investments each year with a high probability of portfolio survival."
        }
      },
      {
        id: "ff-7",
        type: "completion",
        title: "Sovereignty Achieved",
        content: "You graduated from the Academy. You are now equipped with the knowledge to build, protect, and enjoy your financial empire.",
        visualType: "icon",
        summaryPoints: ["Money is a tool to buy time", "Define your purpose beyond survival", "The journey has just begun"]
      }
    ]
  }
];
