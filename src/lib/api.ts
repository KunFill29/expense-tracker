import { Expense, ExpenseCategory, ExpenseAnalytics } from "../types"

// Constants
const STORAGE_KEYS = {
  EXPENSES: "expenses",
  BUDGET: "budget",
  SETTINGS: "settings",
} as const

const ERROR_MESSAGES = {
  STORAGE_ERROR: "Failed to access local storage",
  INVALID_EXPENSE: "Invalid expense data",
  EXPENSE_NOT_FOUND: "Expense not found",
  INVALID_SETTINGS: "Invalid settings data",
  INVALID_CATEGORY: "Invalid expense category",
} as const

// Types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface Settings {
  budget: number
  currency: string
  theme: "light" | "dark" | "system"
  notifications: boolean
}

// Error handling
class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApiError"
  }
}

// Validation functions
const isValidExpense = (expense: Partial<Expense>): boolean => {
  if (!expense.title || !expense.amount || !expense.date || !expense.category) {
    return false
  }
  
  if (typeof expense.amount !== 'number' || expense.amount <= 0) {
    return false
  }
  
  if (!isValidDate(expense.date)) {
    return false
  }
  
  if (!isValidCategory(expense.category)) {
    return false
  }
  
  return true
}

const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

const isValidCategory = (category: string): category is ExpenseCategory => {
  return [
    "food",
    "transportation",
    "entertainment",
    "utilities",
    "shopping",
    "health",
    "education",
    "other"
  ].includes(category)
}

// Helper functions
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message
  return "An unexpected error occurred"
}

// Local Storage operations
const getFromStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error reading from localStorage: ${handleError(error)}`)
    throw new ApiError(ERROR_MESSAGES.STORAGE_ERROR)
  }
}

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving to localStorage: ${handleError(error)}`)
    throw new ApiError(ERROR_MESSAGES.STORAGE_ERROR)
  }
}

// Data transformation
const formatExpense = (expense: Omit<Expense, "id">): Expense => {
  const date = new Date(expense.date)
  return {
    ...expense,
    id: Date.now().toString(),
    amount: Number(expense.amount.toFixed(2)),
    date: date.toISOString().split('T')[0],
  }
}

// Expense operations
export const getExpenses = (): ApiResponse<Expense[]> => {
  try {
    const expenses = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES) || []
    return { data: expenses, error: null }
  } catch (error) {
    return { data: null, error: handleError(error) }
  }
}

export const addExpense = (expense: Omit<Expense, "id">): ApiResponse<Expense> => {
  try {
    if (!isValidExpense(expense)) {
      throw new ApiError(ERROR_MESSAGES.INVALID_EXPENSE)
    }

    const expenses = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES) || []
    const newExpense = formatExpense(expense)
    saveToStorage(STORAGE_KEYS.EXPENSES, [...expenses, newExpense])
    return { data: newExpense, error: null }
  } catch (error) {
    return { data: null, error: handleError(error) }
  }
}

export const updateExpense = (expense: Expense): ApiResponse<Expense> => {
  try {
    if (!isValidExpense(expense)) {
      throw new ApiError(ERROR_MESSAGES.INVALID_EXPENSE)
    }

    const expenses = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES) || []
    const existingExpense = expenses.find(e => e.id === expense.id)
    
    if (!existingExpense) {
      throw new ApiError(ERROR_MESSAGES.EXPENSE_NOT_FOUND)
    }

    const updatedExpenses = expenses.map((e) =>
      e.id === expense.id ? formatExpense(expense) : e
    )
    saveToStorage(STORAGE_KEYS.EXPENSES, updatedExpenses)
    return { data: expense, error: null }
  } catch (error) {
    return { data: null, error: handleError(error) }
  }
}

export const deleteExpense = (id: string): ApiResponse<void> => {
  try {
    const expenses = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES) || []
    const existingExpense = expenses.find(e => e.id === id)
    
    if (!existingExpense) {
      throw new ApiError(ERROR_MESSAGES.EXPENSE_NOT_FOUND)
    }

    const filteredExpenses = expenses.filter((e) => e.id !== id)
    saveToStorage(STORAGE_KEYS.EXPENSES, filteredExpenses)
    return { data: undefined, error: null }
  } catch (error) {
    return { data: null, error: handleError(error) }
  }
}

// Settings operations
export const getSettings = (): ApiResponse<Settings> => {
  try {
    const defaultSettings: Settings = {
      budget: 2000,
      currency: "USD",
      theme: "system",
      notifications: true,
    }
    const settings = getFromStorage<Settings>(STORAGE_KEYS.SETTINGS) || defaultSettings
    return { data: settings, error: null }
  } catch (error) {
    return { data: null, error: handleError(error) }
  }
}

export const updateSettings = (settings: Partial<Settings>): ApiResponse<Settings> => {
  try {
    const currentSettings = getFromStorage<Settings>(STORAGE_KEYS.SETTINGS) || getSettings().data
    if (!currentSettings) {
      throw new ApiError(ERROR_MESSAGES.INVALID_SETTINGS)
    }
    
    const updatedSettings = { ...currentSettings, ...settings }
    saveToStorage(STORAGE_KEYS.SETTINGS, updatedSettings)
    return { data: updatedSettings, error: null }
  } catch (error) {
    return { data: null, error: handleError(error) }
  }
}

// Export operations
export const exportExpensesToCSV = (expenses: Expense[]): string => {
  const headers = ["Date", "Title", "Category", "Amount"]
  const rows = expenses.map(expense => [
    expense.date,
    expense.title,
    expense.category,
    expense.amount.toFixed(2)
  ])
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n")
  
  return csvContent
}

// Analytics operations
export const getExpenseAnalytics = (expenses: Expense[]): ExpenseAnalytics => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)
  
  const monthlyTotals = expenses.reduce((acc, expense) => {
    const month = expense.date.substring(0, 7) // YYYY-MM
    acc[month] = (acc[month] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)
  
  return {
    totalExpenses: Number(totalExpenses.toFixed(2)),
    categoryTotals,
    monthlyTotals,
    averageExpense: Number((totalExpenses / (expenses.length || 1)).toFixed(2)),
  }
}
