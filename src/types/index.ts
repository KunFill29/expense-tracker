export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
}

export type ExpenseCategory =
  | "food"
  | "transportation"
  | "entertainment"
  | "utilities"
  | "shopping"
  | "health"
  | "education"
  | "other";

export interface ExpenseAnalytics {
  totalExpenses: number;
  categoryTotals: Record<string, number>;
  monthlyTotals: Record<string, number>;
  averageExpense: number;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  amount: number;
  spent: number;
  month: string;
}

export interface AIInsight {
  id: string;
  type: 'behavioral' | 'predictive' | 'comparison';
  message: string;
  impact: 'low' | 'medium' | 'high';
  suggestion?: string;
  createdAt: Date;
}