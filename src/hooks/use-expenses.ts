// src/hooks/use-expenses.ts
import { useState, useEffect, useCallback } from "react";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load expenses from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("expenses");
      if (stored) {
        setExpenses(JSON.parse(stored));
      }
      setError(null);
    } catch {
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    } catch {
      // ignore write errors
    }
  }, [expenses]);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...expense,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }, []);

  const editExpense = useCallback((id: string, updated: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updated } : exp))
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  }, []);

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return {
    expenses,
    loading,
    error,
    addExpense,
    editExpense,
    deleteExpense,
    totalAmount,
  };
}
