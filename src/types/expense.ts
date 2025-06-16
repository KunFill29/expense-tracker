// src/types/expense.ts
export interface Expense {
  id: string
  title: string
  amount: number
  date: string
  category: string
}

export type ExpenseCategory =
  | "food"
  | "transportation"
  | "entertainment"
  | "utilities"
  | "shopping"
  | "health"
  | "education"
  | "other"

export interface ExpenseAnalytics {
  totalExpenses: number
  categoryTotals: Record<string, number>
  monthlyTotals: Record<string, number>
  averageExpense: number
} 