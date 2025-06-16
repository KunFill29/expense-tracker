// src/components/expense-list.tsx
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, Check, X, AlertCircle } from "lucide-react"
import { Expense, ExpenseCategory } from "@/types"

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
  onEdit: (expense: Expense) => void
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit }) => {
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editForm, setEditForm] = React.useState<Partial<Expense>>({})
  const [editError, setEditError] = React.useState<string | null>(null)

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id)
    setEditForm(expense)
    setEditError(null)
  }

  const handleSave = () => {
    try {
      setEditError(null)
      
      // Validate required fields
      if (!editForm.title?.trim()) {
        throw new Error("Title is required")
      }
      if (!editForm.amount || editForm.amount <= 0) {
        throw new Error("Amount must be greater than 0")
      }
      if (!editForm.date) {
        throw new Error("Date is required")
      }
      if (!editForm.category) {
        throw new Error("Category is required")
      }

      // Validate date is not in future
      const expenseDate = new Date(editForm.date)
      if (expenseDate > new Date()) {
        throw new Error("Date cannot be in the future")
      }

      if (editingId && editForm) {
        onEdit({ ...editForm, id: editingId } as Expense)
        setEditingId(null)
        setEditForm({})
      }
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to save expense")
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
    setEditError(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }))
    setEditError(null)
  }

  const categories: { value: ExpenseCategory; label: string }[] = [
    { value: "food", label: "Food & Dining" },
    { value: "transportation", label: "Transportation" },
    { value: "entertainment", label: "Entertainment" },
    { value: "utilities", label: "Utilities" },
    { value: "shopping", label: "Shopping" },
    { value: "health", label: "Health & Medical" },
    { value: "education", label: "Education" },
    { value: "other", label: "Other" },
  ]

  return (
    <div className="space-y-4">
      {expenses.length === 0 ? (
        <p className="text-gray-600 text-center py-8 font-medium">No expenses added yet</p>
      ) : (
        expenses.map((expense) => (
          <Card key={expense.id} className="bg-white/95 shadow-lg hover:shadow-xl transition">
            <CardContent className="p-4">
              {editingId === expense.id ? (
                <div className="space-y-3">
                  {editError && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {editError}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 bg-white/95 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        name="amount"
                        step="0.01"
                        value={editForm.amount || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 bg-white/95 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm text-gray-800"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={editForm.date || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 bg-white/95 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={editForm.category || ""}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 bg-white/95 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm text-gray-800"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="text-gray-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">{expense.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString()} • {categories.find(c => c.value === expense.category)?.label || expense.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-bold text-gray-800">${expense.amount.toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(expense)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(expense.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

export default ExpenseList
