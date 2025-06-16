import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, Target, PieChart, BarChart } from "lucide-react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts"
import { Expense, ExpenseCategory } from "@/types"

interface DashboardProps {
  expenses: Expense[]
  budget: number
}

interface PieChartData {
  name: string
  value: number
}

interface BarChartData {
  month: string
  amount: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4']

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

const Dashboard: React.FC<DashboardProps> = ({ expenses, budget }) => {
  // Memoize calculations to prevent unnecessary recalculations
  const totalExpenses = React.useMemo(() => 
    expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  )

  const budgetRemaining = React.useMemo(() => 
    Math.max(budget - totalExpenses, 0),
    [budget, totalExpenses]
  )

  const budgetPercentLeft = React.useMemo(() => 
    (budgetRemaining / budget) * 100,
    [budgetRemaining, budget]
  )

  // Calculate category totals with memoization
  const categoryTotals = React.useMemo(() => 
    expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<ExpenseCategory, number>),
    [expenses]
  )

  // Prepare data for charts with memoization
  const pieChartData = React.useMemo(() => 
    Object.entries(categoryTotals).map(([name, value]) => ({
      name: categoryLabels[name as ExpenseCategory],
      value,
    })),
    [categoryTotals]
  )

  // Calculate monthly trends with memoization
  const monthlyData = React.useMemo(() => {
    const data = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'short' })
      acc[month] = (acc[month] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    // Ensure all months are represented
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map(month => ({
      month,
      amount: data[month] || 0
    }))
  }, [expenses])

  // Calculate spending trends with memoization
  const { lastMonthTotal, previousMonthTotal, spendingTrend } = React.useMemo(() => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

    const lastMonthTotal = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= lastMonth && expenseDate < now
      })
      .reduce((sum, expense) => sum + expense.amount, 0)

    const previousMonthTotal = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= twoMonthsAgo && expenseDate < lastMonth
      })
      .reduce((sum, expense) => sum + expense.amount, 0)

    const spendingTrend = previousMonthTotal ? ((lastMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : 0

    return { lastMonthTotal, previousMonthTotal, spendingTrend }
  }, [expenses])

  // Calculate average daily spending with memoization
  const averageDailySpending = React.useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentExpenses = expenses.filter(expense => 
      new Date(expense.date) >= thirtyDaysAgo
    )

    const total = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    return total / 30
  }, [expenses])

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/95 shadow-lg hover:shadow-xl transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 uppercase tracking-widest">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpenses)}</div>
              <Wallet className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 shadow-lg hover:shadow-xl transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 uppercase tracking-widest">
              Budget Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(budgetRemaining)}</div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {budgetPercentLeft.toFixed(0)}% of budget left
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 shadow-lg hover:shadow-xl transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 uppercase tracking-widest">
              Spending Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">
                {spendingTrend > 0 ? '+' : ''}{spendingTrend.toFixed(1)}%
              </div>
              {spendingTrend > 0 ? (
                <TrendingUp className="h-8 w-8 text-red-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-green-600" />
              )}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 shadow-lg hover:shadow-xl transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 uppercase tracking-widest">
              Average Daily
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(averageDailySpending)}
              </div>
              <BarChart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Last 30 days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="bg-white/95 shadow-lg hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
              Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: { name: string; percent: number }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="bg-white/95 shadow-lg hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-indigo-600" />
              Monthly Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="amount" fill="#8884d8" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard 