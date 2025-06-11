import { create } from 'zustand';
import { Expense, Budget, AIInsight } from '@/types';

interface ExpenseStore {
  expenses: Expense[];
  budgets: Budget[];
  insights: AIInsight[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setBudget: (budget: Budget) => void;
  setInsights: (insights: AIInsight[]) => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  budgets: [],
  insights: [],
  addExpense: (expense) =>
    set((state) => ({
      expenses: [
        ...state.expenses,
        {
          ...expense,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),
  updateExpense: (id, expense) =>
    set((state) => ({
      expenses: state.expenses.map((e) =>
        e.id === id ? { ...e, ...expense, updatedAt: new Date() } : e
      ),
    })),
  deleteExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    })),
  setBudget: (budget) =>
    set((state) => ({
      budgets: state.budgets.some((b) => b.id === budget.id)
        ? state.budgets.map((b) => (b.id === budget.id ? budget : b))
        : [...state.budgets, budget],
    })),
  setInsights: (insights) => set({ insights }),
}));