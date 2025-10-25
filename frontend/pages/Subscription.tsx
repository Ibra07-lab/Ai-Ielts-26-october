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
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with IELTS preparation",
      features: [
        "5 practice sessions per day",
        "Basic AI feedback",
        "Limited vocabulary words",
        "Standard support",
        "Basic progress tracking"
      ],
      limitations: [
        "Limited daily usage",
        "Basic features only"
      ],
      popular: false,
      color: "gray"
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19.99",
      period: "per month",
      description: "Comprehensive IELTS preparation with advanced features",
      features: [
        "Unlimited practice sessions",
        "Advanced AI feedback with detailed analysis",
        "Complete vocabulary database",
        "Priority support",
        "Advanced progress analytics",
        "Personalized study plans",
        "Speaking pronunciation analysis",
        "Writing detailed corrections"
      ],
      limitations: [],
      popular: true,
      color: "sky"
    },
    {
      id: "pro",
      name: "Pro",
      price: "$39.99",
      period: "per month",
      description: "Ultimate IELTS preparation with premium coaching",
      features: [
        "Everything in Premium",
        "1-on-1 AI coaching sessions",
        "Exam simulation mode",
        "Custom practice materials",
        "Advanced analytics dashboard",
        "Priority feature requests",
        "Early access to new features",
        "Dedicated account manager"
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
                  {plan.id === "free" && <CreditCard className="h-12 w-12 text-gray-500" />}
                  {plan.id === "premium" && <Crown className="h-12 w-12 text-sky-600" />}
                  {plan.id === "pro" && <Star className="h-12 w-12 text-purple-600" />}
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
                  className={`w-full ${getButtonColor(plan)} text-white`}
                >
                  {selectedPlan === plan.id ? (
                    "Processing..."
                  ) : plan.id === "free" ? (
                    "Get Started Free"
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </Button>

                {plan.id === "premium" && (
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Cancel anytime • 7-day free trial
                  </p>
                )}
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
