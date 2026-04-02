import { useState } from "react";
import { Check, Crown, Star, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "79,000",
      period: "UZS/month",
      description: "See if the system works for you.",
      features: [
        "Personalized IELTS roadmap",
        "15 essay evaluations",
        "300 reading agent messages",
        "All reading tests",
        "All listening tests",
        "Limited podcast exercises"
      ],
      limitations: [],
      popular: false,
      color: "gray"
    },
    {
      id: "pro",
      name: "Pro",
      price: "149,000",
      period: "UZS/month",
      description: "Serious prep for an upcoming test.",
      features: [
        "Everything in Basic",
        "40 essay evaluations",
        "800 reading agent messages",
        "Full podcast library",
        "Detailed band score breakdown",
        "Weak-area training"
      ],
      limitations: [],
      popular: true,
      color: "sky"
    },
    {
      id: "pro_plus",
      name: "Pro+",
      price: "249,000",
      period: "UZS/month",
      description: "The ultimate unlimited system.",
      features: [
        "Everything in Pro",
        "80 essay evaluations",
        "Unlimited reading agent messages",
        "Advanced feedback",
        "Priority AI evaluation",
        "Full mock exam simulation"
      ],
      limitations: [],
      popular: false,
      color: "purple"
    }
  ];

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    // Mock subscription process
    setTimeout(() => {
      toast({
        title: "Subscription Successful!",
        description: `You've successfully subscribed to the ${plans.find(p => p.id === planId)?.name} plan.`,
      });
      setSelectedPlan(null);
    }, 2000);
  };

  const getButtonColor = (plan: any) => {
    if (plan.color === "sky") return "bg-sky-600 hover:bg-sky-700";
    if (plan.color === "purple") return "bg-purple-600 hover:bg-purple-700";
    return "bg-gray-600 hover:bg-gray-700";
  };

  const getCardBorder = (plan: any) => {
    if (plan.popular) return "border-sky-500 shadow-sky-500/20 shadow-lg";
    if (plan.color === "purple") return "border-purple-200 dark:border-purple-800";
    return "border-gray-200 dark:border-gray-700";
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 pb-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your IELTS Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Unlock your full potential with our AI-powered IELTS preparation
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Start with our free plan or upgrade for unlimited access and advanced features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:scale-105 ${getCardBorder(plan)}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-sky-600 text-white px-4 py-1 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {plan.id === "basic" && <CreditCard className="h-12 w-12 text-gray-500" />}
                  {plan.id === "pro" && <Crown className="h-12 w-12 text-sky-600" />}
                  {plan.id === "pro_plus" && <Star className="h-12 w-12 text-purple-600" />}
                </div>
                
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Features included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Limitations:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">⚠️</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Subscribe Button */}
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={selectedPlan === plan.id}
                  className={`w-full ${getButtonColor(plan)} text-white mt-4`}
                >
                  {selectedPlan === plan.id ? (
                    "Processing..."
                  ) : plan.id === "basic" ? (
                    "Start Basic"
                  ) : plan.id === "pro" ? (
                    "Get Pro Now"
                  ) : (
                    "Get Pro+"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! You can upgrade, downgrade, or cancel your subscription at any time. 
                  Changes take effect at the next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Premium plans come with a 7-day free trial. You can cancel anytime during 
                  the trial period without being charged.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We accept all major credit cards, PayPal, and bank transfers. 
                  All payments are processed securely.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer student discounts?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! Students can get 50% off any premium plan with a valid student ID. 
                  Contact support for more details.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Need help choosing a plan?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our team is here to help you find the perfect plan for your IELTS preparation needs.
          </p>
          <Button variant="outline" size="lg">
            Contact Support
          </Button>
        </div>
      </div>
      
    </>
  );
}
