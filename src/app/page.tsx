import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, TrendingUp, Wallet, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-pink-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur shadow border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Wallet className="h-9 w-9 text-indigo-600 drop-shadow" />
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Expense<span className="text-indigo-600">AI</span></h1>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:scale-105 transition">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <section className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4 drop-shadow">
            Smart Expense Tracking <span className="text-indigo-600">with AI Insights</span>
          </h2>
          <p className="text-lg sm:text-2xl text-gray-700 max-w-2xl mx-auto">
            Track your expenses, set budgets, and get <span className="font-semibold text-indigo-700">personalized AI-powered insights</span> to make better financial decisions.
          </p>
        </section>

        {/* Feature Cards */}
        <section>
          <div className="grid md:grid-cols-3 gap-8 mb-14">
            <Card className="hover:shadow-2xl transition-all duration-200 rounded-2xl border-0 bg-white/90 animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <PlusCircle className="h-7 w-7 text-green-600" />
                  <CardTitle className="text-gray-900 text-lg font-bold">Track Expenses</CardTitle>
                </div>
                <CardDescription>
                  Easily add and categorize your daily expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Quick expense entry with smart categorization and receipt scanning.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-200 rounded-2xl border-0 bg-white/90 animate-fade-in-up delay-75">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Target className="h-7 w-7 text-blue-600" />
                  <CardTitle className="text-gray-900 text-lg font-bold">Set Budgets</CardTitle>
                </div>
                <CardDescription>
                  Create and monitor budgets for different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Set monthly budgets and get alerts when you are approaching limits.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-200 rounded-2xl border-0 bg-white/90 animate-fade-in-up delay-150">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-7 w-7 text-purple-600" />
                  <CardTitle className="text-gray-900 text-lg font-bold">AI Insights</CardTitle>
                </div>
                <CardDescription>
                  Get personalized spending insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Discover spending patterns and receive smart suggestions to save money.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200 my-12" />

        {/* Quick Stats Dashboard */}
        <section>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="rounded-xl bg-white/95 shadow-sm hover:shadow-lg transition">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-900 uppercase text-xs tracking-widest">This Month</CardDescription>
                <CardTitle className="text-3xl font-bold">$1,234</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">Total Expenses</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl bg-white/95 shadow-sm hover:shadow-lg transition">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-900 uppercase text-xs tracking-widest">Budget Remaining</CardDescription>
                <CardTitle className="text-3xl font-bold text-green-600">$766</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">61% of budget left</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl bg-white/95 shadow-sm hover:shadow-lg transition">
              <CardHeader className="pb-2">
                <CardDescription className="uppercase text-xs tracking-widest">Top Category</CardDescription>
                <CardTitle className="text-3xl font-bold">Food</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">$456 spent</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl bg-white/95 shadow-sm hover:shadow-lg transition">
              <CardHeader className="pb-2">
                <CardDescription className="uppercase text-xs tracking-widest">Savings Goal</CardDescription>
                <CardTitle className="text-3xl font-bold text-blue-600">78%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">$780 of $1000</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Insights Preview */}
        <section>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 rounded-2xl shadow-md animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <span>AI Insights</span>
              </CardTitle>
              <CardDescription>
                Personalized insights based on your spending patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border flex flex-col shadow-sm">
                  <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                    <span role="img" aria-label="lightbulb">💡</span>
                    You spend <span className="font-bold text-indigo-600">30% more</span> on coffee during exam weeks
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Consider brewing coffee at home during stressful periods to save <span className="font-semibold text-green-700">$45/month</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border flex flex-col shadow-sm">
                  <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                    <span role="img" aria-label="chart">📈</span>
                    Your weekend food spending increased by <span className="font-bold text-purple-600">15%</span> this month
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Try meal prepping on Sundays to reduce weekend food costs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Get Started Section */}
        <section className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to take control of your finances?
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Your First Expense
            </Button>
            <Button variant="outline" size="lg" className="font-semibold border-indigo-400 text-indigo-700 hover:bg-indigo-50">
              View Dashboard
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
