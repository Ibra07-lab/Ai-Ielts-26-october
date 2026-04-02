"use client";

import { Pricing } from "@/components/blocks/pricing";

const demoPlans = [
  {
    name: "Basic",
    price: "79000",
    yearlyPrice: "79000",
    period: "month",
    features: [
      "Personalized IELTS roadmap",
      "15 essay evaluations",
      "300 reading agent messages",
      "All reading tests",
      "All listening tests",
      "Limited podcast exercises"
    ],
    description: "See if the system works for you.",
    buttonText: "Start Basic",
    href: "/register",
    isPopular: false,
  },
  {
    name: "Pro",
    price: "149000",
    yearlyPrice: "149000",
    period: "month",
    features: [
      "Everything in Basic",
      "40 essay evaluations",
      "800 reading agent messages",
      "Full podcast library",
      "Detailed band score breakdown",
      "Weak-area training"
    ],
    description: "Serious prep for an upcoming test.",
    buttonText: "Get Pro Now",
    href: "/register",
    isPopular: true,
  },
  {
    name: "Pro+",
    price: "249000",
    yearlyPrice: "249000",
    period: "month",
    features: [
      "Everything in Pro",
      "80 essay evaluations",
      "Unlimited reading agent messages",
      "Advanced feedback",
      "Priority AI evaluation",
      "Full mock exam simulation"
    ],
    description: "The ultimate unlimited system.",
    buttonText: "Get Pro+",
    href: "/register",
    isPopular: false,
  },
];

function PricingBasic() {
  return (
    <div className="h-[800px] overflow-y-auto rounded-lg">
      <Pricing 
        plans={demoPlans}
        title="Simple, Transparent Pricing"
        description="Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support."
      />
    </div>
  );
}

export { PricingBasic };
