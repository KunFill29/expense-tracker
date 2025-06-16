"use client";

import React from "react";
import ExpenseList from "@/components/expense-list";
import ExpenseForm from "@/components/expense-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Expense, ExpenseCategory } from "@/types";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "@/lib/api";

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load expenses
  React.useEffect(() => {
    const loadExpenses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getExpenses();
        if (response.error) {
          throw new Error(response.error);
        }
        if (response.data) {
          setExpenses(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const handleAddExpense = async (data: { title: string; amount: number; date: string; category: ExpenseCategory }) => {
    try {
      setError(null);
      const response = await addExpense(data);
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data) {
        setExpenses(prev => [response.data!, ...prev]);
        setShowForm(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense");
    }
  };

  const handleEditExpense = async (updatedExpense: Expense) => {
    try {
      setError(null);
      const response = await updateExpense(updatedExpense);
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data) {
        setExpenses(prev =>
          prev.map(expense =>
            expense.id === updatedExpense.id ? response.data! : expense
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update expense");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setError(null);
      const response = await deleteExpense(id);
      if (response.error) {
        throw new Error(response.error);
      }
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    );
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Expenses</h1>
          <Button
            className="bg-white text-indigo-600 hover:bg-gray-100"
            onClick={() => setShowForm(true)}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <ExpenseForm
              onAddExpense={handleAddExpense}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="bg-white/95 rounded-lg shadow-lg p-6">
          <ExpenseList
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </div>
      </div>
    </div>
  );
}
