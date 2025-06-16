import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, TrendingUp, TrendingDown, Lightbulb, ArrowRight } from "lucide-react"
import { Expense, ExpenseCategory } from "@/types"

interface AIInsightsProps {
  expenses: Expense[]
  budget: number
}

const categoryLabels: Record<ExpenseCategory, string> = {
  food: "Food & Dining",
  transportation: "Transportation",
  entertainment: "Entertainment",
  utilities: "Utilities",
  shopping: "Shopping",
  health: "Health & Medical",
  education: "Education",
  other: "Other"
}

const AIInsights: React.FC<AIInsightsProps> = ({ expenses, budget }) => {
  // Calculate spending patterns
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageExpense = totalExpenses / (expenses.length || 1)
  
  // Calculate category distribution
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<ExpenseCategory, number>)

  // Find top spending category
  const topCategory = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0]

  // Calculate spending trend
  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    return expenseDate >= lastMonth
  })

  const previousMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    return expenseDate >= twoMonthsAgo && expenseDate < lastMonth
  })

  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const spendingTrend = previousMonthTotal ? ((lastMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : 0

  // Generate insights
  const insights = [
    {
      type: "spending_trend",
      title: "Spending Trend",
      description: spendingTrend > 0 
        ? `Your spending has increased by ${Math.abs(spendingTrend).toFixed(1)}% compared to last month.`
        : `Your spending has decreased by ${Math.abs(spendingTrend).toFixed(1)}% compared to last month.`,
      icon: spendingTrend > 0 ? TrendingUp : TrendingDown,
      color: spendingTrend > 0 ? "text-red-600" : "text-green-600"
    },
    {
      type: "budget_health",
      title: "Budget Health",
      description: totalExpenses > budget
        ? `You've exceeded your monthly budget by ${((totalExpenses - budget) / budget * 100).toFixed(1)}%.`
        : `You're under budget by ${((budget - totalExpenses) / budget * 100).toFixed(1)}%.`,
      icon: AlertCircle,
      color: totalExpenses > budget ? "text-red-600" : "text-green-600"
    },
    {
      type: "top_category",
      title: "Top Spending Category",
      description: topCategory
        ? `${categoryLabels[topCategory[0] as ExpenseCategory]} accounts for ${((topCategory[1] / totalExpenses) * 100).toFixed(1)}% of your expenses.`
        : "No spending data available.",
      icon: Lightbulb,
      color: "text-blue-600"
    }
  ]

  // Generate recommendations
  const recommendations = [
    {
      title: "Budget Adjustment",
      description: totalExpenses > budget
        ? "Consider increasing your monthly budget or reducing expenses in high-spending categories."
        : "You're managing your budget well. Consider setting aside some savings.",
      icon: ArrowRight
    },
    {
      title: "Category Optimization",
      description: topCategory && (topCategory[1] / totalExpenses) > 0.4
        ? `Your spending in ${categoryLabels[topCategory[0] as ExpenseCategory]} is quite high. Look for ways to optimize expenses in this category.`
        : "Your spending is well-distributed across categories.",
      icon: ArrowRight
    },
    {
      title: "Spending Pattern",
      description: spendingTrend > 10
        ? "Your spending is increasing significantly. Review your recent expenses to identify areas for cost reduction."
        : spendingTrend < -10
        ? "Great job reducing your expenses! Keep up the good work."
        : "Your spending is relatively stable. Continue monitoring your expenses.",
      icon: ArrowRight
    }
  ]

  return (
    <div className="space-y-6">
      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight) => (
          <Card key={insight.type} className="bg-white/95 shadow-lg hover:shadow-xl transition">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <insight.icon className={`h-5 w-5 ${insight.color}`} />
                <CardTitle className="text-sm font-medium text-gray-700 uppercase tracking-widest">
                  {insight.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="bg-white/95 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <recommendation.icon className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800">{recommendation.title}</h4>
                  <p className="text-sm text-gray-600">{recommendation.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIInsights
