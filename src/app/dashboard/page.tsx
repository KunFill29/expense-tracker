"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Download, Filter, PlusCircle, Settings } from "lucide-react"
import Dashboard from "@/components/dashboard"
import ExpenseList from "@/components/expense-list"
import ExpenseForm from "@/components/expense-form"
import Modal from "@/components/ui/modal"
import { Expense, ExpenseCategory } from "@/types"
import { getExpenses, addExpense, updateExpense, deleteExpense, getSettings, updateSettings, exportExpensesToCSV } from "@/lib/api"

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budget, setBudget] = useState(2000)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    end: new Date().toISOString().split('T')[0], // Today
  })

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load expenses
        const expensesResponse = await getExpenses()
        if (expensesResponse.error) {
          throw new Error(expensesResponse.error)
        }
        if (expensesResponse.data) {
          setExpenses(expensesResponse.data)
        }

        // Load settings
        const settingsResponse = await getSettings()
        if (settingsResponse.error) {
          throw new Error(settingsResponse.error)
        }
        if (settingsResponse.data) {
          setBudget(settingsResponse.data.budget)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const addExpenseHandler = async (data: { title: string; amount: number; date: string; category: ExpenseCategory }) => {
    try {
      setError(null)
      const response = await addExpense(data)
      if (response.error) {
        throw new Error(response.error)
      }
      if (response.data) {
        setExpenses(prev => [response.data!, ...prev])
        setShowForm(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense")
    }
  }

  const editExpenseHandler = async (updatedExpense: Expense) => {
    try {
      setError(null)
      const response = await updateExpense(updatedExpense)
      if (response.error) {
        throw new Error(response.error)
      }
      if (response.data) {
        setExpenses(prev =>
          prev.map(expense =>
            expense.id === updatedExpense.id ? response.data! : expense
          )
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update expense")
    }
  }

  const deleteExpenseHandler = async (id: string) => {
    try {
      setError(null)
      const response = await deleteExpense(id)
      if (response.error) {
        throw new Error(response.error)
      }
      setExpenses(prev => prev.filter(expense => expense.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense")
    }
  }

  const updateBudgetHandler = async () => {
    try {
      setError(null)
      const response = await updateSettings({ budget })
      if (response.error) {
        throw new Error(response.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update budget")
    }
  }

  const exportExpenses = () => {
    try {
      const csvContent = exportExpensesToCSV(expenses)
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `expenses-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export expenses")
    }
  }

  // Filter expenses by date range
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    endDate.setHours(23, 59, 59, 999) // Include the entire end date
    return expenseDate >= startDate && expenseDate <= endDate
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 flex items-center justify-center">
        <div className="bg-white/90 p-6 rounded-lg shadow-lg">
          <div className="text-red-600 text-xl font-semibold mb-2">Error</div>
          <div className="text-gray-700">{error}</div>
          <Button
            className="mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-9 w-9 text-indigo-700 drop-shadow" />
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
                Expense<span className="text-indigo-700">Dashboard</span>
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={exportExpenses}
                className="text-gray-700 hover:text-gray-900"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl"
                onClick={() => setShowForm(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Expense Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Add New Expense"
      >
        <ExpenseForm onAddExpense={addExpenseHandler} onCancel={() => setShowForm(false)} />
      </Modal>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-white/90 p-1 rounded-lg shadow-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Expenses
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Dashboard expenses={filteredExpenses} budget={budget} />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Expense History</h2>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="rounded-md border-gray-300 bg-white/95 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
                  />
                  <span className="text-gray-600">to</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="rounded-md border-gray-300 bg-white/95 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl"
                  onClick={() => setShowForm(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </div>
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={editExpenseHandler}
              onDelete={deleteExpenseHandler}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/95 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                  Budget Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Budget
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        id="budget"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="pl-8 w-full rounded-md border-gray-300 bg-white/95 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm text-gray-800 font-medium"
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl"
                      onClick={updateBudgetHandler}
                    >
                      Save Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
} 